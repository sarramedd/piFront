import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Fuse from 'fuse.js';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private fuse: Fuse<any> | null = null;

  constructor(private http: HttpClient) {
    this.loadFaq();
  }

  private loadFaq() {
    this.http.get<any[]>('assets/faq.json').subscribe(faqData => {
      this.fuse = new Fuse(faqData, {
        keys: ['question'],
        threshold: 0.4  // Ajuste la précision de recherche
      });
    });
  }

  searchAnswer(userQuestion: string): string {
    if (!this.fuse) {
      return "Je n'ai pas encore chargé la FAQ, réessayez.";
    }

    const results = this.fuse.search(userQuestion);
    if (results.length > 0) {
      return results[0].item.answer;
    } else {
      return "Désolé, je n'ai pas compris votre question.";
    }
  }
}
