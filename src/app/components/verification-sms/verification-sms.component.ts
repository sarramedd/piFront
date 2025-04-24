import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-verification-sms',
  templateUrl: './verification-sms.component.html',
  styleUrls: ['./verification-sms.component.css']
})
export class VerificationSmsComponent implements OnInit {
  userId!: number;
  verificationCode: string = '';
  message: string = '';
  isSuccess: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
  }
  verifyCode(): void {
    this.userService.verifyUserCode(this.userId, this.verificationCode).subscribe({
      next: (res: any) => {
        this.message = 'Code de vérification valide.';
        this.isSuccess = true;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: err => {
        console.error('Erreur lors de la vérification du code:', err); // Ajouter un log pour debugger
        this.message = err.error || 'Une erreur est survenue.';
        this.isSuccess = false;
      }
    });
  }
  
}
