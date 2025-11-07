import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { MonthDashComponent } from "../month-dash/month-dash.component";

@Component({
  selector: 'app-type-evaluation-dash',
  standalone: true,
  imports: [CommonModule, ChartModule, MonthDashComponent],
  templateUrl: './type-evaluation-dash.component.html',
  styleUrl: './type-evaluation-dash.component.css'
})
export class TypeEvaluationDashComponent {
  
}
