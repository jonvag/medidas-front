import { Routes } from '@angular/router';
import { LoginComponent } from './core/components/pages/login/login.component';

export const routes: Routes = [

  {path: 'dashboard', loadChildren: () => import('./layout/layout.routes').then(m => m.LAYOUT_ROUTES)},
  {path: 'landing', loadChildren: () => import('./pages/landing.routes').then(m => m.LANDING_ROUTES)},
  {path: 'login', component: LoginComponent },
  //{ path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/login' },
];
