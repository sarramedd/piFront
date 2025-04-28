import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { UserService } from '../../services/user.service';
import { User } from '../../core/models/user.model';

interface UserProfile {
  id: number;
  cin: number;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  genre: string;
  status: string;
  dateDeNaissance: string;
  role: 'ADMIN' | 'BORROWER' | 'OWNER';
  imageUrl?: string;
}

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit {
  userProfile: UserProfile = {
    id: 0,
    cin: 0,
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    genre: '',
    status: 'Active',
    dateDeNaissance: '',
    role: 'BORROWER'
  };

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
    const tokenData = this.authService.decodeToken();

    if (!tokenData || !tokenData.sub) {
      this.errorMessage = 'Utilisateur non authentifié';
      this.isLoading = false;
      return;
    }

    const userEmail = tokenData.sub;

    this.userService.getUserByEmail(userEmail).subscribe(
      (user) => {
        this.userProfile = {
          id: user.id,
          cin: user.cin,
          nom: user.name || '',
          email: user.email || '',
          telephone: user.phone || '',
          adresse: user.address || '',
          genre: user.genre || '',
          status: user.status || 'Active',
          dateDeNaissance: user.dateDeNaissance || '',
          role: user.role || 'BORROWER'
        };

        this.loadUserImage(userEmail);
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement du profil';
        console.error('Erreur loadUserProfile:', error);
        this.isLoading = false;
      }
    );
  }

  loadUserImage(email: string): void {
    this.userService.getUserImageByEmail(email).subscribe(
      (imageBase64) => {
        this.userProfile.imageUrl = `data:image/jpeg;base64,${imageBase64}`;
      },
      (error) => {
        console.log('Pas d\'image de profil, on utilise le placeholder');
        this.userProfile.imageUrl = './assets/img/user-placeholder.png';
      }
    );
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.userProfile.imageUrl = e.target.result;
        this.uploadImage(file);
      };

      reader.readAsDataURL(file);
    }
  }

  uploadImage(file: File): void {
    if (!file) return;

    this.isLoading = true;

    const updatedUser: User = new User(
      this.userProfile.id,
      this.userProfile.cin,
      this.userProfile.nom,
      this.userProfile.email,
      '',
      this.userProfile.telephone,
      this.userProfile.adresse,
      this.userProfile.genre,
      this.userProfile.status,
      this.userProfile.dateDeNaissance,
      this.userProfile.role as 'ADMIN' | 'BORROWER' | 'OWNER'
    );

    this.userService.updateUser(this.userProfile.id, updatedUser, file).subscribe(
      () => {
        this.successMessage = 'Image du profil mise à jour avec succès';
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la mise à jour de l\'image';
        console.error('Erreur uploadImage:', error);
        this.isLoading = false;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    );
  }

  updateProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updatedUser: User = new User(
      this.userProfile.id,
      this.userProfile.cin,
      this.userProfile.nom,
      this.userProfile.email,
      '',
      this.userProfile.telephone,
      this.userProfile.adresse,
      this.userProfile.genre,
      this.userProfile.status,
      this.userProfile.dateDeNaissance,
      this.userProfile.role as 'ADMIN' | 'BORROWER' | 'OWNER'
    );

    this.userService.updateUser(this.userProfile.id, updatedUser, null).subscribe(
      () => {
        this.successMessage = 'Profil mis à jour avec succès';
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la mise à jour du profil';
        console.error('Erreur updateProfile:', error);
        this.isLoading = false;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    );
  }

  cancelUpdate(): void {
    this.loadUserProfile();
  }
}
