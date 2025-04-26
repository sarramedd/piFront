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
  userId: string | null = ''; // Declare userId as a class property
  


  
  

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

  defaultProfileImage = 'assets/images/Capture.png';
  activeFeedback: Feedback | null = null;
  selectedTab: Reaction | 'ALL' = 'ALL';

  constructor(
    private feedbackService: FeedbacksService,
    private reactsService: ReactsService,
      private cdRef: ChangeDetectorRef,
      private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // Retrieve the user ID from localStorage
    this.userId = localStorage.getItem('userId');
    if (!this.userId) {
      alert("User not logged in");
      return;
    }
  
    // Retrieve the user details (cin, name, email, etc.)
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData || !userData.id) {
      alert("User data not found");
      return;
    }
    this.loadFeedbacksWithReactions();
  
    this.feedbackService.getAllFeedbacks().subscribe(
      (data: Feedback[]) => {
        console.log("Fetched feedbacks:", data);

        // Initialize feedbacks with empty reacts array
        this.feedbacks = data.map(fb => ({
          ...fb,
          showReacts: false,
          reacts: []
        }));
  
        // Fetch reactions for each feedback with proper change detection
        this.feedbacks.forEach(fb => {
          this.reactsService.getReactionsForFeedback(fb.id!).subscribe(
            (reacts: Reacts[]) => {
              // Create new array reference to trigger change detection
              this.feedbacks = this.feedbacks.map(f => 
                f.id === fb.id ? {...f, reacts: [...reacts]} : f
              );
              
              console.log(`Loaded reacts for feedback ID ${fb.id}`, reacts);
              
              // Sort feedbacks by popularity after updating reactions
              this.sortFeedbacksByPopularity();
            },
            (error) => {
              console.error(`Error fetching reacts for feedback ID ${fb.id}`, error);
              // Still update the array to trigger change detection, with empty reacts
              this.feedbacks = this.feedbacks.map(f => 
                f.id === fb.id ? {...f, reacts: []} : f
              );
            }
          );
        });
      },
      (error) => {
        console.error('Error loading feedbacks', error);
        this.errorMessage = 'Failed to load feedbacks';
      }
    );
}

// Helper method to sort feedbacks by popularity
private sortFeedbacksByPopularity(): void {
    this.feedbacks.sort((a, b) => {
      const scoreA = this.getFeedbackPopularityScore(a);
      const scoreB = this.getFeedbackPopularityScore(b);
      return scoreB - scoreA; // Sort from most to least popular
    });
    
    // Trigger change detection explicitly
    this.cdRef.detectChanges();
}
  
  

  addReaction(feedback: Feedback, reactionType: Reaction): void {
    if (!this.userId) {
      alert("User not logged in");
      return;
    }
    const react = {
      reaction: reactionType,
      date: new Date().toISOString(),
      user: { id: 1 },
      feedback: { id: feedback.id }
    };
  
    this.reactsService.addReaction(react).subscribe(
      () => {
        this.ngOnInit();
        this.successMessage = '✅ Réaction ajoutée avec succès !';
        alert(this.successMessage); // Optional: only if you want a popup
      },
      (error: any) => {
        console.error('Error adding reaction', error);
        this.errorMessage = '❌ Échec de l\'ajout de la réaction';
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
    this.ngZone.run(() => {
      this.activeFeedback = feedback;
      this.cdRef.detectChanges();
    });
    this.activeFeedback = feedback;
    this.selectedTab = 'ALL';
    console.log('Modal opened for feedback:', feedback);
    console.log('Reacts for feedback:', feedback.reacts);
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
    // Ensure reacts is always an array, even if it's undefined or not an array
    const reacts = Array.isArray(feedback.reacts) ? feedback.reacts : [];
    return reacts.filter(r => r.reaction === 'LIKE' || r.reaction === 'LOVE').length;
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
    this.feedbackService.updateFeedback({
      id: feedback.id,
      message: this.editedMessage,
      // Include other required fields
      userId: feedback.user?.id
    }).subscribe({
      next: () => {
        this.editingFeedbackId = null;
        this.loadFeedbacksWithReactions();
        this.successMessage = '✅ Feedback updated successfully!';
      },
      error: (err) => {
        console.error('Update error:', err);
        this.errorMessage = err.message || 'Update failed';
      }
    });
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
  }
  loadFeedbacksWithReactions() {
    this.feedbackService.getAllFeedbacks().subscribe({
        next: (feedbacks: Feedback[]) => {
            this.feedbacks = feedbacks.map(fb => ({
                ...fb,
                showReacts: false,
                reacts: []
            }));

            // Load reactions for each feedback
            this.feedbacks.forEach(fb => {
                this.loadReactionsForFeedback(fb.id!);
            });
        },
        error: (err) => {
            console.error('Error loading feedbacks', err);
            this.errorMessage = 'Failed to load feedbacks';
        }
    });
}

loadReactionsForFeedback(feedbackId: number) {
  this.reactsService.getReactionsForFeedback(feedbackId).subscribe({
    next: (reacts: Reacts[]) => {
      // No need to check Array.isArray here since service handles it
      this.feedbacks = this.feedbacks.map(fb => 
        fb.id === feedbackId ? { ...fb, reacts: [...reacts] } : fb
      );
      this.sortFeedbacksByPopularity();
    },
    error: (err) => {
      console.error(`Error loading reactions for feedback ${feedbackId}`, err);
      this.feedbacks = this.feedbacks.map(fb => 
        fb.id === feedbackId ? { ...fb, reacts: [] } : fb
      );
    }
  });
}

// In your component
getAvatarUrl(userId: number): string {
  return `/api/users/${userId}/avatar`;
}

handleReaction(feedback: Feedback, reaction: Reaction): void {
  // If clicking the same reaction, remove it
  if (feedback.currentUserReaction === reaction) {
    this.reactsService.removeReaction(feedback.id!).subscribe({
      next: () => {
        feedback.currentUserReaction = null;
        this.updateReactionCounts(feedback);
      },
      error: (err) => {
        console.error('Error removing reaction:', err);
        this.errorMessage = 'Failed to remove reaction';
      }
    });
    return;
  }
  
  // Otherwise, add/update the reaction
  this.reactsService.addOrUpdateReaction(feedback.id!, reaction).subscribe({
    next: (updatedReact) => {
      feedback.currentUserReaction = reaction;
      this.updateReactionCounts(feedback);
    },
    error: (err) => {
      console.error('Error adding reaction:', err);
      this.errorMessage = 'Failed to add reaction';
    }
  });
}
private updateReactionCounts(feedback: Feedback): void {
  // Call your service to refresh reaction counts
  this.reactsService.getReactionsForFeedback(feedback.id!).subscribe({
    next: (reacts) => {
      feedback.reacts = reacts;
    }
  });
}


}