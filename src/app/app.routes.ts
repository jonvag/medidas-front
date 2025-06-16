import { Routes } from '@angular/router';

export const routes: Routes = [

  {path: 'dashboard', loadChildren: () => import('./layout/layout.routes').then(m => m.LAYOUT_ROUTES)},
  {path: 'landing', loadChildren: () => import('./pages/landing.routes').then(m => m.LANDING_ROUTES)},
  {path: 'auth', loadChildren: () => import('./core/components/pages/auth/auth.routes').then(m => m.AUTH_ROUTES)},
  //{ path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: 'auth/login' },
];
