import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private nextId = 1;

  notifications = this.notifications$.asObservable();

  success(message: string, duration = 3000) {
    this.show('success', message, duration);
  }

  error(message: string, duration = 4000) {
    this.show('error', message, duration);
  }

  warning(message: string, duration = 3500) {
    this.show('warning', message, duration);
  }

  info(message: string, duration = 3000) {
    this.show('info', message, duration);
  }

  private show(type: Notification['type'], message: string, duration: number) {
    const notification: Notification = {
      id: this.nextId++,
      type,
      message,
      duration
    };

    const current = this.notifications$.value;
    this.notifications$.next([...current, notification]);

    if (duration > 0) {
      setTimeout(() => this.remove(notification.id), duration);
    }
  }

  remove(id: number) {
    const current = this.notifications$.value;
    this.notifications$.next(current.filter(n => n.id !== id));
  }
}
