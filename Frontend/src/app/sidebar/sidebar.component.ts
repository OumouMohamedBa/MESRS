import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { MissionNotificationService } from '../services/mission-notification.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html'
  
})
export class SidebarComponent {
  constructor(private auth: AuthService, private missionNotif: MissionNotificationService) {}

  // 👉 propriété calculée utilisée par le *ngIf dans le HTML
  get isIG(): boolean {
    const user = this.auth.currentUser;
    console.log('Sidebar - Current user:', user);
    
    if (!user) {
      console.log('Sidebar - No user found');
      return false;
    }
    
    // Vérification stricte : uniquement INSPECTEUR_GENERAL
    const isInspectorGeneral = user.role === 'INSPECTEUR_GENERAL';
    
    console.log('Sidebar - User role:', user.role, 'Is Inspector General:', isInspectorGeneral);
    return isInspectorGeneral;
  }

  get isSousInspecteur(): boolean {
    return this.auth.hasRole(['SOUS_INSPECTEUR*']);
  }

  get unreadCount(): number {
    return this.missionNotif.getUnreadCountForCurrentUser();
  }
}
