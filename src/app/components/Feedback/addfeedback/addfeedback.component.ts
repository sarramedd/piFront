import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbacksService } from 'src/app/services/FeedbackService/feedbacks.service';
import { ProfanityFilterServiceService } from 'src/app/services/FeedbackService/profanity-filter-service.service';

@Component({
  selector: 'app-addfeedback',
  templateUrl: './addfeedback.component.html',
  styleUrls: ['./addfeedback.component.css']
})
export class AddfeedbackComponent implements OnInit {
  feedbackForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbacksService,
    private router: Router,
    private profanityFilter: ProfanityFilterServiceService,
  ) {}

  ngOnInit(): void {
    this.feedbackForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      const userId = localStorage.getItem('userId'); // Retrieve the user ID from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}'); // Retrieve user data from localStorage

      if (!userId || !userData.id) {
        alert("User not logged in");
        return;
      }
      const message = this.feedbackForm.value.message;
     
      if (this.profanityFilter.containsProfanity(message)) {
        alert('Votre message contient du langage inapproprié');
        return;
      }

      const feedbackData = {
        message: this.feedbackForm.value.message,
        date: new Date().toISOString(),
        user: {
          id: userData.id,
          cin: userData.cin,         // Use actual CIN from userData
          name: userData.name,       // Use actual name
          email: userData.email,     // Use actual email
          password: '',              // Not typically needed
          phone: userData.phone,     // Use actual phone number
          address: userData.address, // Use actual address
          genre: userData.genre,     // Use actual gender
          status: userData.status,   // Use actual status
          dateDeNaissance: userData.dateDeNaissance, // Use actual DOB
          role: userData.role as 'BORROWER',  // Ensure correct role
        }
      };

      this.feedbackService.addFeedback(feedbackData).subscribe({
        next: (response: any) => {
          console.log('Feedback submitted with analysis:', response);
          if (response.sentimentScore) {
            alert(`Merci ! Sentiment: ${response.sentimentScore > 0.5 ? 'Positif' : 'Negatif'}`);
          }
          this.router.navigate(['/listFeedback']);
        },
        error: (err) => {
          console.error('Error:', err);
          alert('Erreur: ' + (err.error?.error || err.message));
        }
      });
    }
  }
}