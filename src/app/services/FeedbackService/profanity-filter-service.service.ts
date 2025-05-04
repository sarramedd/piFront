import { Injectable } from '@angular/core';
import { Filter } from 'bad-words';

@Injectable({
  providedIn: 'root'
})
export class ProfanityFilterServiceService {

  private filter: Filter;

  constructor() {
    this.filter = new Filter();
    this.customizeFilter();
  }

  private customizeFilter() {
    // Ajoutez des mots français
    const frenchBadWords = ['con', 'connard', 'putain', 'merde', 'salope', 'enculé'];
    this.filter.addWords(...frenchBadWords);
    
    // Retirez des faux positifs
    this.filter.removeWords('con'); // car "con" peut être un prénom
  }

  containsProfanity(text: string): boolean {
    return this.filter.isProfane(text);
  }

  cleanText(text: string): string {
    return this.filter.clean(text);
  }
}

