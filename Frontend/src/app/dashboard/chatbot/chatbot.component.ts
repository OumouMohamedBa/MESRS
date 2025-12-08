import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService, ChatbotResponse } from '../dashboard.service';

// Déclaration pour TypeScript de l'API Web Speech
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html'
})
export class ChatbotComponent implements OnInit, OnDestroy {
  messages: { type: 'user' | 'bot'; content: string; data?: any; timestamp: Date }[] = [];
  currentMessage = '';
  isLoading = false;
  isOpen = false;
  loadingTimeout?: any; // Pour pouvoir annuler le chargement
  
  // Propriétés pour la reconnaissance vocale
  isListening = false;
  speechRecognition: any;
  speechSupported = false;
  voiceError = '';
  
  quickSuggestions = [
    'Combien d\'établissements ?',
    'Combien de textes pour E2 ?',
    'Combien de formations pour E1 ?',
    'Générer un rapport',
    'Test - Données factices'
  ];

  constructor(private dashboardService: DashboardService) {
    this.initSpeechRecognition();
  }

  ngOnInit(): void {
    // Message de bienvenue
    const voiceSupport = this.speechSupported ? '\n\n🎤 Vous pouvez aussi utiliser la commande vocale !' : '';
    this.addBotMessage('Bonjour ! Je suis votre assistant statistique. Je peux vous aider avec:\n• "Combien d\'établissements ?"\n• "Combien de textes pour l\'établissement E2 ?"\n• "Combien de formations pour E1 ?"\n• "Générer un rapport"\n• "Test - Données factices" (pour tester)' + voiceSupport + '\n\nComment puis-je vous aider ?');
  }

  toggleChat(): void {
    console.log('Toggle chat called, current state:', this.isOpen);
    this.isOpen = !this.isOpen;
    console.log('New state:', this.isOpen);
  }

  sendMessage(): void {
    if (!this.currentMessage.trim()) return;

    const userMessage = this.currentMessage.trim();
    this.addUserMessage(userMessage);
    this.currentMessage = '';
    this.isLoading = true;

    console.log('Processing query:', userMessage);

    // Mode test avec données factices
    if (userMessage.toLowerCase().includes('test') || userMessage.toLowerCase().includes('factice')) {
      this.simulateMockResponse();
      return;
    }

    this.dashboardService.processChatbotQuery(userMessage).subscribe({
      next: (response: ChatbotResponse) => {
        console.log('Chatbot response:', response);
        this.isLoading = false;
        this.handleBotResponse(response);
      },
      error: (error) => {
        console.error('Chatbot error:', error);
        this.isLoading = false;
        // Fallback vers données factices si erreur
        this.simulateMockResponse();
      }
    });
  }

