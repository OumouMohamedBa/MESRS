import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// Icônes
import { LucideAngularModule, Home, Scale, Building, GraduationCap, Users, Coins, FlaskConical, BarChart3, ClipboardList, Settings } from 'lucide-angular';

@NgModule({
  imports: [
    BrowserModule,              // ⚠️ important dans AppModule
    HttpClientModule,           // ✅ Ajout obligatoire pour HttpClient !!! 
    LucideAngularModule.pick({
      Home, Scale, Building, GraduationCap, Users, Coins, FlaskConical, BarChart3, ClipboardList, Settings
    })
  ],
})
export class AppModule {}
