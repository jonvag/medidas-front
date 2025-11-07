import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface CardDashData {
  title: string;
  value: number | string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'app-card-dash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-dash.component.html',
  styleUrls: ['./card-dash.component.css']
})
export class CardDashComponent {

  cards: CardDashData[] = [
    {
      title: 'Pacientes',
      value: 50,
      icon: 'pi pi-shopping-cart text-red-500 text-xl',
      colorClass: 'bg-red-200'
    },
    {
      title: 'Evaluaciones',
      value: 80,
      icon: 'pi pi-apple text-green-500 text-xl',
      colorClass: 'bg-green-200'
    },
    {
      title: 'Entrenamientos',
      value: 90,
      icon: 'pi pi-bolt text-blue-500 text-xl',
      colorClass: 'bg-blue-200'
    },
    {
      title: 'Mi perfil',
      value: 90,
      icon: 'pi pi-bolt text-yellow-500 text-xl',
      colorClass: 'bg-yellow-200'
    }
  ];

}
