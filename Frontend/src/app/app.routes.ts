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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'textes/nouveau', component: TextesAddComponent, canActivate: [AuthGuard] },
  { path: 'textes/:id/edit', component: TextesEditComponent, canActivate: [AuthGuard] },
  { path: 'textes/:id/pdf', component: TextesPdfComponent, canActivate: [AuthGuard] },
  { path: 'textes/:id', component: TextesDetailComponent, canActivate: [AuthGuard] },
  { path: 'textes', component: TextesListComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersListComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['INSPECTEUR_GENERAL'] } },
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: '**', redirectTo: 'dashboard' }
];
