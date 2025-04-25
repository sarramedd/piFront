import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  imagePreview: string | null = null;
  isVerifyingFace: boolean = false;
  faceVerificationResult: { isValid: boolean; message?: string } | null = null;
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      cin: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^\\+216[0-9]{8}$')]],
      address: ['', Validators.required],
      dateDeNaissance: ['', Validators.required],
      genre: ['', Validators.required],
      role: ['BORROWER', Validators.required],
      terms: [false, Validators.requiredTrue],
      photo: [null]
    });
  }

  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Veuillez sélectionner une image valide';
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'L\'image ne doit pas dépasser 5MB';
      return;
    }

    this.selectedFile = file;
    this.registerForm.patchValue({ photo: file });
    
    // Créer un aperçu de l'image
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async register() {
    if (this.registerForm.valid) {
      const formData = new FormData();
      const formValues = this.registerForm.value;

      // Ajouter tous les champs au FormData
      Object.keys(formValues).forEach(key => {
        if (key !== 'photo' && key !== 'confirmPassword' && key !== 'terms') {
          formData.append(key, formValues[key]);
        }
      });

      // Ajouter la photo si elle existe
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile);
      }

      // Validation des données
      if (!formValues.cin || !/^[0-9]{8}$/.test(formValues.cin)) {
        this.errorMessage = 'Le CIN doit contenir exactement 8 chiffres';
        return;
      }

      if (!formValues.name || formValues.name.trim().length === 0) {
        this.errorMessage = 'Le nom est requis';
        return;
      }

      if (!formValues.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
        this.errorMessage = 'Veuillez entrer une adresse email valide';
        return;
      }

      if (!formValues.password || formValues.password.length < 6) {
        this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
        return;
      }

      if (formValues.password !== formValues.confirmPassword) {
        this.errorMessage = 'Les mots de passe ne correspondent pas';
        return;
      }

      if (!formValues.phone || !/^\+216[0-9]{8}$/.test(formValues.phone)) {
        this.errorMessage = 'Veuillez entrer un numéro de téléphone valide avec le format +216XXXXXXXX';
        return;
    }

      if (!formValues.address || formValues.address.trim().length === 0) {
        this.errorMessage = 'L\'adresse est requise';
        return;
      }

      if (!formValues.dateDeNaissance) {
        this.errorMessage = 'La date de naissance est requise';
        return;
      }

      // Validation de la date de naissance
      let birthDate: Date;
      try {
        // Convertir la date en format ISO (YYYY-MM-DD)
        const [day, month, year] = formValues.dateDeNaissance.split('/');
        birthDate = new Date(`${year}-${month}-${day}`);
        
        if (isNaN(birthDate.getTime())) {
          throw new Error('Format de date invalide');
        }
        
        const today = new Date();
        
        if (birthDate > today) {
          this.errorMessage = 'La date de naissance ne peut pas être dans le futur';
      return;
    }

        if (today.getFullYear() - birthDate.getFullYear() < 18) {
          this.errorMessage = 'Vous devez avoir au moins 18 ans pour vous inscrire';
      return;
    }

        // Formater la date en ISO string (YYYY-MM-DD)
        formData.set('dateDeNaissance', birthDate.toISOString().split('T')[0]);
      } catch (error) {
        this.errorMessage = 'Format de date invalide. Utilisez le format JJ/MM/AAAA';
      return;
    }

      if (!formValues.genre) {
        this.errorMessage = 'Veuillez sélectionner un genre';
        return;
      }

      if (!formValues.terms) {
        this.errorMessage = 'Vous devez accepter les termes et conditions';
      return;
    }

      this.loading = true;
      this.errorMessage = '';

      try {
        await this.authService.register(formData).toPromise();
        this.loading = false;
        this.router.navigate(['/login']);
      } catch (error: any) {
        this.loading = false;
        console.error('Erreur d\'inscription:', error);
        
        if (error.status === 403) {
          this.errorMessage = 'Accès refusé. Veuillez vérifier vos autorisations et que vous avez bien sélectionné une photo de profil.';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier que le serveur est en cours d\'exécution.';
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 400) {
          this.errorMessage = 'Données invalides. Veuillez vérifier vos informations.';
        } else if (error.status === 409) {
          this.errorMessage = 'Cet email est déjà utilisé.';
      } else {
          this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
        }
      }
    }
  }
}
