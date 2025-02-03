import { Routes } from '@angular/router';
import { logoutActivateGuard } from './shared/guards/logout-activate.guard';
import { loginActivateGuard } from './shared/guards/login-activate.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.authRoutes),
    canActivate: [logoutActivateGuard]
  },
  {
    path: 'events',
    loadChildren: () =>
      import('./events/events.routes').then((m) => m.eventsRoutes),
    canActivate: [loginActivateGuard]
  },
];
