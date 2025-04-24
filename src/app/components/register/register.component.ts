import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  // Définition des champs utilisateur sans id
  user = {
    cin: 0,
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    genre: null,
    status: 'Active',
    dateDeNaissance: '',
    role: 'BORROWER'
  };
  confirmPassword: string = '';
  message: string = '';
  isLoading: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  register() {
    if (this.user.password !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.isLoading = true;

    // Envoi des données d'inscription
    this.userService.registerUser(this.user).subscribe({
      next: response => {
        this.isLoading = false;
        this.message = 'Inscription réussie !';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: err => {
        this.isLoading = false;
        if (err.error === 'Cette adresse e-mail est déjà utilisée.') {
          this.message = err.error;
        } else {
          this.message = 'Une erreur est survenue, veuillez réessayer plus tard.';
        }
      }
    });
  }
}
