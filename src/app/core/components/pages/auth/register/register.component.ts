import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LayoutService } from '../../../../../layout/service/app.layout.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { User } from '../../../../api/user';
import { UsuariosService } from '../../../../service/usuarios.service';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ButtonModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    RouterModule,
    CommonModule,
    ToastModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [ConfirmationService, MessageService]

})
export class RegisterComponent {

  public layoutService = inject(LayoutService);
  private usuariosService = inject(UsuariosService);
  private messageService = inject(MessageService);

  submitted: boolean = false;
  password!: string;
  formErrors = signal<any>("");

  user: User = {
    name: "",
    lastname: "",
    email: "",
    password1: ""
  };

  constructor(public router: Router,) { }

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

  saveUser() {
    this.submitted = true;

    this.formErrors.set({});
    let currentErrors: { [key: string]: string } = {};

    if (!this.user.email) { // Primero verifica si está vacío o nulo
      currentErrors['email'] = 'El email es requerido.';
    } else { // Si tiene un valor, entonces procede a validar el formato
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      console.log("mieer");
      if (!emailRegex.test(this.user.email)) {
        currentErrors['email'] = 'El formato del email no es válido.';
      }
    }

    // Name Validation
    if (!this.user.name || this.user.name.trim() === '') {
      currentErrors['name'] = 'El nombre es requerido.';
    } else if (this.user.name.length < 2) {
      currentErrors['name'] = 'El nombre debe tener al menos 2 caracteres.';
    }

    // Lastname Validation
    if (!this.user.lastname || this.user.lastname.trim() === '') {
      currentErrors['lastname'] = 'El apellido es requerido.';
    } else if (this.user.lastname.length < 2) {
      currentErrors['lastname'] = 'El apellido debe tener al menos 2 caracteres.';
    }

    // Password1 Validation
    if (!this.user.password1) {
      currentErrors['password1'] = 'La contraseña es requerida.';
    } else if (this.user.password1.length < 6) {
      currentErrors['password1'] = 'La contraseña debe tener al menos 6 caracteres.';
    }

    // Password2 (Confirm Password) Validation
    if (!this.user.password2) {
      currentErrors['password2'] = 'La confirmación de contraseña es requerida.';
    } else if (this.user.password1 !== this.user.password2) {
      currentErrors['password2'] = 'Las contraseñas no coinciden.';
      // También podrías agregar un error a password1 si quieres que ambos campos se marquen
      // if (!currentErrors['password1']) { // Solo si no hay un error ya de password1
      //   currentErrors['password1'] = 'Las contraseñas no coinciden.';
      // }
    }

    this.formErrors.set(currentErrors);
    if (Object.keys(currentErrors).length > 0) {
      console.warn("Formulario con errores de validación:", currentErrors);
      return;
    }

    let form: User = {
      name: this.user.name,
      lastname: this.user.lastname,
      email: this.user.email,
      password1: this.user.password1,
      status: true
    };

    /* aqui mandar a crear */

    this.usuariosService.createUser(form).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.resetForm();
          this.messageService.add({
            severity: 'success', // Tipo de toast: 'success', 'info', 'warn', 'error'
            summary: 'Éxito',
            detail: 'Usuario  creado correctamente!.'
          });
          setTimeout(() => {

            this.router.navigateByUrl('/auth/login');
          }, 1300);

        } else if (response.status === 201) {

          this.messageService.add({
            severity: 'error', // Tipo de toast: 'success', 'info', 'warn', 'error'
            summary: 'Error',
            detail: 'Correo ya existe en la BD'
          });


        } else if (response.status === 400) {

          this.messageService.add({
            severity: 'error', // Tipo de toast: 'success', 'info', 'warn', 'error'
            summary: 'Error',
            detail: 'Ocurrio un  error al crear el usuario'
          });

        }

      },
      error: (error) => {
        this.messageService.add({
          severity: 'error', // Tipo de toast: 'success', 'info', 'warn', 'error'
          summary: 'Error',
          detail: 'Ocurrió un error al momento de crear un usuario'
        });

        console.error('Error al crear usuario:', error);
        this.formErrors.update(errors => ({ ...errors, apiError: 'Error al guardar el usuario. Inténtalo de nuevo.' }));
      }
    });

    this.submitted = false;
  }

  resetForm() {
    this.user = {
      name: "",
      lastname: "",
      email: "",
      password1: ""
    };
    this.formErrors.set({});
  }

}
