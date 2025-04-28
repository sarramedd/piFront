import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar-front',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css', '../../../../assets/css/style.css',
    '../../../../assets/css/bootstrap.min.css',
    '../../../../assets/css/nouislider.min.css']
})
export class SidebarComponent {
  constructor(private userService: UserService,
                private authService:AuthServiceService,
                private router: Router
    ) {}
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
