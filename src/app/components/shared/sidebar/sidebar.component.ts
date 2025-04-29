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
    user:any
    userId:any

      ngOnInit() {
        const token = this.authService.getToken();
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('Payload JWT :', payload);
          this.user = payload;
          this.userId = payload.id; // 🔥 ici on met dans this.userId !
        }
      }
      goToMyContracts() {
  
        const userId = this.user.id
        if (userId !== null) {
          this.router.navigate([`/my-contracts/${userId}`]);
        }}
    goToMyCommandes() {
      const userId = this.user.id;
      if (userId) {
        this.router.navigate([`commandes/user/${userId}`]);
      } else {
        console.error('Utilisateur non connecté');
      }
    }
}
