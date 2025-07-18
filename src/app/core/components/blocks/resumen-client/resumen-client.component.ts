import { Component, inject, Input, signal } from '@angular/core';
import { UsuariosService } from '../../../service/usuarios.service';
import { PesoClient } from '../../../api/client';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-resumen-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-client.component.html',
  styleUrl: './resumen-client.component.css'
})
export class ResumenClientComponent {

  @Input() clientIdHijo: string | null = null;
  private usuarioService = inject(UsuariosService);

  pesosClient = signal<PesoClient[]>([]);
  fechas = signal<string[]>([]);
  pesoPorFecha = signal<number[]>([]);
  estaturaPorFecha = signal<number[]>([]);
  cinturaPorFecha = signal<number[]>([]);

  constructor() { }

  ngOnInit(): void {

    this.cargaPesoClient(this.clientIdHijo);

  }

  cargaPesoClient(idClient: string | null): void {
    this.usuarioService.getPesoClientById(idClient!).subscribe(((pesosClient: any) => {
      if (pesosClient.error) {

        console.log("pesosClient.error ", pesosClient.error);
      }

      this.pesosClient.set(pesosClient);
      console.log("Pesos client: ", this.pesosClient());
      this.cargarFechas();
      this.cargarPesos();
      this.cargarCintura();
      this.cargarEstatura();

    }));
  }

  cargarFechas() {
    const datePipe = new DatePipe('en-US'); // o 'es-ES' para español

    const fechasFormateadas = this.pesosClient().map(item => {
      return datePipe.transform(item.createdAt, 'MMMM, yyyy') || '';
    });

    this.fechas.set(fechasFormateadas);

    console.log("Fechas formateadas: ", this.fechas());
  }

  cargarPesos() {
    const pesos = this.pesosClient().map(item => {
      return parseFloat(item.peso);
    });

    this.pesoPorFecha.set(pesos);
    console.log("Pesos por fecha: ", this.pesoPorFecha());
  }

  cargarEstatura() {
    const estatura = this.pesosClient().map(item => {
      return parseFloat(item.estatura);
    });

    this.estaturaPorFecha.set(estatura);
  }

  cargarCintura() {
    const cintura = this.pesosClient().map(item => {
      return parseFloat(item.cintura);
    });

    this.cinturaPorFecha.set(cintura);
  }

}
