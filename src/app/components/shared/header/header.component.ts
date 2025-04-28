import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [
    '../../../../assets/css/style.css',
    '../../../../assets/css/bootstrap.min.css',
    '../../../../assets/css/nouislider.min.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  userImageUrl: string = '';
  userEmail: string = '';

  constructor(private userService: UserService,
              private authService:AuthServiceService,
              private router: Router
  ) {}

  ngOnInit(): void {
    const userJson = localStorage.getItem('loggedUser');
    
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user?.email) {
          this.userEmail = user.email;
          this.loadUserImage(this.userEmail);
        }
      } catch (error) {
        console.error('Erreur de parsing du user depuis le localStorage', error);
      }
    }
  }

  private loadUserImage(email: string): void {
    this.userService.getUserByEmail(email).subscribe({
      next: (user) => {
        if (user?.image) {
          this.userImageUrl = `data:image/jpeg;base64,${user.image}`;
        } else {
          this.userImageUrl = 'assets/img/default-avatar.png'; // fallback
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l’image utilisateur', err);
        this.userImageUrl = 'assets/img/default-avatar.png'; // fallback
      }
    });
  }

  goToMyContracts() {
    const id = this.authService.getUserId();
    if (id !== null) {
      this.router.navigate([`/my-contracts/${id}`]);
    }}
}
