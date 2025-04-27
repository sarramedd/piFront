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
  activePicker: number | null = null; // For reaction picker
  reactionAnimation: string | null = null; // For animation effects
  private hidePickerTimeout: any = null;

  
  

  // Mapping des types de réactions aux émojis
  reactionEmojis: { [key in Reaction]: string } = {
    LIKE: '👍',
    DISLIKE: '👎',
    LOVE: '❤️',
    LAUGH: '😂',
    SAD: '😢',
    ANGRY: '😡'
    
  };

  eactionLabels: { [key in Reaction]: string } = {
    LIKE: 'Like',
    DISLIKE: 'Dislike',
    LOVE: 'Love',
    LAUGH: 'Haha',
    SAD: 'Sad',
    ANGRY: 'Angry'
  };

  defaultProfileImage = 'assets/images/Capture.png';
  activeFeedback: Feedback | null = null;
  selectedTab: Reaction | 'ALL' = 'ALL';

  constructor(
    private feedbackService: FeedbacksService,
    private reactsService: ReactsService,
      private cdRef: ChangeDetectorRef,
      private ngZone: NgZone,
      private route: ActivatedRoute
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
    if (!userData?.id) {
      alert("User data not found");
      return;
    }

    this.loadFeedbacksWithReactions();
    
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (data: Feedback[]) => {
        // Debugging logs (conservés inchangés)
        console.log("Raw feedback data:", data);
        console.log("First feedback analysis:", {
          score: data[0]?.sentimentScore,
          reaction: data[0]?.suggestedReaction
        });
        
        // Detailed analysis of all feedbacks (conservé inchangé)
        console.log("Fetched feedbacks with analysis:", data.map(fb => ({
          id: fb.id,
          message: fb.message,
          suggestedReaction: fb.suggestedReaction,
          sentimentScore: fb.sentimentScore,
          hasSuggestedReaction: fb.suggestedReaction !== undefined && fb.suggestedReaction !== null,
          hasSentimentScore: fb.sentimentScore !== undefined && fb.sentimentScore !== null
        })));
    
        // Initialize feedbacks - SEULE PARTIE MODIFIÉE
        this.feedbacks = data.map(fb => {
          const feedbackWithDefaults = {
            ...fb,
            // Modification ici pour une meilleure gestion des valeurs par défaut
            sentimentScore: fb.sentimentScore !== undefined && fb.sentimentScore !== null 
              ? fb.sentimentScore 
              : 0.5,
            suggestedReaction: this.getSafeSuggestedReaction(fb),
            showReacts: false,
            reacts: fb.reacts || [],
            currentUserReaction: this.getUserReaction(fb, parseInt(this.userId!))
          };
          
          // Debug individual feedback (conservé inchangé)
          if (fb.message === 'Excellent') {
            console.log('Excellent feedback analysis:', {
              original: fb.sentimentScore,
              mapped: feedbackWithDefaults.sentimentScore,
              originalReaction: fb.suggestedReaction,
              mappedReaction: feedbackWithDefaults.suggestedReaction
            });
          }
          
          return feedbackWithDefaults;
        });
    
        // Fetch reactions for each feedback (conservé inchangé)
        this.feedbacks.forEach(fb => {
          this.loadReactionsForFeedback(fb.id!);
        });
    
        // Verify the first few feedbacks in UI (conservé inchangé)
        console.log("First 3 feedbacks for UI:", this.feedbacks.slice(0, 3));
      },
      error: (error) => {
        console.error('Error loading feedbacks', error);
        this.errorMessage = 'Failed to load feedbacks';
      }
    });
}

