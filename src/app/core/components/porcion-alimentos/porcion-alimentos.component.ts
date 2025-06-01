import { Component, inject } from '@angular/core';

//primegn
import { MessageService } from 'primeng/api';
import { LayoutService } from '../../../layout/service/app.layout.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-porcion-alimentos',
  standalone: true,
  imports: [ButtonModule, ToastModule],
  templateUrl: './porcion-alimentos.component.html',
  styleUrl: './porcion-alimentos.component.css',
  providers:[MessageService]
})
export class PorcionAlimentosComponent {
  private messageService= inject(MessageService);
  public layoutService= inject(LayoutService);
  

  ngOnInit(): void {
    
    this.changeTheme('arya-green', 'dark');
    
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

}
