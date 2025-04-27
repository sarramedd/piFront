import { Component } from '@angular/core';
import { FaqService } from 'src/app/services/faq.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.componenet.css']
})
export class ChatbotComponent {
  userQuestion: string = '';
  botAnswer: string = '';

  constructor(private faqService: FaqService) {}

  askQuestion() {
    this.botAnswer = this.faqService.searchAnswer(this.userQuestion);
    this.userQuestion = ''; // Efface la question après envoi
  }
}
