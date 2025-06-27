import { Component, inject, Input, signal } from '@angular/core';
import { UsuariosService } from '../../../service/usuarios.service';
import { PesoClient } from '../../../api/client';
import { CommonModule, DatePipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-pesos',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './pesos.component.html',
  styleUrl: './pesos.component.css'
})
export class PesosComponent {

  private usuarioService = inject(UsuariosService);

  @Input() clientIdHijo: string | null = null;

  pesosClient = signal<PesoClient[]>([]);
  fechas = signal<string[]>([]);
  pesoPorFecha = signal<number[]>([]);
  lineData: any;
  lineOptions: any;

  ngOnInit(): void {

    this.cargaPesoClient(this.clientIdHijo);

  }

  cargaPesoClient(idClient: string | null): void {
    this.usuarioService.getPesoClientById(idClient!).subscribe(((pesosClient: any) => {
      if (pesosClient.error) {

        console.log("pesosClient.error ", pesosClient.error);
      }

      this.pesosClient.set(pesosClient);
      console.log(this.pesosClient().length);
      this.cargarFechas();
      this.cargarPesos();
      this.initCharts();

    }));
  }

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.lineData = {
      labels: this.fechas(),
      datasets: [
        {
          label: 'Peso (Kg)',
          data: this.pesoPorFecha(),
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--primary-500'),
          borderColor: documentStyle.getPropertyValue('--primary-500'),
          tension: .4
        },
        {
          label: 'Fecha',
          data: [0],
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--primary-200'),
          borderColor: documentStyle.getPropertyValue('--primary-200'),
          tension: .4
        }
      ]
    };

    this.lineOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
      }
    };
  }

  cargarFechas() {
    const datePipe = new DatePipe('en-US'); // o 'es-ES' para español

    const fechasFormateadas = this.pesosClient().map(item => {
      return datePipe.transform(item.createdAt, 'MMMM, yyyy') || '';
    });

    this.fechas.set(fechasFormateadas);
  }

  cargarPesos() {
    const pesos = this.pesosClient().map(item => {
      return parseFloat(item.peso);
    });

    this.pesoPorFecha.set(pesos);
  }

}
