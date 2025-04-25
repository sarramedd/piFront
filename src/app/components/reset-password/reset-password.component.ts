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
    this.token = this.route.snapshot.queryParams['token'] || '';

    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  get f() { return this.resetPasswordForm.controls; }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

 onSubmit(): void {
    if (this.resetPasswordForm.invalid || !this.token) return;

  this.isLoading = true;
    this.errorMessage = '';
  this.successMessage = '';

    this.authService.resetPassword(this.token, this.f['newPassword'].value).subscribe({
      next: (response: any) => {
      this.isLoading = false;
        this.successMessage = 'Votre mot de passe a été réinitialisé avec succès.';
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe.';
    }
  });
}
}
