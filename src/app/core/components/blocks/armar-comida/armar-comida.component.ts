import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ArmarComidaService } from '../../../service/armar-comida.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-armar-comida',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, DropdownModule],
  templateUrl: './armar-comida.component.html',
  styleUrl: './armar-comida.component.css',
  providers: [MessageService]
})
export class ArmarComidaComponent {

  selectedTipo: any = null;
  submitted: boolean = false;
  loadingArmarComida: boolean = false;
  formErrors = signal<any>({});
  private armarComida = inject(ArmarComidaService);
  private messageService = inject(MessageService);
  private sanitizer = inject(DomSanitizer);

  public resultadoComida: SafeHtml | null = null;

  clientComida: any = {
    tipo: '0',
    porciones: "",
  };

  dropdownItems = [
    { tipo: 'Desayuno', code: 'Desayuno' },
    { tipo: 'Merienda Am', code: 'Merienda Am' },
    { tipo: 'Almuerzo', code: 'Almuerzo' },
    { tipo: 'Merienda Pm', code: 'Merienda Pm' },
    { tipo: 'Cena', code: 'Cena' }
  ];

  consultarComida() {
    this.submitted = true;

    this.formErrors.set({});
    let currentErrors: { [key: string]: string } = {};


    this.formErrors.set(currentErrors);
    if (Object.keys(currentErrors).length > 0) {
      console.warn("Formulario con errores de validación:", currentErrors);
      return;
    }

    let form: any = {
      tipo: this.selectedTipo,
      porciones: this.clientComida.porciones
    };

    if (!form.tipo) {
      currentErrors['tipo'] = 'El  tipo de  comida es requerida.';
    }
    if (!form.porciones) {
      currentErrors['porciones'] = 'Las porciones son requeridas.';
    }
    this.loadingArmarComida = true;

    this.armarComida.armarComida(form).subscribe({
      next: (response) => {
        this.loadingArmarComida = false;
        console.log("Respuesta del servidor:", response);
        // Sanitizar y mostrar el mensaje del backend
        const mensaje = response[0].output || response;

        // Usar marked.parse como promesa para soportar versiones modernas
        Promise.resolve(marked.parse(mensaje)).then((html: string) => {
          this.resultadoComida = this.sanitizer.bypassSecurityTrustHtml(html);
        });

        if (response.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Operación completada correctamente.'
          });
        } else if (response.status === 202) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Correo ya existe en la BD'
          });
        }
      },
      error: (error) => {
        this.loadingArmarComida = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al momento de crear un cliente'
        });
        console.error('Error al crear cliente:', error);
        this.formErrors.update(errors => ({ ...errors, apiError: 'Error al guardar el cliente. Inténtalo de nuevo.' }));
      }
    });

  }

}
