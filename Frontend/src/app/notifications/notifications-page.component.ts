import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { AuthService } from '../services/auth.service';
import { MissionNotification, MissionNotificationService } from '../services/mission-notification.service';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './notifications-page.component.html'
})
export class NotificationsPageComponent implements OnInit {
  notifications: MissionNotification[] = [];

  constructor(private auth: AuthService, private missionService: MissionNotificationService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    const username = this.auth.currentUser?.username;
    if (!username) {
      this.notifications = [];
      return;
    }
    this.notifications = this.missionService
      .getNotificationsForUser(username)
      .slice()
      .sort((a, b) => (a.createdAtIso < b.createdAtIso ? 1 : -1));
  }

  markRead(id: number): void {
    this.missionService.markNotificationRead(id);
    this.refresh();
  }

  markAllRead(): void {
    const username = this.auth.currentUser?.username;
    if (!username) return;
    this.missionService.markAllReadForUser(username);
    this.refresh();
  }
}
