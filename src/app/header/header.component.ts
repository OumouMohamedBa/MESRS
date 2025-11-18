import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, UpperCasePipe, CommonModule],
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
    this.openNotifications.emit();
  }

  onLogout() {
    this.logout.emit();
    this.isProfileOpen = false;
  }
}
