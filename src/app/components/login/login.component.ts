import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showResendLink: boolean = false;
  private apiUrl = 'http://localhost:8088/borrowit/api/users';

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.showResendLink = false;

    const { usernameOrEmail: email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.verifyUserStatus(email);
      },
      error: (err) => {
        this.handleLoginError(err, email);
      }
    });
  }

  private verifyUserStatus(email: string): void {
    this.http.get<any>(`${this.apiUrl}/email/${email}`).subscribe({
      next: (user) => this.handleUserStatus(user),
      error: () => this.navigateBasedOnRole()
    });
  }

  private handleUserStatus(user: any): void {
    this.isLoading = false;
    
    if (user.status === 'Pending Verification') {
      this.authService.logout();
      this.showStatusError('Votre compte n\'est pas encore vérifié', true);
    } else if (user.status === 'Banned') {
      this.authService.logout();
      this.showStatusError('Votre compte a été suspendu. Contactez l\'administrateur');
    } else {
      this.navigateBasedOnRole();
    }
  }

  private handleLoginError(err: any, email: string): void {
    this.isLoading = false;
    
    if (err.status === 401) {
      this.checkAccountStatus(email);
    } else {
      this.errorMessage = 'Une erreur est survenue lors de la connexion';
    }
  }

  private checkAccountStatus(email: string): void {
    this.http.get<any>(`${this.apiUrl}/email/${email}`).subscribe({
      next: (user) => this.determineErrorType(user),
      error: () => this.showCredentialsError()
    });
  }

  private determineErrorType(user: any): void {
    if (user.status === 'Pending Verification') {
      this.showStatusError('Votre compte n\'est pas encore vérifié', true);
    } else if (user.status === 'Banned') {
      this.showStatusError('Votre compte a été suspendu. Contactez l\'administrateur');
    } else {
      this.showCredentialsError();
    }
  }

  private showStatusError(message: string, showResend: boolean = false): void {
    this.errorMessage = message;
    this.showResendLink = showResend;
  }

  private showCredentialsError(): void {
    this.errorMessage = 'Email ou mot de passe incorrect';
  }

  private navigateBasedOnRole(): void {
    const role = this.authService.getRoleFromToken();
    this.router.navigate([role === 'ADMIN' ? '/ListUser' : '/home']);
  }

  resendVerificationEmail(): void {
    const email = this.loginForm.value.usernameOrEmail;
    this.isLoading = true;
    
    this.authService.requestPasswordReset(email).subscribe({
      next: () => {
        this.errorMessage = `Un email de vérification a été envoyé à ${email}`;
        this.showResendLink = false;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors de l\'envoi de l\'email';
        this.isLoading = false;
      }
    });
  }
}