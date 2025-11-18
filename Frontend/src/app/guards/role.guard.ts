import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService, Role } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowed = route.data?.['roles'] as Role[] | undefined;
  if (!auth.isAuthenticated()) return router.parseUrl('/login');
  if (!allowed || auth.hasRole(allowed)) return true;
  return router.parseUrl('/dashboard');
};
