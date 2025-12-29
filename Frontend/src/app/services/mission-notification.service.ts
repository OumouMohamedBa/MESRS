import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export interface Mission {
  id: number;
  date: string; // YYYY-MM-DD
  objet: string;
  etablissementId: string;
  assignedToUsername: string;
  createdByUsername: string;
  createdAtIso: string;
}

export interface MissionNotification {
  id: number;
  userUsername: string;
  type: 'MISSION_ASSIGNED';
  message: string;
  missionId: number;
  createdAtIso: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MissionNotificationService {
  private missionsKey = 'missions_store_v1';
  private notifKey = 'mission_notifications_store_v1';

  constructor(private auth: AuthService) {}

  private normalizeUsername(username: string): string {
    return (username || '').trim().toLowerCase();
  }

  getUnreadCountForCurrentUser(): number {
    const username = this.auth.currentUser?.username;
    if (!username) return 0;
    return this.getUnreadCountForUser(username);
  }

  getUnreadCountForUser(username: string): number {
    return this.getNotificationsForUser(username).filter((n) => !n.read).length;
  }

  getMissionsForUser(username: string): Mission[] {
    const u = this.normalizeUsername(username);
    return this.readMissions().filter((m) => this.normalizeUsername(m.assignedToUsername) === u);
  }

  getAllMissions(): Mission[] {
    return this.readMissions();
  }

  getNotificationsForUser(username: string): MissionNotification[] {
    const u = this.normalizeUsername(username);
    return this.readNotifications().filter((n) => this.normalizeUsername(n.userUsername) === u);
  }

  createMission(input: { date: string; objet: string; etablissementId: string; assignedToUsername: string }): Mission {
    const createdBy = this.auth.currentUser?.username || 'system';
    const assignedTo = this.normalizeUsername(input.assignedToUsername);

    const missions = this.readMissions();
    const id = this.nextId(missions.map((m) => m.id));

    const mission: Mission = {
      id,
      date: input.date,
      objet: input.objet,
      etablissementId: input.etablissementId,
      assignedToUsername: assignedTo,
      createdByUsername: this.normalizeUsername(createdBy),
      createdAtIso: new Date().toISOString()
    };

    missions.push(mission);
    this.writeMissions(missions);

    const notifs = this.readNotifications();
    const notifId = this.nextId(notifs.map((n) => n.id));
    const notif: MissionNotification = {
      id: notifId,
      userUsername: assignedTo,
      type: 'MISSION_ASSIGNED',
      message: `Une mission d'inspection vous a été affectée (${input.date}) : ${input.objet}`,
      missionId: mission.id,
      createdAtIso: new Date().toISOString(),
      read: false
    };
    notifs.push(notif);
    this.writeNotifications(notifs);

    return mission;
  }

  markNotificationRead(notificationId: number): void {
    const notifs = this.readNotifications();
    const idx = notifs.findIndex((n) => n.id === notificationId);
    if (idx === -1) return;
    notifs[idx] = { ...notifs[idx], read: true };
    this.writeNotifications(notifs);
  }

  markAllReadForUser(username: string): void {
    const notifs = this.readNotifications();
    const u = this.normalizeUsername(username);
    const updated = notifs.map((n) =>
      this.normalizeUsername(n.userUsername) === u ? { ...n, read: true } : n
    );
    this.writeNotifications(updated);
  }

  private readMissions(): Mission[] {
    const raw = localStorage.getItem(this.missionsKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Mission[];
    } catch {
      return [];
    }
  }

  private writeMissions(missions: Mission[]): void {
    localStorage.setItem(this.missionsKey, JSON.stringify(missions));
  }

  private readNotifications(): MissionNotification[] {
    const raw = localStorage.getItem(this.notifKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as MissionNotification[];
    } catch {
      return [];
    }
  }

  private writeNotifications(notifs: MissionNotification[]): void {
    localStorage.setItem(this.notifKey, JSON.stringify(notifs));
  }

  private nextId(ids: number[]): number {
    if (ids.length === 0) return 1;
    return Math.max(...ids) + 1;
  }
}
