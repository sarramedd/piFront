import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbacksService } from 'src/app/services/FeedbackService/feedbacks.service';

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
     private router: Router 
    ) {}
  
  ngOnInit(): void {
    this.feedbackForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      const feedbackData = {
        message: this.feedbackForm.value.message,
        date: new Date().toISOString(),
        item: {
          id: 1,
          name: 'Static Item',
          description: 'A static item used for feedback.',
          itemCondition: 'NEW',
          availability: true,
          price: 100,
          
        }
      };

      this.feedbackService.addFeedback(feedbackData).subscribe(
        (response: any) => {
          console.log('Feedback submitted successfully!', response);
          alert('Feedback submitted successfully!'); // Success popup
          this.router.navigate(['/listFeedback']);
        },
        (error: any) => {
          console.error('Error submitting feedback', error);
          alert('Error submitting feedback! Please try again.'); // Error popup
        }
      );
    }
  }
}