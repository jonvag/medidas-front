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
import { CustomerService } from '../../service/customer.service';
import { Customer, Representative } from '../../api/customer';
import { Product } from '../../api/product';
import { Table } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../layout/service/app.layout.service';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';

import { Client } from '../../api/client';
import { UsuariosService } from '../../service/usuarios.service';
import { Router } from '@angular/router';

interface expandedRows {
    [key: string]: boolean;
}

interface ImcCategoryValues {
  bajoPesoII: number;
  bajoPesoI: number;
  adecuadoP15: number;
  adecuadoP25: number;
  adecuadoP50: number;
  adecuadoP75: number;
  sobrepesoIP85: number;
  sobrepesoIP90: number;
  sobrepesoII: number;
}

/**
 * Define la estructura principal para los datos de IMC,
 * donde las claves son rangos de edad (cadenas de texto como '17-24')
 * y los valores son objetos que contienen los umbrales de las categorías de IMC.
 *
 * Utiliza un "índice de firma" para permitir claves de cadena dinámicas.
 */
interface ImcDataByAgeRange {
  [ageRange: string]: ImcCategoryValues;
}

@Component({
  selector: 'app-table-imc',
  standalone: true,
  imports: [		
    CommonModule, 
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
    ConfirmDialogModule],
  templateUrl: './table-imc.component.html',
  styleUrl: './table-imc.component.css',
  providers: [ConfirmationService, MessageService]
})
export class TableImcComponent {

    private usuariosService= inject(UsuariosService);

    public layoutService= inject(LayoutService);

    private confirmationService= inject(ConfirmationService);
    private messageService= inject(MessageService);

    private router = inject(Router); // <-- ¡Inyecta Router aquí!

    clients = signal<any>("");
    formErrors= signal<any>("");

    createClientDialog: boolean = false;
    submitted: boolean = false;
    deleteProductsDialog:boolean = false;

    customers3: Customer[] = [];

    selectedCustomers1: Customer[] = [];

    representatives: Representative[] = [];

    statuses: any[] = [];

    products: Product[] = [];

    client:Client = {
    id: 0,
    name: "" ,
    email: "" ,
    sexo: "",
    age: 0,
    peso: 0,
    estatura: 0,
    circunferencia: "0"};

    rowGroupMetadata: any;

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    idFrozen: boolean = false;

    loading: boolean = true;
    dialogHeader: string = "Agregar Cliente";
    indicAgregarOrUpdate:boolean = true;

    @ViewChild('filter') filter!: ElementRef;

    constructor(private customerService: CustomerService) { }

    ngOnInit() {

      this.cargaInicial();
    
      this.changeTheme('arya-green', 'dark');

        this.customerService.getCustomersLarge().then(customers => 
        {
          customers.forEach(person => {
            person.imc= this.functionIMC(person.name, person.peso, person.estatura);
            person.tipo= this.tipoIMC(person.name, person.age, this.functionIMC(person.name, person.peso, person.estatura), person.sexo);
          });
          this.customers3 = customers;
          this.loading=false;
        }
        );
    }

    cargaInicial(): void {
    this.usuariosService.getClientsById(2).subscribe(((clientsService: any) => {
      if (clientsService.error) {
        
        console.log("No se actualizo la clientsService, debe solicitar otro token ");
        console.log("clientsService ", clientsService);
      }

      clientsService.forEach((person: Client) => {
            person.imc= this.functionIMC(person.name, person.peso, person.estatura);
            person.tipo= this.tipoIMC(person.name, person.age, this.functionIMC(person.name, person.peso, person.estatura), person.sexo);
          });
          
      this.clients.set(clientsService);

     }));
  }
    
    openNew(user:Client | number ) {
      this.resetForm();
        if (typeof user === 'number') {
            //console.log("Crear Cliente");
            this.indicAgregarOrUpdate= true;
        } else if (typeof user === 'object' && user !== null && 'id' in user && 'name' in user) {
            this.indicAgregarOrUpdate = false;
            this.dialogHeader = "Actualizar Cliente";
            
            console.log("Modo: Editar cliente:", user.name);
            this.client = {
                id: user.id,
                name: user.name,
                email: user.email || '', // Asegura un valor por defecto si es undefined/null
                sexo: user.sexo || '',
                age: user.age || 0,
                peso: user.peso || 0,
                estatura: user.estatura || 0,
                circunferencia: user.circunferencia || '',
                address: user.address || '',
                user_id: user.user_id || 0,
                status: user.status || 'active'
            };
        // Puedes asignar otros campos si no están en tu interfaz Client, pero son parte del objeto 'user'
        } else {
        // Caso 4: Tipo de dato inesperado
        console.warn("openNew recibió un tipo de dato inesperado:", user);
        // Puedes lanzar un error o simplemente usar los valores por defecto
        }
        this.submitted = false;
        this.createClientDialog = true;
    }

