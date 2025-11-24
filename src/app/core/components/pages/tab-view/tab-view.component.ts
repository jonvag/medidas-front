import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject, signal, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from "primeng/inputtextarea";

import { Goals } from '../../../api/client';
import { MessageService } from 'primeng/api';
import { User } from '../../../api/user';
import { GoalsService } from '../../../service/datos-client/goals.service';

@Component({
  selector: 'app-tab-view',
  standalone: true,
  imports: [CommonModule, TabViewModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    SliderModule,
    InputTextModule,
    ToggleButtonModule,
    RippleModule,
    MultiSelectModule,
    DropdownModule,
    ProgressBarModule,
    DialogModule,
    ToastModule,
    InputNumberModule,
    RadioButtonModule,
    ConfirmDialogModule,
    TooltipModule,
    InputTextareaModule

  ],
  providers: [MessageService],
  templateUrl: './tab-view.component.html',
  styleUrl: './tab-view.component.css'
})
export class TabViewComponent {

  // id capturado desde la URL
  clientId: string | null = null;

  // inyectar la ruta para leer parámetros
  private route = inject(ActivatedRoute);

  submittedGoals: boolean = false;
  formErrorsGoals = signal<any>("");
  createClientDialog: boolean = true;

  private messageService = inject(MessageService);
  private goalService = inject(GoalsService);

  userLoggeado: User = {
    name: "",
    lastname: "",
    email: "",
    password1: ""
  };

  goals: Goals = {
    client_id: '0',
    motivo_consulta: "",
    obje_esperado: "",
    tabaco: "",
    alcohol: "",
    hora_dormir: "",
    hora_despertar: "",
    horas_sueno: "",
    info_adicional: ""
  };

  // Opciones para el select de tabaco
  frequencyOptions = [
    { label: 'Una vez al dia', value: 'una vez al dia' },
    { label: 'Dos veces al dia', value: 'dos veces al dia' },
    { label: 'Mas de dos veces al dia', value: 'mas de dos veces al dia' },
    { label: 'Una vez por semana', value: 'una vez por semana' },
    { label: 'Dos veces por semana', value: 'dos veces por semana' },
    { label: 'Mas de dos veces por semana', value: 'mas de dos veces por semana' },
    { label: 'Una vez al mes', value: 'una vez al mes' }
  ];

  // Opciones de horas (cada hora) para dropdown editable
  timeOptions = Array.from({ length: 24 }).map((_, i) => {
    const hh = String(i).padStart(2, '0');
    return { label: `${hh}:00`, value: `${hh}:00` };
  });

  horasSuenoOptions = Array.from({ length: 14 }).map((_, i) => {
    const hh = String(i).padStart(2, '0');
    return { label: `${hh} hrs`, value: `${hh} hrs` };
  });

  saveGoals() {
    this.submittedGoals = true;

    this.formErrorsGoals.set({});
    let currentErrors: { [key: string]: string } = {};

    if (!this.goals.motivo_consulta) { // Esto cubre undefined, null o una cadena vacía ''
      currentErrors['motivoConsulta'] = 'El motivo de la consulta es trequierido.';
    }

    this.formErrorsGoals.set(currentErrors);
    if (Object.keys(currentErrors).length > 0) {
      console.warn("Formulario con errores de validación:", currentErrors);
      return;
    }

    let formGoals: Goals = {
      client_id: this.clientId ?? this.goals.client_id,
      motivo_consulta: this.goals.motivo_consulta,
      obje_esperado: this.goals.obje_esperado,
      tabaco: this.goals.tabaco,
      alcohol: this.goals.alcohol,
      hora_dormir: this.goals.hora_dormir,
      hora_despertar: this.goals.hora_despertar,
      horas_sueno: this.goals.horas_sueno,
      info_adicional: this.goals.info_adicional
    };

    console.log("Formulario a enviar: jejejeje ", formGoals);

    /* aqui mandar a crear o actualizar */
    this.goalService.updateGoals(formGoals).subscribe({
      next: (response) => {
        console.log('response de updateGoals:', response);

        if (response.status === 200) {
          console.log('Cliente actualizado con éxito');
          this.messageService.add({
            severity: 'success', // Tipo de toast: 'success', 'info', 'warn', 'error'
            summary: 'Éxito',
            detail: 'Operación completada correctamente.'
          });
        } else if (response.status === 201) {
          this.messageService.add({
            severity: 'success', // Tipo de toast: 'success', 'info', 'warn', 'error'
            summary: 'Éxito',
            detail: 'Operación actualizada correctamente.'
          });

        }
        this.submittedGoals = false;
      },
      error: (error: any) => {

        this.messageService.add({
          severity: 'error', // Tipo de toast: 'success', 'info', 'warn', 'error'
          summary: 'Error',
          detail: 'Ocurrió un error al momento de actualizar un cliente'
        });

        console.error('Error al crear cliente:', error);
        this.formErrorsGoals.update((errors: any) => ({ ...errors, apiError: 'Error al guardar el cliente. Inténtalo de nuevo.' }));
      }
    });

  }

  ngOnInit(): void {
    // Intentar leer el parámetro 'id' de la URL (ruta configurada como /.../:id)
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    if (idFromRoute) {
      this.clientId = idFromRoute;
      // también inicializar en goals para que se use al guardar
      this.goals.client_id = String(idFromRoute);
      this.cargaInicial(idFromRoute);
    }
  }

  cargaInicial(idPaciente: string) {
    this.goalService.getGoalsById(idPaciente).subscribe(((infoPaciente: Goals) => {

      this.goals = {
        client_id: infoPaciente.client_id,
        motivo_consulta: infoPaciente.motivo_consulta,
        obje_esperado: infoPaciente.obje_esperado,
        tabaco: infoPaciente.tabaco,
        alcohol: infoPaciente.alcohol,
        hora_dormir: infoPaciente.hora_dormir,
        hora_despertar: infoPaciente.hora_despertar,
        horas_sueno: infoPaciente.horas_sueno,
        info_adicional: infoPaciente.info_adicional
      };

      console.log("Cliente recuperado ", infoPaciente);
      console.log(" this.goals ",  this.goals);


      /* this.infoPaciente.set(infoPaciente);
      this.cargandoClient.set(true); */


    }));
  }
}
