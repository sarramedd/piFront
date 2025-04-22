import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Feedback } from 'src/app/core/models/feedback';
import { Reaction, Reacts } from 'src/app/core/models/reacts';
import { FeedbacksService } from 'src/app/services/FeedbackService/feedbacks.service';
import { ReactsService } from 'src/app/services/FeedbackService/reacts.service';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit {
  feedbacks: Feedback[] = [];
  errorMessage: string = '';
  reactions: Reaction[] = ['LIKE', 'DISLIKE', 'LOVE', 'LAUGH', 'SAD', 'ANGRY'];
  editingFeedbackId: number | null = null;
  editedMessage: string = '';
  openedMenuFeedbackId: number | null = null;
  successMessage: string = '';
  reasonForReport: string = ''; // Add this to store the reason
  reportModalOpen: boolean = false; // Toggle for report modal
  reportingFeedback: Feedback | null = null;


  
  

  // Mapping des types de réactions aux émojis
  reactionEmojis: { [key in Reaction]: string } = {
    LIKE: '👍',
    DISLIKE: '👎',
    LOVE: '❤️',
    LAUGH: '😂',
    SAD: '😢',
    ANGRY: '😡'
  };

  reactionButtonEmojis: { [key in Reaction]: { emoji: string, label: string } } = {
    LIKE: { emoji: '👍', label: 'Like' },
    DISLIKE: { emoji: '👎', label: 'Dislike' },
    LOVE: { emoji: '❤️', label: 'Love' },
    LAUGH: { emoji: '😂', label: 'Laugh' },
    SAD: { emoji: '😢', label: 'Sad' },
    ANGRY: { emoji: '😡', label: 'Angry' },
  };

  defaultProfileImage = 'https://via.placeholder.com/40';
  activeFeedback: Feedback | null = null;
  selectedTab: Reaction | 'ALL' = 'ALL';

  constructor(
    private feedbackService: FeedbacksService,
    private reactsService: ReactsService,
      private cdRef: ChangeDetectorRef,
      private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.feedbackService.getAllFeedbacks().subscribe(
      (data: Feedback[]) => {
        // Étape 1 : Ajouter showReacts à chaque feedback
        this.feedbacks = data.map(fb => ({
          ...fb,
          showReacts: false
        }));
  
        // 🔧 Étape 2 : Trier les feedbacks par popularité
        this.feedbacks.sort((a, b) => {
          const scoreA = this.getFeedbackPopularityScore(a);
          const scoreB = this.getFeedbackPopularityScore(b);
          return scoreB - scoreA; // Du plus populaire au moins populaire
        });
      },
      (error) => {
        console.error('Error loading feedbacks', error);
        this.errorMessage = 'Failed to load feedbacks';
      }
    );
  }
  

  addReaction(feedback: Feedback, reactionType: Reaction): void {
    const react = {
      reaction: reactionType,
      date: new Date().toISOString(),
      user: { id: 1 },
      feedback: { id: feedback.id }
    };

    this.reactsService.addReaction(react).subscribe(
      () => this.ngOnInit(),
      (error: any) => {
        console.error('Error adding reaction', error);
        this.errorMessage = 'Failed to add reaction';
      }
    );
  }

  getReactionEmoji(reaction: Reaction): string {
    return this.reactionEmojis[reaction] || '❓';
  }

  getButtonEmoji(reaction: Reaction): string {
    return this.reactionButtonEmojis[reaction]?.emoji || '❓';
  }

  getButtonLabel(reaction: Reaction): string {
    return this.reactionButtonEmojis[reaction]?.label || 'Unknown';
  }

  onMouseOver(event: MouseEvent): void {
    const emojiElement = event.target as HTMLElement;
    emojiElement.style.transform = 'scale(1.5)';
  }

  onMouseOut(event: MouseEvent): void {
    const emojiElement = event.target as HTMLElement;
    emojiElement.style.transform = 'scale(1)';
  }

  scaleUp(event: MouseEvent): void {
    const button = event.target as HTMLElement;
    button.style.transition = 'transform 0.2s ease';
    button.style.transform = 'scale(1.2)';
  }

  scaleDown(event: MouseEvent): void {
    const button = event.target as HTMLElement;
    button.style.transition = 'transform 0.2s ease';
    button.style.transform = 'scale(1)';
  }

  toggleReactsVisibility(feedback: Feedback): void {
    feedback.showReacts = !feedback.showReacts;
  }

  openReactionModal(feedback: Feedback): void {
    this.activeFeedback = feedback;
    this.selectedTab = 'ALL';
    console.log('Modal opened for feedback:', feedback); // ← ajoute ceci
    this.selectedTab = 'ALL';
    
  }
  closeModal(): void {
    this.activeFeedback = null;
  }

  selectTab(type: Reaction | 'ALL'): void {
    this.selectedTab = type;
  }

  getReactionCount(reacts: Reacts[] | undefined, type: Reaction): number {
    // Si reacts est undefined, renvoyer 0
    if (!reacts) {
      return 0;
    }
  
    // Sinon, compter le nombre de réactions pour le type donné
    return reacts.filter(r => r.reaction === type).length;
  }
  

  get filteredReacts(): Reacts[] {
    if (!this.activeFeedback?.reacts) return [];
    if (this.selectedTab === 'ALL') return this.activeFeedback.reacts;
    return this.activeFeedback.reacts.filter(r => r.reaction === this.selectedTab);
  }
  
  trackByFeedbackId(index: number, item: Feedback): number {
    return item.id ?? index; // fallback to index if id is undefined
  }
  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    const initials = parts.map(p => p.charAt(0).toUpperCase());
    return initials.slice(0, 2).join('');
  }

  getFeedbackPopularityScore(feedback: Feedback): number {
    if (!feedback.reacts) return 0;
    return feedback.reacts.filter(r => r.reaction === 'LIKE' || r.reaction === 'LOVE').length;
  }

  startEditing(feedback: Feedback): void {
    this.editingFeedbackId = feedback.id || null;
    this.editedMessage = feedback.message;
  }
  
  cancelEditing(): void {
    this.editingFeedbackId = null;
    this.editedMessage = '';
  }
  
  submitEdit(feedback: Feedback): void {
    const updatedFeedback: Feedback = {
      ...feedback,
      message: this.editedMessage,
    };
  
    this.feedbackService.updateFeedback(updatedFeedback).subscribe(
      () => {
        this.editingFeedbackId = null;
        this.ngOnInit(); // Refresh the feedback list
      },
      (error) => {
        console.error('Update failed', error);
        this.errorMessage = 'Failed to update feedback';
      }
    );
  }

  toggleMenu(id: number | undefined): void {
    if (id !== undefined) {
      this.openedMenuFeedbackId = this.openedMenuFeedbackId === id ? null : id;
    }
  }
  
  
 // Report Feedback method, updated to include the reason
 reportFeedback(): void {
  const feedback = this.reportingFeedback;
  if (!feedback || !feedback.id) {
    alert("⚠️ Feedback non valide.");
    return;
  }

  if (this.reasonForReport.trim()) {
    this.feedbackService.reportFeedback(feedback.id, this.reasonForReport).subscribe(
      (response: string) => {
        console.log(response); // This will log "Feedback reported successfully"
        alert("✅ Feedback signalé avec succès !");
        feedback.reported = true;
        feedback.reason = this.reasonForReport;
        this.closeReportModal();
      },
      (error) => {
        console.error("Erreur complète :", error);
        alert("✅ Feedback signalé avec succès !");
      
      }
    );    
  } else {
    alert("⚠️ Vous devez fournir une raison pour signaler ce feedback.");
    this.errorMessage = 'Vous devez fournir une raison pour signaler';
  }
}




// Open the report modal with the reason input
openReportModal(feedback: Feedback): void {
  this.reportingFeedback = feedback;
  this.reasonForReport = ''; // Clear previous reason
  this.reportModalOpen = true;
 
}

// Close the report modal
closeReportModal(): void {
  this.reportModalOpen = false;
}
getTotalReactions(feedback: Feedback): number {
  return feedback.reacts ? feedback.reacts.length : 0;
}
  
  
  
  deleteFeedback(id: number | undefined): void {
    if (id !== undefined) {
      this.feedbackService.deleteFeedback(id.toString()).subscribe({
        next: () => {
          this.feedbacks = this.feedbacks.filter(fb => fb.id !== id);
          this.successMessage = 'Feedback supprimé avec succès !';
          this.errorMessage = '';
  
          alert('Feedback supprimé avec succès !');
  
          this.ngZone.run(() => {
            this.cdRef.detectChanges();
          });
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
          this.errorMessage = 'Échec de la suppression du feedback';
          this.successMessage = '';
  
          alert('Échec de la suppression du feedback');
        }
      });
    }
  }}