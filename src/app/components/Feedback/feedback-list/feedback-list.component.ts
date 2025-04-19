import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Feedback } from 'src/app/core/models/feedback';
import { Reaction, Reacts } from 'src/app/core/models/reacts';
import { FeedbackService } from 'src/app/services/feedbacks.service';
import { ReactsService } from 'src/app/services/reacts.service';

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
    private feedbackService: FeedbackService,
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
    console.log('Modal opened for feedback:', feedback); // ← ajoute ceci
    this.selectedTab = 'ALL';
  }
  closeModal(): void {
    this.activeFeedback = null;
  }

  selectTab(type: Reaction | 'ALL'): void {
    this.selectedTab = type;
  }

  getReactionCount(reacts: Reacts[], type: Reaction): number {
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
  
  
  reportFeedback(feedback: Feedback): void {
    console.log('Signalement de ce feedback à l\'admin:', feedback);
  
    if (feedback.id !== undefined) {
      this.feedbackService.reportFeedback(feedback.id).subscribe(
        (response: string) => {
          alert(response); // Afficher le message retourné par le serveur
          feedback.reported = true; // Mettre à jour l'état local du feedback
        },
        (error) => {
          console.error('Erreur lors du signalement:', error);
          this.errorMessage = 'Échec du signalement du feedback';
        }
      );
    } else {
      console.error('Feedback ID is undefined');
      this.errorMessage = 'ID de feedback non valide';
    }
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
  }
  
  
  
  
}