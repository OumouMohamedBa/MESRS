import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html'
  
})
export class SidebarComponent {
  constructor(private auth: AuthService) {
  }

  // 👉 propriété calculée utilisée par le *ngIf dans le HTML
  get isIG(): boolean {
    return this.auth.hasRole(['INSPECTEUR_GENERAL']);
  }
}
