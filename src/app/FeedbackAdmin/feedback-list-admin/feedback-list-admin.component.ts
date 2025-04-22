import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Feedback } from 'src/app/core/models/feedback';
import { FeedbacksService } from 'src/app/services/FeedbackService/feedbacks.service';
import { ReactsService } from 'src/app/services/FeedbackService/reacts.service';

@Component({
  selector: 'app-feedback-list-admin',
  templateUrl: './feedback-list-admin.component.html',
  styleUrls: ['./feedback-list-admin.component.css']
})
export class FeedbackListAdminComponent {
  feedbacks: Feedback[] = [];
  filteredFeedbacks: Feedback[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  searchQuery: string = '';
  isAdmin: boolean = true;
  selectedReactId: number | null = null; // Store the selected reaction for deletion

  constructor(
    private feedbackService: FeedbacksService,
    private reactService: ReactsService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllFeedbacks();
  }

  getAllFeedbacks() {
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (data) => {
        this.feedbacks = data.map(feedback => ({
          ...feedback,
          reacts: feedback.reacts || []  
        }));
        this.filteredFeedbacks = [...this.feedbacks];
        console.log('Feedbacks:', this.feedbacks);
      },
      error: (err) => {
        console.error('Error fetching feedbacks:', err);
      }
    });
  }

  deleteFeedback(id: number | undefined) {
    if (id !== undefined) {
      this.feedbackService.deleteFeedback(id.toString()).subscribe({
        next: () => {
          // Remove feedback from the list after successful deletion
          this.feedbacks = this.feedbacks.filter(fb => fb.id !== id);
          this.filteredFeedbacks = this.filteredFeedbacks.filter(fb => fb.id !== id); // Update filtered list
          this.successMessage = 'Feedback deleted successfully!';
          this.errorMessage = ''; // Clear any previous error message

          // Show success alert
          alert('Feedback deleted successfully!');
          
          // Update view without refresh
          this.ngZone.run(() => {
            this.cdRef.detectChanges();
          });
        },
        error: (err) => {
          console.error('Error deleting feedback:', err);
          this.errorMessage = 'Failed to delete feedback';
          this.successMessage = ''; // Clear any previous success message

          // Show error alert
          alert('Failed to delete feedback');
        }
      });
    }
  }

  deleteReact(reactId: number) {
    if (reactId !== null) {
      this.reactService.deleteReact(reactId).subscribe({
        next: () => {
          // Successfully deleted, now update the feedback's reacts list
          this.feedbacks.forEach(fb => {
            fb.reacts = fb.reacts?.filter(react => react.id !== reactId);
          });
          // Set success message
          this.successMessage = 'Reaction deleted successfully!';
          this.errorMessage = '';
          
          // Ensure Angular detects the changes
          this.ngZone.run(() => {
            this.cdRef.detectChanges();
          });
          
          // Hide the popup
          this.selectedReactId = null;
        },
        error: (err) => {
          console.error('Error deleting reaction:', err);
          this.errorMessage = 'Failed to delete reaction';
          this.successMessage = '';
        }
      });
    }
  }
  

  filterFeedbacks() {
    if (!this.searchQuery) {
      this.filteredFeedbacks = [...this.feedbacks];
      return;
    }
  
    const lowerCaseQuery = this.searchQuery.toLowerCase();
  
    this.filteredFeedbacks = this.feedbacks.filter(fb => {
      const fbDate = new Date(fb.date);
      const formattedDate = fbDate.toLocaleDateString();
  
      return fb.message.toLowerCase().includes(lowerCaseQuery) || 
             formattedDate.includes(lowerCaseQuery);
    });
  }


  showReactionsPopup: boolean = false;
  selectedReactions: any[] = [];
  
  openReactionsPopup(reacts: any[]) {
    this.selectedReactions = reacts;
    this.showReactionsPopup = true;
  }
  
  closeReactionsPopup() {
    this.selectedReactions = [];
    this.showReactionsPopup = false;
  }
  confirmDeleteReaction(id: number) {
    this.selectedReactId = id;
    this.showReactionsPopup = false; // Close popup before confirming
  }
  goToReportedFeedbacks() {
    this.router.navigate(['/dashboard/reported-Feedbacks']);
  }
  
  goToStatistics() {
    this.router.navigate(['/dashboard/feedbackschart']);
  }

}
