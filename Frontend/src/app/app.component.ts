import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastNotificationComponent } from './components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, ToastNotificationComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'mesrs-front';  
  langue: 'fr' | 'ar' = 'fr';
  currentYear = new Date().getFullYear();

  constructor(public router: Router) {}

  toggleLangue() {
    this.langue = this.langue === 'fr' ? 'ar' : 'fr';
  }
}
