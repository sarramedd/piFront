import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
        console.log('Login response:', response); // Should contain { token: "..." }
  
        if (response && response.token) {
          // Save token
          this.authService.saveToken(response.token);
          localStorage.setItem('token', response.token);
  
          // Get role from token
          const userRole = this.authService.getRoleFromToken();
          console.log('Rôle extrait depuis le token :', userRole);
  
          // 👉 Extract user ID and save it to localStorage
          const decodedToken = this.authService.decodeToken();
          if (decodedToken && decodedToken.id) {
            localStorage.setItem('userId', decodedToken.id.toString());
            
            // Fetch user data (this should be done in a service)
            const userData = { id: decodedToken.id, role: userRole }; // Example, fetch actual user data as needed
            localStorage.setItem('userData', JSON.stringify(userData)); // Store user data in localStorage
          } else {
            console.warn('User ID not found in token.');
          }
  
          // Redirect based on the user's role
          if (userRole === 'BORROWER' || userRole === 'OWNER') {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/ListUser']);
          }
        } else {
          console.error('Token not received in the response.');
          this.errorMessage = 'Login failed: Token not received.';
        }
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Email or password is incorrect.';
        } else {
          this.errorMessage = 'Error during login. Please try again.';
        }
      }
    });
  }
  
  
    
  }
  
  

