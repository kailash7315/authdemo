import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from './login.service';
import { exhaustMap, take } from 'rxjs';
import { User } from './user.model';

export const loginInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(LoginService)
  return authService.user.pipe(
    take(1),
    exhaustMap((user: User | null) => {
      if (user && user.token) {
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token)
        })
        return next(modifiedReq);
      }
      return next(req);
    })
  );
};
