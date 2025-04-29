/*import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User = {
    email: '',
    role: 'BORROWER',
    firstName: '',
    lastName: ''
  };
  private userSubscription: Subscription | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = {
          email: '',
          role: 'BORROWER',
          firstName: '',
          lastName: ''
        };
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
} */