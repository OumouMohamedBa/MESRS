import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LucideAngularModule, Home, Scale, Building, GraduationCap, Users, Coins, FlaskConical, BarChart3, ClipboardList, Settings, School, UserCog } from 'lucide-angular';

import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      LucideAngularModule.pick({
        Home,
        Scale,
        Building,
        GraduationCap,
        Users,
        Coins,
        FlaskConical,
        BarChart3,
        ClipboardList,
        Settings,
        School,
        UserCog
      })
    )
  ]
};
