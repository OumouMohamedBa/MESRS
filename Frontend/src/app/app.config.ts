import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LucideAngularModule, Home, Scale, Building, GraduationCap, Users, Coins, FlaskConical, BarChart3, ClipboardList, Settings } from 'lucide-angular';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
<<<<<<< HEAD
=======
    
>>>>>>> 7e948bb (feat: modifications frontend + backend user)
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
        Settings
      })
    )
  ]
};
