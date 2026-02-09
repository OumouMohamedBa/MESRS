import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from './chatbot.service';
import { ChatMessage, ChatResponse, Source } from './chat.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html'
})
export class ChatbotComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  currentMessage = '';
  isLoading = false;
  isOpen = false;
  ragAvailable = false;
  
  // For request management
  private currentRequest?: Subscription;
  lastQuestion = '';
  loadingTime = 0;
  private loadingTimer?: any;
  
  // Propriétés pour la reconnaissance vocale
  isListening = false;
  speechRecognition: any;
  speechSupported = false;
  voiceError = '';
  
  quickSuggestions = [
    'Quels sont les textes réglementaires en vigueur ?',
    'Parle-moi des formations disponibles',
    'Quelles sont les lois sur l\'enseignement supérieur ?',
    'Résume les décrets récents'
  ];

  constructor(private chatbotService: ChatbotService) {
    this.initSpeechRecognition();
  }

  ngOnInit(): void {
    // Vérifier si le service RAG est disponible
    this.chatbotService.isAvailable().subscribe(available => {
      this.ragAvailable = available;
    });

    // Message de bienvenue
    const voiceSupport = this.speechSupported ? '\n\n🎤 Vous pouvez aussi utiliser la commande vocale !' : '';
    this.addBotMessage('Bonjour ! Je suis votre assistant documentaire. Je peux répondre à vos questions en utilisant les textes réglementaires disponibles.' + voiceSupport + '\n\nComment puis-je vous aider ?');
  }

  toggleChat(): void {
    console.log('Toggle chat called, current state:', this.isOpen);
    this.isOpen = !this.isOpen;
    console.log('New state:', this.isOpen);
  }

  sendMessage(): void {
    if (!this.currentMessage.trim()) return;

    // Warn if RAG service is unavailable
    if (!this.ragAvailable) {
      this.addBotMessage('⚠️ Le service IA semble indisponible. Votre question sera envoyée mais pourrait échouer.', undefined, true);
    }

    const userMessage = this.currentMessage.trim();
    this.lastQuestion = userMessage;
    this.addUserMessage(userMessage);
    this.currentMessage = '';
    this.isLoading = true;
    this.loadingTime = 0;

    // Start loading timer
    this.startLoadingTimer();

    // Cancel any previous request
    this.currentRequest?.unsubscribe();

    this.currentRequest = this.chatbotService.askQuestion(userMessage).subscribe({
      next: (response: ChatResponse) => {
        this.stopLoadingTimer();
        this.isLoading = false;
        this.handleBotResponse(response);
      },
      error: (error: any) => {
        console.error('Chatbot error:', error);
        console.error('Error details - status:', error.status, 'name:', error.name, 'message:', error.message);
        this.stopLoadingTimer();
        this.isLoading = false;
        
        // More specific error messages
        if (error.name === 'TimeoutError') {
          this.addBotMessage('La requête a pris trop de temps (timeout). Réessayez avec une question plus simple.', undefined, true);
        } else if (error.status === 0) {
          this.addBotMessage('Impossible de contacter le serveur. Vérifiez votre connexion.', undefined, true);
        } else if (error.status === 504) {
          this.addBotMessage('Le serveur a mis trop de temps à répondre.', undefined, true);
        } else if (error.status === 500) {
          const msg = error.error?.error_message || error.error?.message || 'Erreur serveur';
          this.addBotMessage(`Erreur serveur: ${msg}`, undefined, true);
        } else {
          this.addBotMessage(`Une erreur est survenue: ${error.message || 'Veuillez réessayer'}`, undefined, true);
        }
      }
    });
  }

  retryLastQuestion(): void {
    if (this.lastQuestion) {
      this.currentMessage = this.lastQuestion;
      this.sendMessage();
    }
  }

  cancelRequest(): void {
    this.currentRequest?.unsubscribe();
    this.stopLoadingTimer();
    this.isLoading = false;
    this.addBotMessage('Question annulée. Comment puis-je vous aider autrement ?');
  }

  private startLoadingTimer(): void {
    this.loadingTime = 0;
    this.loadingTimer = setInterval(() => {
      this.loadingTime++;
    }, 1000);
  }

  private stopLoadingTimer(): void {
    if (this.loadingTimer) {
      clearInterval(this.loadingTimer);
      this.loadingTimer = undefined;
    }
  }

  private handleBotResponse(response: ChatResponse): void {
    if (response.error) {
      this.addBotMessage(response.error_message || 'Une erreur est survenue.', undefined, true);
      return;
    }

    // Add bot message with sources
    this.addBotMessage(response.answer, response.sources);
  }

  private addUserMessage(content: string): void {
    this.messages.push({
      type: 'user',
      content,
      timestamp: new Date()
    });
    this.scrollToBottom();
  }

  private addBotMessage(content: string, sources?: Source[], isError = false): void {
    this.messages.push({
      type: 'bot',
      content,
      sources,
      timestamp: new Date(),
      isError
    });
    this.scrollToBottom();
  }

  formatMessage(content: string): string {
    return content.replace(/\n/g, '<br>');
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = document.querySelector('.chat-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  useSuggestion(suggestion: string): void {
    this.currentMessage = suggestion;
    this.sendMessage();
  }

  // ========== RECONNAISSANCE VOCALE ==========

  private initSpeechRecognition(): void {
    // Vérifier si l'API est supportée
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.speechSupported = true;
      this.speechRecognition = new SpeechRecognition();
      
      // Configuration
      this.speechRecognition.lang = 'fr-FR'; // Français
      this.speechRecognition.continuous = false; // Arrêter après une phrase
      this.speechRecognition.interimResults = true; // Résultats intermédiaires
      this.speechRecognition.maxAlternatives = 1;

      // Événement: résultat de la reconnaissance
      this.speechRecognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const isFinal = event.results[0].isFinal;
        
        this.currentMessage = transcript;
        
        // Si c'est le résultat final, envoyer automatiquement
        if (isFinal) {
          this.isListening = false;
          // Petit délai pour que l'utilisateur voie le texte
          setTimeout(() => {
            if (this.currentMessage.trim()) {
              this.sendMessage();
            }
          }, 500);
        }
      };

      // Événement: début de l'écoute
      this.speechRecognition.onstart = () => {
        this.isListening = true;
        this.voiceError = '';
        console.log('🎤 Écoute démarrée...');
      };

      // Événement: fin de l'écoute
      this.speechRecognition.onend = () => {
        this.isListening = false;
        console.log('🎤 Écoute terminée');
      };

      // Événement: erreur
      this.speechRecognition.onerror = (event: any) => {
        this.isListening = false;
        console.error('Erreur de reconnaissance vocale:', event.error);
        
        switch (event.error) {
          case 'no-speech':
            this.voiceError = 'Aucune voix détectée. Réessayez.';
            break;
          case 'audio-capture':
            this.voiceError = 'Microphone non disponible.';
            break;
          case 'not-allowed':
            this.voiceError = 'Accès au microphone refusé.';
            break;
          case 'network':
            this.voiceError = 'Erreur réseau.';
            break;
          default:
            this.voiceError = 'Erreur de reconnaissance vocale.';
        }
        
        // Effacer l'erreur après 3 secondes
        setTimeout(() => {
          this.voiceError = '';
        }, 3000);
      };
    } else {
      this.speechSupported = false;
      console.warn('La reconnaissance vocale n\'est pas supportée par ce navigateur.');
    }
  }

  // Démarrer/Arrêter l'écoute vocale
  toggleVoiceInput(): void {
    if (!this.speechSupported) {
      this.voiceError = 'Reconnaissance vocale non supportée.';
      setTimeout(() => this.voiceError = '', 3000);
      return;
    }

    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  startListening(): void {
    if (this.speechRecognition && !this.isListening) {
      try {
        this.speechRecognition.start();
      } catch (error) {
        console.error('Erreur au démarrage de la reconnaissance vocale:', error);
      }
    }
  }

  stopListening(): void {
    if (this.speechRecognition && this.isListening) {
      this.speechRecognition.stop();
    }
  }

  ngOnDestroy(): void {
    // Cancel pending request
    this.currentRequest?.unsubscribe();
    
    // Stop loading timer
    this.stopLoadingTimer();
    
    // Arrêter la reconnaissance vocale si active
    if (this.speechRecognition && this.isListening) {
      this.speechRecognition.stop();
    }
  }
}
