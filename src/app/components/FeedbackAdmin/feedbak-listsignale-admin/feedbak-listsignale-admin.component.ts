import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/core/models/feedback';
import { FeedbackService } from 'src/app/services/feedbacks.service';

@Component({
  selector: 'app-feedbak-listsignale-admin',
  templateUrl: './feedbak-listsignale-admin.component.html',
  styleUrls: ['./feedbak-listsignale-admin.component.css']
})
export class FeedbakListsignaleAdminComponent implements OnInit {
  reportedFeedbacks: Feedback[] = []; // Liste des feedbacks signalés

  constructor(private feedbackService: FeedbackService) { }

  ngOnInit(): void {
    this.getReportedFeedbacks(); // Récupérer les feedbacks signalés lors de l'initialisation du composant
  }

  // Fonction pour récupérer les feedbacks signalés depuis l'API
  getReportedFeedbacks(): void {
    this.feedbackService.getReportedFeedbacks().subscribe({
      next: (data) => {
        // Injecter showReason = false dans chaque feedback
        this.reportedFeedbacks = data.map(fb => ({ ...fb, showReason: false }));
      },
      error: (err) => {
        console.error('Error fetching reported feedbacks:', err);
      }
    });
  }
  

  // Fonction pour supprimer un feedback signalé
  deleteReportedFeedback(id: number): void {
    if (id) {
      this.feedbackService.deleteReportedFeedback(id).subscribe({
        next: () => {
          this.reportedFeedbacks = this.reportedFeedbacks.filter(fb => fb.id !== id); // Mettre à jour la liste après la suppression
          alert('Feedback deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting reported feedback:', err);
          alert('Failed to delete reported feedback');
        }
      });
    }
  }

  toggleReason(selectedFb: Feedback): void {
    this.reportedFeedbacks.forEach(fb => {
      fb.showReason = fb === selectedFb ? !fb.showReason : false;
    });
  }

   // Reject a reported feedback
   rejectFeedback(id: number): void {
    this.feedbackService.rejectFeedback(id).subscribe({
      next: () => {
        this.reportedFeedbacks = this.reportedFeedbacks.filter(fb => fb.id !== id);
        alert('Feedback rejected successfully!');
      },
      error: (err) => {
        console.error('Error rejecting feedback:', err);
        alert('Failed to reject feedback');
      }
    });
  }
  
}