    hideDialog() {
        this.createClientDialog = false;
        this.submitted = false;
    }

    saveClient() {
        this.submitted = true;

        this.formErrors.set({});
        let currentErrors: { [key: string]: string } = {};

        if (!this.client.sexo) { // Esto cubre undefined, null o una cadena vacía ''
        currentErrors['sexo'] = 'El sexo es requerido.';
        }

        if (!this.client.email) { // Primero verifica si está vacío o nulo
            currentErrors['email'] = 'El email es requerido.';
        } else { // Si tiene un valor, entonces procede a validar el formato
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.client.email)) {
                currentErrors['email'] = 'El formato del email no es válido.';
            }
        }

        this.formErrors.set(currentErrors);
        if (Object.keys(currentErrors).length > 0) {
        console.warn("Formulario con errores de validación:", currentErrors);
        return;
        }

        let form:Client= {
            name: this.client.name,
            client_id: this.client.id,
            user_id: 2,
            email: this.client.email,
            sexo: this.client.sexo,
            age: this.client.age,
            peso: this.client.peso,
            estatura: this.client.estatura,
            circunferencia: this.client.circunferencia,
            status: this.client.status,
            address: this.client.address
        };

        /* aqui mandar a crear o actualizar */

        if (this.indicAgregarOrUpdate === true ) {
          this.usuariosService.postClientById(form).subscribe({
            next: (response) => {
              if (response.status === 200) {
                 
                this.resetForm(); 
                this.hideDialog();
                this.cargaInicial();
                this.messageService.add({
                  severity: 'success', // Tipo de toast: 'success', 'info', 'warn', 'error'
                  summary: 'Éxito',
                  detail: 'Operación completada correctamente.' 
                });  
              } else if (response.status === 201){

                this.messageService.add({
                  severity: 'error', // Tipo de toast: 'success', 'info', 'warn', 'error'
                  summary: 'Error',
                  detail: 'Correo ya existe en la BD' 
                });  
                
              }
                
            },
            error: (error) => {
              this.messageService.add({
                  severity: 'error', // Tipo de toast: 'success', 'info', 'warn', 'error'
                  summary: 'Error',
                  detail: 'Ocurrió un error al momento de crear un cliente' 
                });  

                console.error('Error al crear cliente:', error);
                this.formErrors.update(errors => ({ ...errors, apiError: 'Error al guardar el cliente. Inténtalo de nuevo.' }));
            }
          });
        } else {
          this.usuariosService.updateClient(form).subscribe({
            next: (response) => {
              if (response.status === 200) {
                console.log('Cliente actualizado con éxito');
                this.resetForm(); 
                this.hideDialog();
                this.cargaInicial();
                this.messageService.add({
                  severity: 'success', // Tipo de toast: 'success', 'info', 'warn', 'error'
                  summary: 'Éxito',
                  detail: 'Operación completada correctamente.' 
                });  
              } else if (response.status === 201){
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
        }

        this.submitted = false;
    }

    onSort() {
        this.updateRowGroupMetaData();
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};

        if (this.customers3) {
            for (let i = 0; i < this.customers3.length; i++) {
                const rowData = this.customers3[i];
                const representativeName = rowData?.representative?.name || '';

                if (i === 0) {
                    this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
                }
                else {
                    const previousRowData = this.customers3[i - 1];
                    const previousRowGroup = previousRowData?.representative?.name;
                    if (representativeName === previousRowGroup) {
                        this.rowGroupMetadata[representativeName].size++;
                    }
                    else {
                        this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
                    }
                }
            }
        }
    }
    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    expandAll() {
        if (!this.isExpanded) {
            this.products.forEach(product => product && product.name ? this.expandedRows[product.name] = true : '');

        } else {
            this.expandedRows = {};
        }
        this.isExpanded = !this.isExpanded;
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    functionIMC(name:string, peso: number, altura: number) {
      const imc = peso / (altura * altura);
     
      return imc;
    }

    tipoIMC(name:string, edad: number, imc: number, sexo:string) {

      return sexo === 'F' ? this.esMujer(edad, imc) : this.esHombre(edad, imc);
    }

    esMujer(edad: number, imc: number): string {
      // Definición de percentiles según edad (tabla proporcionada)
      const percentiles:ImcDataByAgeRange = {
        '17-24': { bajoPesoII: 16.5, bajoPesoI: 17.8, adecuadoP15:  19.4, adecuadoP25: 21.2, adecuadoP50: 23.5, adecuadoP75: 26.3, sobrepesoIP85: 29.9, sobrepesoIP90: 34.5, sobrepesoII: 100 },
        '25-29': { bajoPesoII: 16.8, bajoPesoI: 18.3, adecuadoP15:  20.0, adecuadoP25: 21.9, adecuadoP50: 24.3, adecuadoP75: 27.2, sobrepesoIP85: 30.7, sobrepesoIP90: 35.0, sobrepesoII: 100 },
        '30-59': { bajoPesoII: 17.8, bajoPesoI: 19.6, adecuadoP15:  21.7, adecuadoP25: 24.0, adecuadoP50: 26.8, adecuadoP75: 30.0, sobrepesoIP85: 33.7, sobrepesoIP90: 38.2, sobrepesoII: 100 },
        '60-79': { bajoPesoII: 17.7, bajoPesoI: 19.9, adecuadoP15:  22.4, adecuadoP25: 25.3, adecuadoP50: 28.5, adecuadoP75: 32.3, sobrepesoIP85: 33.6, sobrepesoIP90: 41.5, sobrepesoII: 100 },
        '80+':   { bajoPesoII: 15.1, bajoPesoI: 17.3, adecuadoP15:  19.8, adecuadoP25: 22.7, adecuadoP50: 26.0, adecuadoP75: 29.8, sobrepesoIP85: 34.2, sobrepesoIP90: 39.2, sobrepesoII: 100 }
      };

       return this.resultPercentil(edad, imc, percentiles);
    }

    esHombre(edad: number, imc: number): string {
      // Percentiles para hombres (según tabla adjunta)
      const percentiles:ImcDataByAgeRange = {
        '17-24': { bajoPesoII: 16.8, bajoPesoI: 18.3, adecuadoP15: 20.0, adecuadoP25: 21.9, adecuadoP50: 24.2, adecuadoP75: 26.8, sobrepesoIP85: 30.0, sobrepesoIP90: 33.7, sobrepesoII: 100 },
        '25-29': { bajoPesoII: 17.9, bajoPesoI: 19.6, adecuadoP15: 21.5, adecuadoP25: 23.6, adecuadoP50: 26.0, adecuadoP75: 28.8, sobrepesoIP85: 32.0, sobrepesoIP90: 35.6, sobrepesoII: 100 },
        '30-59': { bajoPesoII: 18.6, bajoPesoI: 20.5, adecuadoP15: 22.5, adecuadoP25: 24.8, adecuadoP50: 27.5, adecuadoP75: 30.5, sobrepesoIP85: 33.3, sobrepesoIP90: 37.9, sobrepesoII: 100 },
        '60-79': { bajoPesoII: 16.7, bajoPesoI: 18.5, adecuadoP15: 20.5, adecuadoP25: 22.7, adecuadoP50: 25.3, adecuadoP75: 28.2, sobrepesoIP85: 31.6, sobrepesoIP90: 35.4, sobrepesoII: 100 },
        '80+':   { bajoPesoII: 15.4, bajoPesoI: 17.2, adecuadoP15: 19.1, adecuadoP25: 21.3, adecuadoP50: 23.8, adecuadoP75: 26.6, sobrepesoIP85: 29.8, sobrepesoIP90: 33.3, sobrepesoII: 100 }
      };

    return this.resultPercentil(edad, imc, percentiles);
  }

  resultPercentil(edad:number, imc: number, percentiles:ImcDataByAgeRange):string{
    // Determinar grupo de edad
    let grupo;
    if (edad >= 17 && edad <= 24) grupo = '17-24';
    else if (edad >= 25 && edad <= 29) grupo = '25-29';
    else if (edad >= 30 && edad <= 59) grupo = '30-59';
    else if (edad >= 60 && edad <= 79) grupo = '60-79';
    else if (edad >= 80) grupo = '80+';
    else return 'Edad no válida';

    const p = percentiles[grupo];

    if (imc < p.bajoPesoII) return 'Bajo peso II P5';
    if (imc < p.bajoPesoI) return 'Bajo peso I P10';
    if (imc < p.adecuadoP15) return 'Adecuado P15';
    if (imc < p.adecuadoP25) return 'Adecuado P25';
    if (imc < p.adecuadoP50) return 'Adecuado P50';
    if (imc < p.adecuadoP75) return 'Adecuado P75';
    if (imc < p.sobrepesoIP85) return 'Sobrepeso I P85';
    if (imc < p.sobrepesoIP90) return 'Sobrepeso I P90';
    if (imc < p.sobrepesoII) return 'Sobrepeso II P95';
    return 'Obesidad'; // Para valores superiores al percentil 95
  }

  clear(table: Table) {
      table.clear();
      this.filter.nativeElement.value = '';
  }

  tofixe(imc:number){
    return imc.toFixed(2);
  }

    //colocar esto en un servicio
  changeTheme(theme: string, colorScheme: string) {
      const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
      const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);
      console.log("tema ", theme, "color ", colorScheme);
      this.layoutService.config.colorScheme
      this.replaceThemeLink(newHref, () => {
          this.layoutService.config.theme = theme;
          this.layoutService.config.colorScheme = colorScheme;
          this.layoutService.onConfigUpdate();
      });
  }

  replaceThemeLink(href: string, onComplete: Function) {
    const id = 'theme-css';
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);
    cloneLinkElement.setAttribute('href', href);
    cloneLinkElement.setAttribute('id', id + '-clone');
    themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);
    cloneLinkElement.addEventListener('load', () => {
        themeLink.remove();
        cloneLinkElement.setAttribute('id', id);
        onComplete();
    });
  }

  resetForm() {
    this.client = {
        id: 0,
        name: "" ,
        email: "" ,
        sexo: "",
        age: 0,
        peso: 0,
        estatura: 0,
        circunferencia: "0"
    };
    this.formErrors.set({});
  }

  confirmDeleteClient(clientId: number, clientName: string) {
    this.confirmationService.confirm({
      key: 'confirm1', // Asegúrate de que este 'key' coincida con el 'key' de tu p-confirmDialog en el HTML
      message: `¿Desea eliminar a ${clientName} de sus clientes? Esta acción es irreversible.`,
      header: 'Confirmar Eliminación', 
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar', 
      rejectLabel: 'No, Cancelar', 

      
      accept: () => {
        // si confirmó el dialog
        this.usuariosService.deleteClient(clientId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: `${clientName} ha sido eliminado exitosamente.`
            });
            
            this.clients.update(currentClients => currentClients.filter((c: { id: number; }) => c.id !== clientId));
          },
          error: (err) => {
            console.error('Error al eliminar cliente:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `No se pudo eliminar a ${clientName}. Inténtalo de nuevo.`
            });
          }
        });
      },

      // --- CALLBACK PARA CUANDO EL USUARIO HAGA CLIC EN 'NO' O CIERRE EL DIÁLOGO ---
      reject: () => {
        //console.log('El usuario ha cancelado la eliminación.');
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'La eliminación ha sido cancelada.'
        });
      }
    });
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success', // Tipo de toast: 'success', 'info', 'warn', 'error'
      summary: 'Éxito',    // Título del toast
      detail: 'Operación completada correctamente.' // Contenido del toast
    });
  }

  showInfo() {
    this.messageService.add({
      severity: 'info',
      summary: 'Información',
      detail: 'Aquí hay un mensaje informativo.'
    });
  }

  showWarning() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'Algo salió mal, pero no es crítico.'
    });
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Hubo un problema al procesar su solicitud.'
    });
  }

  // Puedes mostrar múltiples mensajes a la vez
  showMultiple() {
    this.messageService.addAll([
      { severity: 'success', summary: 'Mensaje 1', detail: 'Primer mensaje exitoso' },
      { severity: 'info', summary: 'Mensaje 2', detail: 'Segundo mensaje informativo' },
      { severity: 'warn', summary: 'Mensaje 3', detail: 'Tercer mensaje de advertencia' }
    ]);
  }

  // Limpiar todos los mensajes
  clearMessages() {
    this.messageService.clear();
  }

  onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}
