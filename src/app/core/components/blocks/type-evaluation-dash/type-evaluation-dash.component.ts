import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-type-evaluation-dash',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './type-evaluation-dash.component.html',
  styleUrl: './type-evaluation-dash.component.css'
})
export class TypeEvaluationDashComponent {
  
}
