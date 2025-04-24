import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { UserService } from '../../services/user.service';
import { jwtDecode } from 'jwt-decode';
import { User } from '../../core/models/user.model';

interface DecodedToken {
  email?: string;
  sub?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile-component.component.html',
  styleUrls: [
    '../../../assets/bootstrap-template/css/style.css',
    '../../../assets/bootstrap-template/vendors/mdi/css/materialdesignicons.min.css',
    '../../../assets/bootstrap-template/vendors/font-awesome/css/font-awesome.min.css',
    '../../../assets/bootstrap-template/vendors/css/vendor.bundle.base.css'
  ]
})
export class AdminProfileComponent implements OnInit {
  userProfile!: User;
  selectedImageFile: File | null = null;
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

  onImageSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedImageFile = event.target.files[0];
    }
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
        next: (user: User) => {
          console.log('User data:', user);
          this.userProfile = user;
          this.isLoading = false;
        },
        error: (err: any) => {
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
    this.loadUserProfile();
  }

  updateProfile(): void {
    if (!this.userProfile?.id) {
      this.errorMessage = 'Profil utilisateur non chargé';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.userService.updateUser(this.userProfile.id, this.userProfile, this.selectedImageFile).subscribe({
      next: (updatedUser: User) => {
        this.userProfile = updatedUser;
        this.isLoading = false;
        this.successMessage = 'Profil mis à jour avec succès';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err: any) => {
        this.errorMessage = 'Erreur lors de la mise à jour du profil';
        this.isLoading = false;
        console.error('Erreur mise à jour :', err);
      }
    });
  }
}
