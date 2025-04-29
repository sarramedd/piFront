
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FaceppService } from 'src/app/services/facepp.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: any = {
    cin: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    dateDeNaissance: '',
    genre: '',
    role: ''
  };
  
  confirmPassword: string = '';
  message: string = '';
  isLoading: boolean = false;
  isVerifyingFace: boolean = false;
  emailExistsError: boolean = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  faceVerificationResult: { isValid: boolean; message?: string } | null = null;

  // Regex patterns
  readonly phoneRegex = /^\+216[0-9]{8}$/;
  readonly cinRegex = /^[0-9]{8}$/;

  constructor(
    private userService: UserService,
    private faceppService: FaceppService,
    private router: Router
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFile = input.files[0];
    this.faceVerificationResult = null;
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(this.selectedFile);

    // Verify face
    this.verifyFace();
  }

  async verifyFace(): Promise<void> {
    if (!this.selectedFile) return;

    this.isVerifyingFace = true;
    this.faceVerificationResult = null;

    try {
      this.faceVerificationResult = await this.faceppService.validateSingleFace(this.selectedFile);
    } catch (error) {
      console.error('Face verification error:', error);
      this.faceVerificationResult = {
        isValid: false,
        message: 'Erreur lors de la vérification faciale'
      };
    } finally {
      this.isVerifyingFace = false;
    }
  }

  register(form: NgForm): void {
    if (!this.validateForm(form)) return;
    if (!this.validateFace()) return;

    this.isLoading = true;
    this.message = '';
    this.emailExistsError = false;

    this.userService.registerUser(this.user, this.selectedFile)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => this.handleRegistrationSuccess(response),
        error: (err) => this.handleRegistrationError(err)
      });
  }

  private validateForm(form: NgForm): boolean {
    if (form.invalid) {
      this.message = 'Veuillez remplir tous les champs requis correctement.';
      return false;
    }

    if (!this.cinRegex.test(this.user.cin)) {
      this.message = 'Le CIN doit contenir exactement 8 chiffres.';
      return false;
    }

    if (!this.phoneRegex.test(this.user.phone)) {
      this.message = 'Numéro de téléphone invalide. Format attendu: +216XXXXXXXX.';
      return false;
    }

    if (this.user.password !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas.';
      return false;
    }

    return true;
  }

  private validateFace(): boolean {
    if (!this.faceVerificationResult?.isValid) {
      this.message = this.faceVerificationResult?.message || 
                   'Veuillez uploader une photo valide avec un visage clairement visible.';
      return false;
    }
    return true;
  }

  private handleRegistrationSuccess(response: any): void {
    this.message = 'Inscription réussie! Un code de vérification a été envoyé à votre téléphone.';
    setTimeout(() => {
      this.router.navigate(['/verification-sms', response.id]);
    }, 2000);
  }

  private handleRegistrationError(error: any): void {
    if (error.error === 'Cet email est déjà utilisé.') {
      this.emailExistsError = true;
      this.message = 'Cet email est déjà utilisé.';
    } else {
      this.message = 'Erreur lors de l\'inscription. Veuillez réessayer.';
      console.error('Registration error:', error);
    }
  }
}
