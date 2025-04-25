import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service'; // Assurez-vous que le service est importé

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isSubmitted = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    // Initialisation du formulaire avec la validation de l'email
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Accès aux contrôles du formulaire
  get f() { return this.forgotPasswordForm.controls; }

  // Fonction qui sera exécutée lors de la soumission du formulaire
  onSubmit(): void {
    this.isSubmitted = true;

    // Si le formulaire est invalide, on arrête l'exécution
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.value.email;
    this.authService.requestPasswordReset(email).subscribe({
      next: (response: any) => {
        this.successMessage = 'Un email de réinitialisation a été envoyé à votre adresse email.';
        this.errorMessage = '';
      },
      error: (error: any) => {
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la demande de réinitialisation.';
        this.successMessage = '';
      }
    });
  }
}
