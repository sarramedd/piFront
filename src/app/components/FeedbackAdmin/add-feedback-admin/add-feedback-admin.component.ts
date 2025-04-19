import { Component } from '@angular/core';
import { Feedback } from 'src/app/core/models/feedback';
import { Reacts } from 'src/app/core/models/reacts';
import { FeedbackService } from 'src/app/services/feedbacks.service';

@Component({
  selector: 'app-add-feedback-admin',
  templateUrl: './add-feedback-admin.component.html',
  styleUrls: ['./add-feedback-admin.component.css']
})
export class AddFeedbackAdminComponent {
  feedback: Feedback = {
    message: '',
    date: '',
    item: { id: 1 }, // or dynamically chosen
    reacts: [
      {
        reaction: 'LIKE'
      } as Reacts
    ]
  };

  constructor(private feedbackService: FeedbackService) {}

  submitFeedback() {
    this.feedback.date = new Date().toISOString(); // Set current date/time

    this.feedbackService.addFeedback(this.feedback).subscribe({
      next: (res) => {
        alert('Feedback envoyé avec succès !');
        console.log(res);
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de l\'envoi du feedback.');
      }
    });
  }
}