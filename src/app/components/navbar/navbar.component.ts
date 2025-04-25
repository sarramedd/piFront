import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userName: string | null = null;
  userImage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Récupérer les informations de l'utilisateur depuis le service d'authentification
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.name || user.email;
        // Vous pouvez aussi récupérer l'image de profil ici si disponible
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
