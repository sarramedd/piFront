import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: any = {
    genre: "",
    role: "",
    phone: "",
  };
  confirmPassword: string = '';
  message: string = '';
  isLoading: boolean = false;
  emailExistsError: boolean = false;
  phoneRegex = /^\+216[0-9]{8}$/;

  constructor(private userService: UserService, private router: Router) {}

  register(registerForm: NgForm) {
    this.message = '';
    this.emailExistsError = false;

    if (registerForm.invalid) {
      this.message = 'Veuillez remplir tous les champs requis correctement.';
      return;
    }

    if (!this.phoneRegex.test(this.user.phone)) {
      this.message = 'Numéro de téléphone invalide. Format attendu: +216XXXXXXXX.';
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.isLoading = true;

    this.userService.registerUser(this.user).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.message = 'Inscription réussie! Un code de vérification a été envoyé à votre téléphone.';
        const userId = response.id;
        setTimeout(() => {
          this.router.navigate(['/verification-sms', userId]);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error === 'Cet email est déjà utilisé.') {
          this.emailExistsError = true;
          this.message = 'Cet email est déjà utilisé.';
        } else {
          this.message = 'Erreur lors de l\'inscription. Veuillez réessayer.';
          console.error('Registration error:', err);
        }
      }
    });
  }
}