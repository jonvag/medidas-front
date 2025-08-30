import { Component, inject, Input, signal } from '@angular/core';
import { UsuariosService } from '../../../service/usuarios.service';
import { PesoClient } from '../../../api/client';
import { CommonModule, DatePipe } from '@angular/common';
import { User } from '../../../api/user';

@Component({
  selector: 'app-resumen-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-client.component.html',
  styleUrl: './resumen-client.component.css'
})
export class ResumenClientComponent {

  @Input() clientIdHijo: User | undefined;

  private usuarioService = inject(UsuariosService);

  pesosClient = signal<PesoClient[]>([]);
  fechas = signal<string[]>([]);
  pesoPorFecha = signal<number[]>([]);
  estaturaPorFecha = signal<number[]>([]);
  cinturaPorFecha = signal<number[]>([]);
  cargandoWeigh = signal<boolean>(false);

  contGCT = 0;

  constructor() { }

  ngOnInit(): void {

    console.log("clientIdHijo  en resumen", this.clientIdHijo);
    this.cargaPesoClient(this.clientIdHijo?.id!);

  }

  cargaPesoClient(idClient: string): void {
    this.usuarioService.getPesoClientById(idClient!).subscribe(((pesosClient: any) => {
      if (pesosClient.error) {

        console.log("pesosClient.error ", pesosClient.error);
      }

      
      // Agregar gct a cada item
      const sexo = this.clientIdHijo?.sexo || '';
      const age = this.clientIdHijo?.age || '';

      const pesosClientWithGCT = pesosClient.map((item: any) => ({
        ...item,
        gct: this.calcGCT(item.cintura, age, sexo)
      }));
      this.pesosClient.set(pesosClientWithGCT);
      console.log("Pesos client: ", this.pesosClient());
      this.cargarFechas();
      this.cargarPesos();
      this.cargarCintura();
      this.cargarEstatura();

      this.cargandoWeigh.set(true);

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

  calcGCT(cintura:string, age:string, sexo:string): number {
    let calcGCT: number;
    this.contGCT = this.contGCT + 1;
    if (sexo == 'M') {
      calcGCT = (0.567 *  parseFloat(cintura)) + (0.101 * parseInt(age)) - 31.8;
    } else {
      console.log("cintura ", parseFloat(cintura), " age ", parseInt(age), " sexo ", sexo);
      calcGCT = (0.439 *  parseFloat(cintura)) + (0.221 * parseInt(age)) - 9.4;
      console.log("calcGCT ", calcGCT, " contGCT ", this.contGCT);
    }

    return Math.round(calcGCT * 100) / 100;
  }

}
