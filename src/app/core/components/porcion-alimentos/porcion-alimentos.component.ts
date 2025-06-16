import { Component, inject, ViewChild } from '@angular/core';

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
  providers: [MessageService]
})
export class PorcionAlimentosComponent {
  private messageService = inject(MessageService);
  private carritoAlimentosService = inject(CarritoAlimentosService);
  private alimentosService = inject(AlimentosService);
  public layoutService = inject(LayoutService);

  alimentos: Alimento[] = [];
  sortOptions: SelectItem[] = [];
  sortOrder: number = 0;
  sortField: string = '';

  @ViewChild('dv') dv!: DataView; // Referencia al p-dataView en el HTML

  // --- Nuevas propiedades para el filtro de categoría ---
  categoryOptions: SelectItem[] = []; // Opciones para el desplegable de categorías
  selectedCategory: string | null = null; // Almacena la categoría seleccionada
  // ----------------------------------------------------

  constructor() { }


  ngOnInit(): void {
    this.categoryOptions = [
      { label: 'Todas las categorias', value: null },
      { label: 'Hostaliza y Vegetales', value: 'Hostaliza y Vegetales' },
      { label: 'Frutas', value: 'Frutas' },
      { label: 'Leche y Sustitutos', value: 'Leche y Sustitutos' },
      { label: 'Almidones, Cereales y Panes', value: 'Almidones, Cereales y Panes' },
      { label: 'Carnes y Sustitutos', value: 'Carnes y Sustitutos' },
      { label: 'Grasas', value: 'Grasas' },
    ];

    this.cargaInicial();

    this.sortOptions = [
      { label: 'Nombre (Ascendente)', value: 'name' },
      { label: 'Nombre (Descendente)', value: '!name' },
      { label: 'Categoría (Ascendente)', value: 'category' },
      { label: 'Categoría (Descendente)', value: '!category' },
      { label: 'Subcategoría (Ascendente)', value: 'subCategory' },
      { label: 'Subcategoría (Descendente)', value: '!subCategory' },
      // Puedes añadir más opciones si quieres ordenar por gramos, etc.
    ];

  }

  cargaInicial(): void {
    this.alimentosService.getAlimentos().subscribe(((alimentos: any) => {

      this.alimentos = alimentos.data;
      console.log("alimentos ", this.alimentos);
    }));
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

  loadCategoryOptions() {
    if (this.alimentos && this.alimentos.length > 0) {
      // Extrae todas las categorías únicas de tus alimentos
      const uniqueCategories = [...new Set(this.alimentos.map(item => item.category))];

      // Crea las opciones para el dropdown
      this.categoryOptions = [
        { label: 'Todas las Categorías', value: null }, // Opción para mostrar todos los alimentos
        ...uniqueCategories.map(cat => ({ label: cat, value: cat }))
      ];
    }
  }

  onCategoryFilterChange(event: any) {
    const selectedValue = event.value; // El valor de la categoría seleccionada

    if (selectedValue) {
      // PrimeNG aplicará este filtro al campo 'category' porque lo especificaste en filterBy
      this.dv.filter(selectedValue);
    } else {
      // Si se selecciona 'Todas las Categorías', limpia el filtro global
      this.dv.filter('');
    }
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
