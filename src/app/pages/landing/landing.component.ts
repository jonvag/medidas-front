import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../layout/service/app.layout.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, StyleClassModule, DividerModule, ChartModule, PanelModule, ButtonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  public layoutService= inject(LayoutService);

  constructor(public router:Router){}

}
