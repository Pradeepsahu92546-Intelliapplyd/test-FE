import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  // if user is already logged in, allow navigation
  if (auth.isUserAuthenticated()) return true;
  // otherwise redirect to authentication shell (login/register)
  router.navigateByUrl('/auth');
  return false;
};


