import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf],
  templateUrl: './app.component.html',
})
export class AppComponent {
  langue: 'fr' | 'ar' = 'fr';
  currentYear = new Date().getFullYear();

  constructor(public router: Router) {}

  toggleLangue() {
    this.langue = this.langue === 'fr' ? 'ar' : 'fr';
  }
}
