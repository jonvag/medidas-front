import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { AppLayoutComponent } from './app.layout.component';

import { MypageComponent } from '../core/components/pages/mypage/mypage.component';
import { TableImcComponent } from '../core/components/table-imc/table-imc.component';
import { PorcionAlimentosComponent } from '../core/components/porcion-alimentos/porcion-alimentos.component';
import { DetailClientComponent } from '../core/components/pages/detail-client/detail-client.component';
import { TabViewComponent } from '../core/components/pages/tab-view/tab-view.component';
import { PlanPacienteComponent } from '../core/components/pages/plan-paciente/plan-paciente.component';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: MypageComponent, canActivate: [authGuard] },
      { path: 'table-imc', component: TableImcComponent, canActivate: [authGuard] },
      { path: 'plan-paciente', component: PlanPacienteComponent, canActivate: [authGuard] },
      { path: 'porcion-alimentos', component: PorcionAlimentosComponent, canActivate: [authGuard] },
      { path: 'detail-client/:id', component: DetailClientComponent, canActivate: [authGuard] },
      { path: 'datos-paciente/:id', component: TabViewComponent, canActivate: [authGuard] },
    ]
  },
  //{path:'',component:MypageComponent},
];