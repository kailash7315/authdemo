import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(LoginService);
  const router = inject(Router);
  return authService.user.pipe(
    take(1),
    map(user => {
    const isAuth = !!user;
    if (isAuth) {
      return !!user;
    }
    return router.createUrlTree(['/login']);
  }));
};
