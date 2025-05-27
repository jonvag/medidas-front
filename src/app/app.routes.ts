import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { MypageComponent } from './core/components/pages/mypage/mypage.component';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './core/components/pages/login/login.component';
import { TableImcComponent } from './core/components/table-imc/table-imc.component';

export const routes: Routes = [

  {
    path: '',
    component:AppLayoutComponent,
    children:[
      {path:'',component:MypageComponent},
      {path:'table-imc', component: TableImcComponent}
    ]
  },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  //{ path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/login' },
];
