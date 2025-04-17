import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service'; // Import AuthService


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [
    './navbar.component.css',
      '../../../assets/bootstrap-template/css/style.css',
      '../../../assets/bootstrap-template/vendors/mdi/css/materialdesignicons.min.css',
      '../../../assets/bootstrap-template/vendors/font-awesome/css/font-awesome.min.css',
      '../../../assets/bootstrap-template/vendors/css/vendor.bundle.base.css'
    ],
    encapsulation: ViewEncapsulation.None
  })
export class NavbarComponent {
  constructor(private authService: AuthServiceService) { }

  // Logout function that calls the AuthService to clear the token
  logout(): void {
    this.authService.logout();
    // Optionally, redirect to login or home page
    window.location.href = '/login'; // Or use Angular Router if necessary
  }

}
