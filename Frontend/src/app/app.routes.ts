import { FormationsListComponent } from './formations/formations-list.component';
import { FormationsAddComponent } from './formations/formations-add.component';
import { FormationsEditComponent } from './formations/formations-edit.component';
import { FormationsDetailComponent } from './formations/formations-detail.component';
import { FormationsXlsComponent } from './formations/formations-xls.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TextesListComponent } from './textes/textes-list.component';
import { TextesAddComponent } from './textes/textes-add.component';
import { TextesEditComponent } from './textes/textes-edit.component';
import { TextesDetailComponent } from './textes/textes-detail.component';
import { TextesPdfComponent } from './textes/textes-pdf.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UsersListComponent } from './users/users-list.component';
import { HomeComponent } from './home/home.component';
import { EtablissementsListComponent } from './etablissements/etablissements-list.component';
import { EtablissementsAddComponent } from './etablissements/etablissements-add.component';
import { EtablissementsEditComponent } from './etablissements/etablissements-edit.component';
import { EtablissementsDetailComponent } from './etablissements/etablissements-detail.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';


export const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'etablissements/nouveau', component: EtablissementsAddComponent, canActivate: [AuthGuard] },
  { path: 'etablissements/:id/edit', component: EtablissementsEditComponent, canActivate: [AuthGuard] },
  { path: 'etablissements/:id', component: EtablissementsDetailComponent, canActivate: [AuthGuard] },
  { path: 'textes/nouveau', component: TextesAddComponent, canActivate: [AuthGuard] },
  { path: 'textes/:id/edit', component: TextesEditComponent, canActivate: [AuthGuard] },
  { path: 'textes/:id/pdf', component: TextesPdfComponent, canActivate: [AuthGuard] },
  { path: 'textes/:id', component: TextesDetailComponent, canActivate: [AuthGuard] },
  { path: 'textes', component: TextesListComponent, canActivate: [AuthGuard] },
  { path: 'formations/nouveau', component: FormationsAddComponent, canActivate: [AuthGuard] },
  { path: 'formations/:id/edit', component: FormationsEditComponent, canActivate: [AuthGuard] },
  { path: 'formations/:id/xls', component: FormationsXlsComponent, canActivate: [AuthGuard] },
  { path: 'formations/:id', component: FormationsDetailComponent, canActivate: [AuthGuard] },
  { path: 'formations', component: FormationsListComponent, canActivate: [AuthGuard] },
  { path: 'etablissements', component: EtablissementsListComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersListComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['INSPECTEUR_GENERAL'] } },
  { path: 'users', component: UsersListComponent },
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: '**', redirectTo: 'dashboard' }
];
