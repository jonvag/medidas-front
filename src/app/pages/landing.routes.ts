import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';

export const LANDING_ROUTES: Routes = [
  //{ path: '', redirectTo: 'inicio', pathMatch: 'full' }, 
  { path: '', component: LandingComponent },
  { path: 'home', component: LandingComponent },
];