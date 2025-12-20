import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastNotificationComponent } from './components/toast-notification/toast-notification.component';
import { ModalComponent } from './shared/modal/modal.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, ToastNotificationComponent, ModalComponent, AboutComponent, ContactComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'mesrs-front';  
  langue: 'fr' | 'ar' = 'fr';
  currentYear = new Date().getFullYear();

  activePopup: 'about' | 'contact' | null = null;

  constructor(public router: Router) {}

  toggleLangue() {
    this.langue = this.langue === 'fr' ? 'ar' : 'fr';
  }

  openPopup(type: 'about' | 'contact'): void {
    this.activePopup = type;
    document.body.style.overflow = 'hidden';
  }

  closePopup(): void {
    this.activePopup = null;
    document.body.style.overflow = 'auto';
  }
}
