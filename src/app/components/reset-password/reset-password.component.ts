import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  token: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    // Récupération du token de l'URL
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    // Création du formulaire avec le validateur personnalisé
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validator personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return newPassword && confirmPassword && newPassword === confirmPassword 
      ? null 
      : { passwordMismatch: true };
  }

  get f() { return this.resetPasswordForm.controls; }

  // Soumission du formulaire de réinitialisation
 onSubmit(): void {
  if (this.resetPasswordForm.invalid || this.isLoading) {
    return;
  }

  this.isLoading = true;
  this.successMessage = '';
  this.errorMessage = '';

  const { newPassword } = this.resetPasswordForm.value;

  // Call the service to reset the password
  this.authService.resetPassword(this.token, newPassword).subscribe({
    next: (response) => {
      this.successMessage = 'Password successfully reset. You can now log in with your new password.';
      this.isLoading = false;

      // Disable form after successful reset
      this.resetPasswordForm.disable(); // Disable the form
    },
    error: (error) => {
      console.error('Reset password error:', error);
      
      if (error.error?.errorCode === 'LIEN_EXPIRE') {
        this.errorMessage = 'The reset link has expired. Please request a new one.';
      } else if (error.error?.errorCode === 'TOKEN_INVALIDE') {
        this.errorMessage = 'Invalid reset token. Please check the link or request a new one.';
      } else {
        this.errorMessage = 'There was an error resetting your password. Please try again.';
      }
      
      this.successMessage = '';
      this.isLoading = false;
    }
  });
}

}
