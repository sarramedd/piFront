import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaceppService {
  // Configuration sécurisée avec clés API intégrées et autres paramètres
  private readonly API_CONFIG = {
    url: 'https://api-us.faceplusplus.com/facepp/v3/detect',  // URL de l'API de détection faciale
    keys: {
      apiKey: 'OrIV-j_kL9acJ0tv7-7XnWw4dgXdL9Zc',  // Votre clé API Face++
      apiSecret: 'N-S94JI3vqPnSU0H5v9_NcTE96D7jEeX' // Votre secret API Face++
    },
    options: {
      maxFileSize: 2 * 1024 * 1024, // Limite de taille de fichier de 2MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'] // Types de fichiers autorisés
    }
  };

  constructor(private http: HttpClient) { }

  /**
   * Détecte un visage humain dans une image.
   * @param imageFile Fichier image à analyser
   * @returns Observable avec le résultat de la détection
   */
  detectHumanFace(imageFile: File): Observable<any> {
    // Validation du fichier image avant l'envoi
    this.validateImageFile(imageFile);

    // Préparation du FormData pour l'upload de l'image à l'API
    const formData = new FormData();
    formData.append('api_key', this.API_CONFIG.keys.apiKey);
    formData.append('api_secret', this.API_CONFIG.keys.apiSecret);
    formData.append('image_file', imageFile);  // Ajout du fichier image
    formData.append('return_attributes', 'gender,age,emotion,eyestatus'); // Attributs supplémentaires à récupérer

    // Envoi de la requête POST à l'API Face++
    return this.http.post(this.API_CONFIG.url, formData);
  }

  /**
   * Valide le fichier image avant de l'envoyer à l'API.
   * @param file Fichier à valider
   * @throws Error si le fichier ne respecte pas les critères de validation
   */
  private validateImageFile(file: File): void {
    if (!file) {
      throw new Error('Aucun fichier fourni');
    }

    // Vérification de la taille du fichier
    if (file.size > this.API_CONFIG.options.maxFileSize) {
      throw new Error(`Fichier trop volumineux (max ${this.API_CONFIG.options.maxFileSize / 1024 / 1024}MB)`);
    }

    // Vérification du type du fichier
    if (!this.API_CONFIG.options.allowedTypes.includes(file.type)) {
      throw new Error('Type de fichier non supporté. Utilisez JPEG, JPG ou PNG');
    }
  }

  /**
   * Vérifie si l'image contient exactement un visage humain valide.
   * @param imageFile Fichier image à valider
   * @returns Promise avec le résultat de la validation
   */
  async validateSingleFace(imageFile: File): Promise<{ isValid: boolean; message?: string }> {
    try {
      // Détection du visage via l'API Face++
      const detection = await this.detectHumanFace(imageFile).toPromise();

      // Vérification s'il y a des visages détectés
      if (!detection.faces || detection.faces.length === 0) {
        return { isValid: false, message: 'Aucun visage détecté' };
      }

      // Vérification s'il y a plusieurs visages détectés
      if (detection.faces.length > 1) {
        return { isValid: false, message: 'Plusieurs visages détectés' };
      }

      // Récupération des informations du premier visage détecté
      const face = detection.faces[0];

      // Vérification des yeux ouverts (deux yeux doivent être visibles)
      if (face.attributes.eyestatus?.left_eye_status?.normal_glass_eye_open === 0 || 
          face.attributes.eyestatus?.right_eye_status?.normal_glass_eye_open === 0) {
        return { isValid: false, message: 'Les yeux doivent être visibles' };
      }

      // Si tout est validé, l'image est valide
      return { isValid: true };

    } catch (error: unknown) {  // Précisez que l'erreur peut être de type "unknown"
      // Utilisation d'une assertion de type pour obtenir les informations sur l'erreur
      const err = error as Error;  // Assertion pour dire que "error" est un objet de type "Error"
      return { 
        isValid: false, 
        message: err.message || 'Erreur de détection faciale' 
      };
    }
  }
}
