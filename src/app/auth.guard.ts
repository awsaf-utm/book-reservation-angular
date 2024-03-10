import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  console.log('AuthGuard#canActivate called');
  const router = inject(Router);
  const cookieService = inject(CookieService);

  const token = cookieService.get('userToken');
  if (token) {
    return true;
  }
  else {
    router.navigate(['/auth']);
    return false;
  }
};
