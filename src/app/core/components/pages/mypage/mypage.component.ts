import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../../../layout/service/app.layout.service';
import { ArmarComidaComponent } from "../../blocks/armar-comida/armar-comida.component";
import { CardDashComponent } from "../../blocks/card-dash/card-dash.component";
import { TypeEvaluationDashComponent } from "../../blocks/type-evaluation-dash/type-evaluation-dash.component";

@Component({
  selector: 'app-mypage',
  standalone: true,
  imports: [ButtonModule, ArmarComidaComponent, CardDashComponent, TypeEvaluationDashComponent],
  templateUrl: './mypage.component.html',
  styleUrl: './mypage.component.css'
})
export class MypageComponent {
  private layoutService = inject(LayoutService);
  userName: string = '';

  ngOnInit(): void {
    const loginUserStr = localStorage.getItem('loginUser');
    if (loginUserStr) {
      const loginUser = JSON.parse(loginUserStr);
      this.userName = loginUser.name || '';
    }
  }
}