private getUserReaction(feedback: Feedback, userId: number): Reaction | null {
  if (!feedback.reacts) return null;
  const userReact = feedback.reacts.find(react => react.user?.id === userId);
  return userReact?.reaction || null;
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

  /*getButtonEmoji(reaction: Reaction): string {
    return this.reactionButtonEmojis[reaction]?.emoji || '❓';
  }

  getButtonLabel(reaction: Reaction): string {
    return this.reactionButtonEmojis[reaction]?.label || 'Unknown';
  }*/

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
      userId: feedback.user?.id
    }).subscribe({
      next: (updatedFeedback) => {
        // Update local state
        const index = this.feedbacks.findIndex(f => f.id === feedback.id);
        if (index !== -1) {
          this.feedbacks[index] = {
            ...this.feedbacks[index],
            message: updatedFeedback.message,
            user: {
              id: updatedFeedback.userId,
              name: updatedFeedback.userName,
              email: updatedFeedback.userEmail,
            
            }
          };
        }
        
        this.editingFeedbackId = null;
        this.successMessage = 'Feedback updated successfully!';
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Update error:', err);
        this.errorMessage = err.message;
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
    // Store current user data by feedback ID
    const currentUserData = new Map<number, any>();
    this.feedbacks.forEach(fb => {
      if (fb.id && fb.user) {
        currentUserData.set(fb.id, fb.user);
      }
    });
  
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (feedbacks: Feedback[]) => {
        this.feedbacks = feedbacks.map(fb => {
          const user = currentUserData.get(fb.id!) || fb.user;
          return {
            ...fb,
            user, // Preserve existing user data if available
            showReacts: false,
            reacts: [],
            currentUserReaction: this.getUserReaction(fb, parseInt(this.userId!))
          };
        });
  
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
  if (feedback.currentUserReaction === reaction) {
    // Remove reaction if same one clicked
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
  } else {
    // Add/update reaction
    this.reactsService.addOrUpdateReaction(feedback.id!, reaction).subscribe({
      next: (updatedReact) => {
        feedback.currentUserReaction = reaction;
        this.reactionAnimation = reaction;
        this.updateReactionCounts(feedback);
        setTimeout(() => this.reactionAnimation = null, 300);
      },
      error: (err) => {
        console.error('Error adding reaction:', err);
        this.errorMessage = 'Failed to add reaction';
      }
    });
  }
}
// Update reaction counts after changes
private updateReactionCounts(feedback: Feedback): void {
  this.reactsService.getReactionsForFeedback(feedback.id!).subscribe({
    next: (reacts) => {
      feedback.reacts = reacts;
      this.sortFeedbacksByPopularity();
    },
    error: (err) => console.error('Error loading reactions:', err)
  });
}


// Show reaction picker on hover
showReactionPicker(feedback: Feedback): void {
  this.activePicker = feedback.id || null;
  this.cancelHideReactionPicker();
}

hideReactionPicker(feedback: Feedback): void {
  if (this.activePicker === feedback.id) {
    this.activePicker = null;
  }
}
hideReactionPickerWithDelay(feedback: Feedback): void {
  // Add a small delay to allow movement to the picker
  this.hidePickerTimeout = setTimeout(() => {
    this.hideReactionPicker(feedback);
  }, 300);
}
cancelHideReactionPicker(): void {
  if (this.hidePickerTimeout) {
    clearTimeout(this.hidePickerTimeout);
    this.hidePickerTimeout = null;
  }
}
// Get top 3 reactions for summary display
getTopReactions(feedback: Feedback): Reaction[] {
  if (!feedback.reacts || feedback.reacts.length === 0) return [];
  
  const reactionCounts = this.reactions.map(reaction => ({
    reaction,
    count: this.getReactionCount(feedback.reacts || [], reaction)
  }));

  return reactionCounts
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(item => item.reaction);
}

// In your component class
getSafeSentimentScore(feedback: Feedback): number {
  return feedback.sentimentScore ?? 0.5;
}

getSafeSuggestedReaction(feedback: Feedback): Reaction {
  if (!feedback.suggestedReaction) return 'DISLIKE';
  const validReactions = [...this.reactions, 'DISLIKE'];
  return validReactions.includes(feedback.suggestedReaction as Reaction) 
    ? feedback.suggestedReaction as Reaction 
    : 'DISLIKE';
}




}