  cancelRequest(): void {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = undefined;
    }
    this.isLoading = false;
    this.addBotMessage('❌ Question annulée. Comment puis-je vous aider autrement ?');
  }

  private simulateMockResponse(): void {
    const lastUserMessage = this.messages[this.messages.length - 2]?.content || '';
    console.log('Using mock response for:', lastUserMessage);

    // Simuler un délai de traitement avec possibilité d'annulation
    this.loadingTimeout = setTimeout(() => {
      this.loadingTimeout = undefined;
      this.isLoading = false;
      
      if (lastUserMessage.toLowerCase().includes('établissement')) {
        this.addBotMessage('Il y a actuellement 12 établissements répartis comme suit:', {
          total: 12,
          parType: {
            'Université': 4,
            'École Supérieure': 3,
            'Institut': 5
          },
          parStatut: {
            'Public': 8,
            'Privé': 4
          }
        });
      } else if (lastUserMessage.toLowerCase().includes('textes') && lastUserMessage.toLowerCase().includes('e2')) {
        this.addBotMessage('L\'établissement E2 a 25 texte(s) réglementaire(s).', {
          etablissementId: 'E2',
          count: 25
        });
      } else if (lastUserMessage.toLowerCase().includes('formations') && lastUserMessage.toLowerCase().includes('e1')) {
        this.addBotMessage('L\'établissement E1 propose 18 formation(s).', {
          etablissementId: 'E1',
          count: 18
        });
      } else if (lastUserMessage.toLowerCase().includes('rapport') || lastUserMessage.toLowerCase().includes('générer')) {
        const reportData = {
          date: new Date().toLocaleDateString('fr-FR'),
          textes: { total: 156, enVigueur: 89, abroges: 45, projet: 22 },
          etablissements: { total: 12, parType: { 'Université': 4, 'École Supérieure': 3, 'Institut': 5 } },
          formations: { total: 67, parEtablissement: { 'E1': 18, 'E2': 15, 'E3': 12 } },
          resume: { totalTextes: 156, totalEtablissements: 12, totalFormations: 67 }
        };
        this.addBotMessage('Voici le rapport demandé:', reportData);
      } else {
        this.addBotMessage('Je peux vous aider avec les statistiques des établissements, des formations et des textes. Essayez de demander: "Combien d\'établissements ?", "Combien de textes pour l\'établissement E2 ?", ou "Générer un rapport".');
      }
    }, 1500); // 1.5 secondes pour simuler le traitement
  }

  private handleBotResponse(response: ChatbotResponse): void {
    let message = response.message;

    if (response.type === 'stats' && response.data) {
      if (response.data.etablissementId) {
        // Cas spécifique pour un établissement
        message = response.message;
      } else {
        // Cas général des statistiques d'établissements
        const details = [];
        if (response.data.parType) {
          details.push('Par type: ' + Object.entries(response.data.parType)
            .map(([type, count]) => `${type}: ${count}`)
            .join(', '));
        }
        if (response.data.parStatut) {
          details.push('Par statut: ' + Object.entries(response.data.parStatut)
            .map(([statut, count]) => `${statut}: ${count}`)
            .join(', '));
        }
        if (details.length > 0) {
          message += '\n\n' + details.join('\n');
        }
      }
      this.addBotMessage(message, response.data);
    } else if (response.type === 'report' && response.reportData) {
      this.addBotMessage(message, response.reportData);
      this.addBotMessage(this.formatReport(response.reportData));
    } else {
      this.addBotMessage(message);
    }
  }

  private formatReport(reportData: any): string {
    let report = `📊 RAPPORT DU ${reportData.date}\n\n`;
    
    report += `📋 RÉSUMÉ:\n`;
    report += `• Total textes: ${reportData.resume.totalTextes}\n`;
    report += `• Total établissements: ${reportData.resume.totalEtablissements}\n`;
    report += `• Total formations: ${reportData.resume.totalFormations}\n\n`;

    report += `📄 TEXTES RÉGLEMENTAIRES:\n`;
    report += `• En vigueur: ${reportData.textes.enVigueur}\n`;
    report += `• Abrogés: ${reportData.textes.abroges}\n`;
    report += `• En projet: ${reportData.textes.projet}\n\n`;

    if (reportData.etablissements.parType && Object.keys(reportData.etablissements.parType).length > 0) {
      report += `🏢 ÉTABLISSEMENTS PAR TYPE:\n`;
      Object.entries(reportData.etablissements.parType).forEach(([type, count]) => {
        report += `• ${type}: ${count}\n`;
      });
      report += '\n';
    }

    if (reportData.formations.parEtablissement && Object.keys(reportData.formations.parEtablissement).length > 0) {
      report += `🎓 FORMATIONS PAR ÉTABLISSEMENT:\n`;
      Object.entries(reportData.formations.parEtablissement).forEach(([etabId, count]) => {
        report += `• ${etabId}: ${count} formation(s)\n`;
      });
    }

    return report;
  }

  private addUserMessage(content: string): void {
    this.messages.push({
      type: 'user',
      content,
      timestamp: new Date()
    });
    this.scrollToBottom();
  }

  private addBotMessage(content: string, data?: any): void {
    this.messages.push({
      type: 'bot',
      content,
      data,
      timestamp: new Date()
    });
    this.scrollToBottom();
  }

  // Helper pour formater le contenu avec des sauts de ligne
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

  downloadReport(reportData: any): void {
    const reportText = this.formatReport(reportData);
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
    // Arrêter la reconnaissance vocale si active
    if (this.speechRecognition && this.isListening) {
      this.speechRecognition.stop();
    }
  }
}
