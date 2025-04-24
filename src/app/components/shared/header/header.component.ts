import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../../../../assets/css/style.css',
              '../../../../assets/css/bootstrap.min.css',
            '../../../../assets/css/nouislider.min.css',
          '../../../../assets/css/nouislider.min.css'],
encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  constructor(private authService: AuthServiceService, private router: Router) {}

  goToMyContracts() {
    const id = this.authService.getUserId();
    if (id !== null) {
      this.router.navigate([`/my-contracts/${id}`]);
    }}
    goToMyCommandes() {
      const userId = this.authService.getUserId();
      if (userId) {
        this.router.navigate([`/commandes/user/${userId}`]);
      } else {
        console.error('Utilisateur non connecté');
      }
    }
}
