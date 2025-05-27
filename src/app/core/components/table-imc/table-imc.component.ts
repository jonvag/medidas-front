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
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../layout/service/app.layout.service';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';

import { Client } from '../../api/client';
import { UsuariosService } from '../../service/usuarios.service';

interface expandedRows {
    [key: string]: boolean;
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
    RadioButtonModule],
  templateUrl: './table-imc.component.html',
  styleUrl: './table-imc.component.css'
})
export class TableImcComponent {

    private usuariosService= inject(UsuariosService);

    public layoutService= inject(LayoutService);

    clients = signal<any>("");




    productDialog: boolean = false;
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
    sexo: "",
    age: 0,
    peso: 0,
    estatura: 0,
    cc: "0"};

    rowGroupMetadata: any;

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    idFrozen: boolean = false;

    loading: boolean = true;

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
    this.usuariosService.getClient().subscribe(((clientsService: any) => {
      if (clientsService.error) {
        
        console.log("No se actualizo la clientsService, debe solicitar otro token ");
        console.log("clientsService ", clientsService);
      }

      clientsService.forEach((person: Client) => {
            person.imc= this.functionIMC(person.name, person.peso, person.estatura);
            person.tipo= this.tipoIMC(person.name, person.age, this.functionIMC(person.name, person.peso, person.estatura), person.sexo);
          });
          
      this.clients.set(clientsService);

      console.log("data signal ", this.clients());

     }));
  }
    
    openNew() {
        this.submitted = false;
        this.productDialog = true;
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveClient() {
        this.submitted = true;

        let data:Client= {
            name: this.client.name,
            sexo: this.client.sexo,
            age: this.client.age,
            peso: this.client.peso,
            estatura: this.client.estatura
        };

        console.log("crear client" , data );
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
    const percentiles:any = {
      '17-24': { bajoPesoII: 16.5, bajoPesoI: 17.8, adecuado: 26.3, sobrepesoI: 34.5, sobrepesoII: 100 },
      '25-29': { bajoPesoII: 16.8, bajoPesoI: 18.3, adecuado: 27.2, sobrepesoI: 35.0, sobrepesoII: 100 },
      '30-59': { bajoPesoII: 17.8, bajoPesoI: 19.6, adecuado: 30, sobrepesoI:38.2, sobrepesoII: 100 },
      '60-79': { bajoPesoII: 17.7, bajoPesoI: 19.9, adecuado: 32.3, sobrepesoI: 41.5, sobrepesoII: 100 },
      '80+': { bajoPesoII: 15.1, bajoPesoI: 17.3, adecuado: 29.83, sobrepesoI: 39.2, sobrepesoII: 100 }
    };

    // Determinar grupo de edad
    let grupo;
    if (edad >= 17 && edad <= 24) grupo = '17-24';
    else if (edad >= 25 && edad <= 29) grupo = '25-29';
    else if (edad >= 30 && edad <= 59) grupo = '30-59';
    else if (edad >= 60 && edad <= 79) grupo = '60-79';
    else if (edad >= 80) grupo = '80+';
    else return 'Edad no válida';

    const p = percentiles[grupo];

    // Clasificar IMC
    if (imc < p.bajoPesoII) return 'Bajo peso II';
    if (imc < p.bajoPesoI) return 'Bajo peso I';
    if (imc < p.adecuado) return 'Adecuado';
    if (imc < p.sobrepesoI) return 'Sobrepeso I';
    if (imc < p.sobrepesoII) return 'Sobrepeso II';
    return 'Obesidad'; // Para valores superiores al percentil 95
    }

    esHombre(edad: number, imc: number): string {
    // Percentiles para hombres (según tabla adjunta)
    const percentiles:any = {
      '17-24': { bajoPesoII: 16.8, bajoPesoI: 18.3, adecuado: 26.8, sobrepesoI: 33.7, sobrepesoII: 100 },
      '25-29': { bajoPesoII: 17.9, bajoPesoI: 19.6, adecuado: 28.8, sobrepesoI: 35.6, sobrepesoII: 100 },
      '30-59': { bajoPesoII: 18.6, bajoPesoI: 20.5, adecuado: 30.5, sobrepesoI: 37.9, sobrepesoII: 100 },
      '60-79': { bajoPesoII: 16.7, bajoPesoI: 18.5, adecuado: 28.2, sobrepesoI: 35.4, sobrepesoII: 100 },
      '80+': { bajoPesoII: 15.4, bajoPesoI: 17.2, adecuado: 26.6, sobrepesoI: 33.3, sobrepesoII: 21.3 }
    };

    // Determinar grupo de edad
    let grupo;
    if (edad >= 17 && edad <= 24) grupo = '17-24';
    else if (edad >= 25 && edad <= 29) grupo = '25-29';
    else if (edad >= 30 && edad <= 59) grupo = '30-59';
    else if (edad >= 60 && edad <= 79) grupo = '60-79';
    else if (edad >= 80) grupo = '80+';
    else return 'Edad no válida';

    const p = percentiles[grupo];

    // Clasificación según IMC
    if (imc < p.bajoPesoII) return 'Bajo peso II';
    if (imc < p.bajoPesoI) return 'Bajo peso I';
    if (imc < p.adecuado) return 'Adecuado';
    if (imc < p.sobrepesoI) return 'Sobrepeso I';
    if (imc < p.sobrepesoII) return 'Sobrepeso II';
    return 'Obesidad'; // Para IMC ≥ percentil 95
  }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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

}
