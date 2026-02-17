import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../service/customer.service';
import { Customer, Representative } from '../../../api/customer';
import { Product } from '../../../api/product';
import { Table } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AppConfig, LayoutService } from '../../../../layout/service/app.layout.service';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';

import { Client } from '../../../api/client';
import { PlansService } from '../../../service/plans.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User, UserLogin } from '../../../api/user';
import { TitleCasePipe } from "../../../pipes/title-case.pipe";
import { CalendarModule } from "primeng/calendar";
import { Plan } from '../../../api/plan';

@Component({
  selector: 'app-plan-paciente',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    TableModule,
    RatingModule,
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
    TitleCasePipe,
    CalendarModule],
  templateUrl: './plan-paciente.component.html',
  styleUrl: './plan-paciente.component.css',
  providers: [MessageService]
})
export class PlanPacienteComponent {
  public layoutService = inject(LayoutService);

  userLoggeado: User = {
    name: "",
    lastname: "",
    email: "",
    password1: ""
  };

  private plansService = inject(PlansService);
  formErrors = signal<any>("");
  dialogHeader: string = "Agregar Paciente";
  indicAgregarOrUpdate: boolean = true;


  plans = signal<any>("");
  loading: boolean = true;
  public router = inject(Router);
  private messageService = inject(MessageService);
  currentTheme: string = '';
  currentColorScheme: string = '';
  private configSubscription!: Subscription;
  submitted: boolean = false;
  createClientDialog: boolean = false;


  plan: Plan = {
    lacteos: "",
    vegetales: "",
    frutas: "",
    almidones: "",
    carnes_magra: "",
    carnes_semi: "",
    carnes_grasa: "",
    grasas: "0"
  };

  @ViewChild('filter') filter!: ElementRef;

  constructor(private customerService: CustomerService,) { }

  ngOnInit() {

    // 1. Obtener el tema inicial al cargar el componente
    this.currentTheme = this.layoutService.config.theme;
    this.currentColorScheme = this.layoutService.config.colorScheme;
    console.log(`[NuevoComponente] Tema inicial: ${this.currentTheme}, Esquema de color inicial: ${this.currentColorScheme}`);

    // 2. Suscribirse a los cambios en la configuración del tema
    // Esto es importante si el tema puede cambiar MIENTRAS este componente está activo.
    this.configSubscription = this.layoutService.configUpdate$.subscribe((config: AppConfig) => {
      this.currentTheme = config.theme;
      this.currentColorScheme = config.colorScheme;
      console.log(`[NuevoComponente] Tema actualizado: ${this.currentTheme}, Esquema de color actualizado: ${this.currentColorScheme}`);
      // Aquí puedes realizar cualquier lógica adicional si el tema cambia
      // Por ejemplo, ajustar estilos internos o lógica de UI.
    });

    this.cargaInicial();

  }

  cargaInicial(): void {
    const infoUser = localStorage.getItem("loginUser");
    if (infoUser) {
      this.userLoggeado = JSON.parse(infoUser) as User;

      this.plansService.getPlansClients(this.userLoggeado.id!).subscribe(((plansService: any) => {
        console.log("plansService ", plansService);
        console.log(" uni solo");
        console.log("plansService ", plansService[0].agente_asociado.codigo);
        if (plansService.error) {

          console.log("No se actualizo la plansService, debe solicitar otro token ");
          console.log("plansService ", plansService);
        }

        this.loading = false;
        this.plans.set(plansService);
        console.log("this.plans this.plans ", this.plans());
      }));
    }

  }

  openNew(plan: Plan, codigo: string) {
    this.resetForm();

    this.indicAgregarOrUpdate = false;
    this.dialogHeader = "Actualizar Plan del Paciente";

    this.plan = {
      id: plan.id,
      codigo: codigo,
      client_id: plan.client_id,
      lacteos: plan.lacteos,
      vegetales: plan.vegetales,
      frutas: plan.frutas,
      almidones: plan.almidones,
      carnes_magra: plan.carnes_magra,
      carnes_semi: plan.carnes_semi,
      carnes_grasa: plan.carnes_grasa,
      grasas: plan.grasas
    };

    console.log("Formulario de plan poblado con:", this.plan);
    this.submitted = false; 
    this.createClientDialog = true; 
  }

  hideDialog() {
    this.createClientDialog = false;
    this.submitted = false;
  }

  saveClientPlan() {
    this.submitted = true;

    this.formErrors.set({});
    let currentErrors: { [key: string]: string } = {};

    if (!this.plan.almidones) { // Esto cubre undefined, null o una cadena vacía ''
      currentErrors['almidones'] = 'Los almidones son requeridos.';
    }

    this.formErrors.set(currentErrors);
    if (Object.keys(currentErrors).length > 0) {
      console.warn("Formulario con errores de validación:", currentErrors);
      return;
    }

    let form: Plan = {
      id: this.plan.id,
      client_id: this.plan.client_id,
      lacteos: this.plan.lacteos,
      vegetales: this.plan.vegetales,
      frutas: this.plan.frutas,
      almidones: this.plan.almidones,
      carnes_magra: this.plan.carnes_magra,
      carnes_semi: this.plan.carnes_semi,
      carnes_grasa: this.plan.carnes_grasa,
      grasas: this.plan.grasas
    };

    console.log("Formulario a enviar:", form);


    /* aqui mandar a crear o actualizar */


    this.plansService.putClientPlan(form).subscribe({
      next: (response) => {
        if (response.status === 201) {
          this.resetForm();
          this.hideDialog();
          this.cargaInicial();
          this.messageService.add({
            severity: 'success', // Tipo de toast: 'success', 'info', 'warn', 'error'
            summary: 'Éxito',
            detail: 'Operación completada correctamente.'
          });
        } else if (response.status === 201) {
          this.messageService.add({
            severity: 'error', // Tipo de toast: 'success', 'info', 'warn', 'error'
            summary: 'Error',
            detail: 'Id no existe en la BD'
          });

        }

      },
      error: (error) => {

        this.messageService.add({
          severity: 'error', // Tipo de toast: 'success', 'info', 'warn', 'error'
          summary: 'Error',
          detail: 'Ocurrió un error al momento de actualizar un cliente'
        });

        console.error('Error al crear cliente:', error);
        this.formErrors.update(errors => ({ ...errors, apiError: 'Error al guardar el cliente. Inténtalo de nuevo.' }));
      }
    });

    this.submitted = false;
  }

  resetForm() {
    this.plan = {
      codigo: "",
      lacteos: "0",
      vegetales: "",
      frutas: "",
      almidones: "",
      carnes_magra: "",
      carnes_semi: "",
      carnes_grasa: "",
      grasas: "0"
    };
    this.formErrors.set({});
  }

  suma(lacteos: string, vegetales: string, frutas: string, almidones: string, carnes_magra: string, carnes_semi: string, carnes_grasa: string, grasas: string): number {

    return parseInt(lacteos) + parseInt(vegetales) + parseInt(frutas) + parseInt(almidones) + parseInt(carnes_magra) + parseInt(carnes_semi) + parseInt(carnes_grasa) + parseInt(grasas);

  }

}
