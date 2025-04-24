import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { UserService } from '../../services/user.service';
import { jwtDecode } from 'jwt-decode';
import { User } from '../../core/models/user.model'; // Importer le modèle User

interface DecodedToken {
  email?: string;
  sub?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile-component.component.html',
  styleUrls: ['./admin-profile-component.component.css']
})
export class AdminProfileComponent implements OnInit {
  userProfile!: User;  // Déclaration sans initialisation

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthServiceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
  
    const token = this.authService.getToken();
  
    if (!token) {
      this.errorMessage = 'Aucun token trouvé';
      this.isLoading = false;
      return;
    }
  
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const userEmail = decoded.email || decoded.sub;
  
      if (!userEmail) {
        throw new Error('Email non trouvé dans le token');
      }
  
      this.userService.getUserByEmail(userEmail).subscribe({
        next: (user: User) => {  // Typage de la réponse avec le modèle User
          console.log('User data:', user);  // Debugging line to check user data
          this.userProfile = user;  // Assignation directe
          this.isLoading = false;
        },
        error: (err: any) => {  // Typage de l'erreur
          this.errorMessage = 'Erreur lors du chargement du profil';
          this.isLoading = false;
          console.error('Erreur API :', err);
        }
      });
  
    } catch (error: any) {
      this.errorMessage = 'Erreur de décodage du token : ' + error.message;
      this.isLoading = false;
      console.error('Erreur token :', error);
    }
  }
  cancelUpdate(): void {
    this.loadUserProfile();  // Recharge les informations actuelles de l'utilisateur
}

  updateProfile(): void {
    if (!this.userProfile?.id) {
      this.errorMessage = 'Profil utilisateur non chargé';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.userService.updateUser(this.userProfile.id, this.userProfile).subscribe({
      next: (updatedUser: User) => {  // Typage de la réponse avec le modèle User
        this.userProfile = updatedUser;
        this.isLoading = false;
        this.successMessage = 'Profil mis à jour avec succès';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err: any) => {  // Typage de l'erreur
        this.errorMessage = 'Erreur lors de la mise à jour du profil';
        this.isLoading = false;
        console.error('Erreur mise à jour :', err);
      }
    });
  }
}
