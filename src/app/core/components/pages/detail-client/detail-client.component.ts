import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../../service/usuarios.service';
import { User } from '../../../api/user';
import { PesosComponent } from "../pesos/pesos.component";
import { ResumenClientComponent } from '../../blocks/resumen-client/resumen-client.component';

@Component({
  selector: 'app-detail-client',
  standalone: true,
  imports: [CommonModule, PesosComponent,  ResumenClientComponent],
  templateUrl: './detail-client.component.html',
  styleUrl: './detail-client.component.css'
})
export class DetailClientComponent {

  constructor(public router: Router, public route:ActivatedRoute) { }

  private usuariosService = inject(UsuariosService);

  infoClient = signal<User>({
    name: "",
    lastname: "",
    email: "",
    password1: ""
  });

  clientId: string | null = null;

  ngOnInit(): void {

    this.clientId = this.route.snapshot.paramMap.get('id');

    this.cargaInfoClient(this.clientId!)
  }

  cargaInfoClient(idClient: string) {
    this.usuariosService.getClientInfoById(idClient).subscribe(((infoClient: any) => {
      if (infoClient.error) {

        console.log("No se actualizo la infoClient, debe solicitar otro token ");
        console.log("infoClient ", infoClient);
      }

      console.log("Cliente recuperado ", infoClient);

      this.infoClient.set(infoClient);

    }));
  }

  goToIMC() {
    this.router.navigateByUrl('/dashboard/table-imc');
  }

}
