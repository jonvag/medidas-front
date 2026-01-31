import { Component, Input } from '@angular/core';
import { TabViewComponent } from "../tab-view/tab-view.component";

@Component({
  selector: 'app-datos-paciente',
  standalone: true,
  imports: [],
  templateUrl: './datos-paciente.component.html',
  styleUrl: './datos-paciente.component.css'
})
export class DatosPacienteComponent {

  @Input() datosPaciente: any;

  OnInit() {
  console.log(this.datosPaciente);  }


}
