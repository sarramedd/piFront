import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
    '../../../assets/bootstrap-template/css/style.css',
    '../../../assets/bootstrap-template/vendors/mdi/css/materialdesignicons.min.css',
    '../../../assets/bootstrap-template/vendors/font-awesome/css/font-awesome.min.css',
    '../../../assets/bootstrap-template/vendors/css/vendor.bundle.base.css',
    '../../../assets/bootstrap-template/vendors/ti-icons/css/themify-icons.css'
  ],
  encapsulation: ViewEncapsulation.None

})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const loginData = {
      email: this.loginForm.value.usernameOrEmail,
      password: this.loginForm.value.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);


        const userRole = this.authService.getRoleFromToken();
        console.log('Rôle extrait depuis le token :', userRole);

        if (userRole === 'BORROWER' || userRole === 'OWNER') {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/ListUser']);
        }
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        } else {
          this.errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
        }
      }
    });
  }
}
