import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../../../layout/service/app.layout.service';

@Component({
  selector: 'app-mypage',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './mypage.component.html',
  styleUrl: './mypage.component.css'
})
export class MypageComponent {
  private layoutService= inject(LayoutService);

  ngOnInit(): void {
    
    
  }

}
