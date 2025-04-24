import { Component, ViewEncapsulation } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: [
    '../../../assets/css/style.css',
    '../../../assets/css/bootstrap.min.css',
    '../../../assets/css/nouislider.min.css',
    '../../../assets/css/nouislider.min.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class IndexComponent {
  user: any = null;
  constructor(private authService: AuthServiceService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Payload JWT :', payload);
      this.user = payload;
    }
  }
  
  

}
