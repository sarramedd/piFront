import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FaceppService } from 'src/app/services/facepp.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: any = {
    genre: "",
    role: "",
    phone: "",
  };
  confirmPassword: string = '';
  message: string = '';
  isLoading: boolean = false;

  isVerifyingFace: boolean = false;
  emailExistsError: boolean = false;
  phoneRegex = /^\+216[0-9]{8}$/;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  faceVerificationResult: { isValid: boolean; message?: string } | null = null;

  constructor(
    private userService: UserService,
    private faceppService: FaceppService,
    private router: Router
  ) {}

  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    this.faceVerificationResult = null;
    
    // Créer un aperçu de l'image
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);

    // Vérifier le visage
    await this.verifyFace();
  }

  async verifyFace(): Promise<void> {
    if (!this.selectedFile) return;

    this.isVerifyingFace = true;
    this.faceVerificationResult = null;

    try {
      this.faceVerificationResult = await this.faceppService.validateSingleFace(this.selectedFile);
      
      if (!this.faceVerificationResult.isValid) {
        this.message = this.faceVerificationResult.message || 'Visage non valide';
      }
    } catch (error) {
      console.error('Erreur de vérification faciale:', error);
      this.message = 'Erreur lors de la vérification faciale';
    } finally {
      this.isVerifyingFace = false;
    }
  }

  async register(registerForm: NgForm) {
    this.message = '';
    this.emailExistsError = false;

    // Validation du formulaire
    if (registerForm.invalid) {
      this.message = 'Veuillez remplir tous les champs requis correctement.';
      return;
    }

    if (!this.phoneRegex.test(this.user.phone)) {
      this.message = 'Numéro de téléphone invalide. Format attendu: +216XXXXXXXX.';
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas.';
      return;
    }


    // Vérification faciale
    if (!this.faceVerificationResult?.isValid) {
      this.message = 'Veuillez uploader une photo valide avec un visage clairement visible.';
      return;
    }

    this.isLoading = true;

    try {
      const response = await this.userService.registerUser(this.user, this.selectedFile).toPromise();
      
      this.isLoading = false;
      this.message = 'Inscription réussie! Un code de vérification a été envoyé à votre téléphone.';
      const userId = response.id;
      
      setTimeout(() => {
        this.router.navigate(['/verification-sms', userId]);
      }, 2000);
    } catch (err: any) {  // Typing 'err' as 'any' to avoid unknown error type
      this.isLoading = false;
      if (err.error === 'Cet email est déjà utilisé.') {
        this.emailExistsError = true;
        this.message = 'Cet email est déjà utilisé.';
      } else {
        this.message = 'Erreur lors de l\'inscription. Veuillez réessayer.';
        console.error('Registration error:', err);
      }
    }
  }
}
