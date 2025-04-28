import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-User.component.html',
  styleUrls: [
    './header-user.component.css',
    '../../../assets/css/bootstrap.min.css',
    '../../../assets/css/style.css',
    '../../../assets/css/nouislider.min.css'
  ]
})
export class HeaderUserComponent implements OnInit {
  userImageUrl: string = 'assets/img/default-avatar.png';
  userEmail: string = '';

  constructor(
    private router: Router,
    private authService: AuthServiceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    if (user.email) {
      this.userEmail = user.email;
      this.userService.getUserImageByEmail(this.userEmail).subscribe({
        next: (base64Image: string) => {
          console.log("Image Base64 récupérée :", base64Image);
          this.userImageUrl = `data:image/jpeg;base64,${base64Image}`;
        },
        error: (error) => {
          console.error("Erreur lors de la récupération de l'image :", error);
          this.userImageUrl = 'assets/img/default-avatar.png';
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}