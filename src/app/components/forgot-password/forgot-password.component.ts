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
    private formBuilder: FormBuilder,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    // Initialisation du formulaire avec la validation de l'email
    this.forgotPasswordForm = this.formBuilder.group({
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

    // Utilisation de la syntaxe des crochets pour accéder au contrôle 'email'
    this.authService.requestPasswordReset(this.f['email'].value).subscribe(
      (response) => {
        // Si la requête réussit, afficher le message de succès
        this.successMessage = 'A link to reset your password has been sent to your email.';
        this.errorMessage = ''; // Réinitialiser le message d'erreur en cas de succès
      },
      (error) => {
        // Si une erreur se produit, afficher le message d'erreur
        this.errorMessage = 'There was an error sending the reset link. Please try again.';
        this.successMessage = ''; // Réinitialiser le message de succès en cas d'erreur
      }
    );
  }
}
