import { LucideAngularModule, Home, Scale, Building, GraduationCap, Users, Coins, FlaskConical, BarChart3, ClipboardList, Settings } from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({ Home, Scale, Building, GraduationCap, Users, Coins, FlaskConical, BarChart3, ClipboardList, Settings })
  ]
})
export class AppModule {}
