import { Component, inject } from '@angular/core';

//primegn
import { MessageService, SelectItem } from 'primeng/api';
import { LayoutService } from '../../../layout/service/app.layout.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DataView } from 'primeng/dataview';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

import { ProductService } from '../../service/product.service';
import { Product } from '../../api/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoAlimentosComponent } from "../carrito-alimentos/carrito-alimentos.component";
import { CarritoAlimentosService } from '../../service/carrito-alimentos.service';
import { Alimento } from '../../api/alimento';
import { AlimentosService } from '../../service/alimentos.service';


@Component({
  selector: 'app-porcion-alimentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, ToastModule, DataViewModule, DropdownModule, InputTextModule, CarritoAlimentosComponent],
  templateUrl: './porcion-alimentos.component.html',
  styleUrl: './porcion-alimentos.component.css',
  providers:[MessageService]
})
export class PorcionAlimentosComponent {
  private messageService= inject(MessageService);
  private carritoAlimentosService= inject(CarritoAlimentosService);
  private alimentosService= inject(AlimentosService);
  public layoutService= inject(LayoutService);

  alimentos: Alimento[] = [];
  sortOptions: SelectItem[] = [];
  sortOrder: number = 0;
  sortField: string = '';

  constructor() { }
  

  ngOnInit(): void {
    
    this.changeTheme('arya-green', 'dark');
    this.cargaInicial();

    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' }
    ];
    
  }

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

  cargaInicial(): void {
      this.alimentosService.getAlimentos().subscribe(((alimentos: any) => {
        
        this.alimentos = alimentos.data;
        console.log("alimentos ", this.alimentos);
       }));
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

    onSortChange(event: any) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
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

  addProductToCart(alimento: Alimento) {
    this.carritoAlimentosService.addToCart(alimento);
    console.log(`Añadido al carrito: ${alimento.name}`);
  }

}
