import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { AuthService } from '../services/auth.service';
import { Mission, MissionNotification, MissionNotificationService } from '../services/mission-notification.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-mes-missions',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './mes-missions.component.html'
})
export class MesMissionsComponent implements OnInit {
  missions: Mission[] = [];
  notifications: MissionNotification[] = [];

  constructor(
    private auth: AuthService,
    private missionService: MissionNotificationService,
    private toast: NotificationService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    const username = this.auth.currentUser?.username;
    if (!username) {
      this.missions = [];
      this.notifications = [];
      return;
    }
    this.missions = this.missionService.getMissionsForUser(username);
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
    this.toast.success('Notifications marquées comme lues');
    this.refresh();
  }
}
