import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  setLang(lang: 'fr' | 'ar' | 'en') {
    this.changeLang.emit(lang);
  }

  onToggleDark() {
    this.toggleDark.emit();
  }
}
