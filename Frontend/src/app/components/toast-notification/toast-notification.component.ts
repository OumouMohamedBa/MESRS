import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[9999] space-y-3 max-w-md">
      <div
        *ngFor="let notification of notifications"
        class="flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-sm border animate-slideInRight"
        [ngClass]="{
          'bg-emerald-50/95 border-emerald-200 text-emerald-800': notification.type === 'success',
          'bg-red-50/95 border-red-200 text-red-800': notification.type === 'error',
          'bg-amber-50/95 border-amber-200 text-amber-800': notification.type === 'warning',
          'bg-blue-50/95 border-blue-200 text-blue-800': notification.type === 'info'
        }"
      >
        <!-- Icône -->
        <div class="flex-shrink-0">
          <i
            class="text-xl"
            [ngClass]="{
              'fa-solid fa-check-circle text-emerald-600': notification.type === 'success',
              'fa-solid fa-exclamation-circle text-red-600': notification.type === 'error',
              'fa-solid fa-exclamation-triangle text-amber-600': notification.type === 'warning',
              'fa-solid fa-info-circle text-blue-600': notification.type === 'info'
            }"
          ></i>
        </div>

        <!-- Message -->
        <div class="flex-1 pt-0.5">
          <p class="text-sm font-semibold leading-relaxed">{{ notification.message }}</p>
        </div>

        <!-- Bouton fermer -->
        <button
          (click)="close(notification.id)"
          class="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
        >
          <i class="fa-solid fa-times text-sm opacity-60 hover:opacity-100"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .animate-slideInRight {
      animation: slideInRight 0.3s ease-out;
    }
  `]
})
export class ToastNotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifications.subscribe(
      notifications => this.notifications = notifications
    );
  }

  close(id: number) {
    this.notificationService.remove(id);
  }
}
