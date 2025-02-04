import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user';
import { ProfileService } from '../services/profile.service';

export const profileResolver: ResolveFn<User> = (route) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);
  return profileService.getUser(+route.params['id']).pipe(
    catchError((error) => {
      console.error('Event fetch failed:', error);
      router.navigate(['/events']);
      return EMPTY;
    })
  );
};

