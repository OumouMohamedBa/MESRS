import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

<<<<<<< HEAD
// Icônes
import { LucideAngularModule, Home, Scale, Building, GraduationCap, Users, Coins, FlaskConical, BarChart3, ClipboardList, Settings } from 'lucide-angular';
=======
import { LucideAngularModule, Home, Scale, Building, GraduationCap } from 'lucide-angular';
import { AppComponent } from './app.component';
>>>>>>> 7e948bb (feat: modifications frontend + backend user)

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
<<<<<<< HEAD
    BrowserModule,              // ⚠️ important dans AppModule
    HttpClientModule,           // ✅ Ajout obligatoire pour HttpClient !!! 
    LucideAngularModule.pick({
      Home, Scale, Building, GraduationCap, Users, Coins, FlaskConical, BarChart3, ClipboardList, Settings
    })
  ],
=======
    BrowserModule,
    HttpClientModule,  // ✅ c’est bien ici
    LucideAngularModule.pick({ Home, Scale, Building, GraduationCap })
  ],
  bootstrap: [AppComponent]
>>>>>>> 7e948bb (feat: modifications frontend + backend user)
})
export class AppModule {}
