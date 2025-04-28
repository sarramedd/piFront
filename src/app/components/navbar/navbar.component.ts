import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  userImage: string | null = null;
  userName: string | null = null;  // Ajout de la propriété userName

  constructor(
    private authService: AuthServiceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const decodedToken = this.authService.decodeToken();  // Décode le token JWT
      const email = decodedToken?.sub || decodedToken?.email;  // Récupère l'email du token
      this.userName = decodedToken?.name || 'Utilisateur';  // Récupère le nom de l'utilisateur (assurez-vous que le backend envoie ce champ)

      if (email) {
        // Récupère l'image de l'utilisateur en fonction de son email
        this.userService.getUserImageByEmail(email).subscribe({
          next: (base64Image: string) => {
            this.userImage = `data:image/jpeg;base64,${base64Image}`;
          },
          error: () => {
            this.userImage = null;
          },
        });
      }
    }
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}
