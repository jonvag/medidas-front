import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-mypage',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './mypage.component.html',
  styleUrl: './mypage.component.css'
})
export class MypageComponent {

}
