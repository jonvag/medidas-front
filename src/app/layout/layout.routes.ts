import { Routes } from '@angular/router';
import { AppLayoutComponent } from './app.layout.component';

import { MypageComponent } from '../core/components/pages/mypage/mypage.component';
import { TableImcComponent } from '../core/components/table-imc/table-imc.component';
import { PorcionAlimentosComponent } from '../core/components/porcion-alimentos/porcion-alimentos.component';
import { DetailClientComponent } from '../core/components/pages/detail-client/detail-client.component';

export const LAYOUT_ROUTES: Routes = [
    {
      path: '',
      component:AppLayoutComponent,
      children:[
        {path:'',component:MypageComponent},
        {path:'table-imc', component: TableImcComponent},
        {path:'porcion-alimentos', component: PorcionAlimentosComponent},
        {path:'detail-client/:id', component: DetailClientComponent},
      ]
    },
    //{path:'',component:MypageComponent},
];