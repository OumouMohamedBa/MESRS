import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { AuthService } from '../services/auth.service'; 
import { Router } from '@angular/router';
import { MissionNotificationService } from '../services/mission-notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [UpperCasePipe, CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Input() title = '';
  @Input() langue: 'fr' | 'ar' | 'en' = 'fr';
  @Input() withSidebar = false;

  @Output() changeLang = new EventEmitter<'fr' | 'ar' | 'en'>();
  @Output() toggleDark = new EventEmitter<void>();
  @Output() openNotifications = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>();   // pour le bouton menu mobile

  isLangOpen = false;
  isProfileOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private missionNotif: MissionNotificationService
  ) {}

  get currentUser() {
    return this.authService.currentUser;
  }

  get unreadCount(): number {
    return this.missionNotif.getUnreadCountForCurrentUser();
  }

  getUserInitials(): string {
    const user = this.currentUser;
    if (!user || !user.username) return 'IN';
    return user.username.substring(0, 2).toUpperCase();
  }

  getUserDisplayName(): string {
    const user = this.currentUser;
    if (!user) return 'Inspecteur';
    // Afficher le username ou un nom formaté
    return user.username;
  }

  // 🔹 Fermer les menus quand on clique en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.lang-menu')) {
      this.isLangOpen = false;
    }
    if (!target.closest('.profile-menu')) {
      this.isProfileOpen = false;
    }
  }

  toggleLangMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isLangOpen = !this.isLangOpen;
    if (this.isLangOpen) {
      this.isProfileOpen = false;
    }
  }

  toggleProfileMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isProfileOpen = !this.isProfileOpen;
    if (this.isProfileOpen) {
      this.isLangOpen = false;
    }
  }

  closeMenus() {
    this.isLangOpen = false;
    this.isProfileOpen = false;
  }

  onSelectLang(lang: 'fr' | 'ar' | 'en') {
    this.changeLang.emit(lang);
    this.langue = lang;
    this.isLangOpen = false;
  }

  onToggleDark() {
    this.toggleDark.emit();
  }

  onOpenNotifications() {
    this.router.navigateByUrl('/notifications');
    this.openNotifications.emit();
  }

  onLogout() {
    this.authService.logout();
    this.logout.emit(); // On garde l'event au cas où, mais l'action principale est faite
    this.isProfileOpen = false;
  }
}
