import { Component, inject, signal } from '@angular/core';
import { LayoutService } from '../../../../../layout/service/app.layout.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User, UserLogin } from '../../../../api/user';
import { UsuariosService } from '../../../../service/usuarios.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    RouterModule,
    CommonModule,
    ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [ConfirmationService, MessageService]
})
export class LoginComponent {

  public layoutService = inject(LayoutService);
  private usuariosService = inject(UsuariosService);
  private messageService = inject(MessageService);

  submitted: boolean = false;
  password!: string;
  formErrors = signal<any>("");

  user: UserLogin = {
    email: "",
    password1: ""
  };
  ripple: boolean | undefined;

  infoUser = {
    colorScheme: '',
    theme: '',
    ripple: true
  };

  constructor(public router: Router,) { }

  ngOnInit(): void {

    const infoUserStr = localStorage.getItem('infoUser');

    if (infoUserStr) {
      const infoUserActual = JSON.parse(infoUserStr);
      this.ripple = infoUserActual.ripple;
      this.changeTheme(infoUserActual.theme, infoUserActual.colorScheme);

    } else {
      console.log('No se encontraron los datos del usuario.');
    }

  }

  ingresar() {
    this.submitted = true;

    this.formErrors.set({});
    let currentErrors: { [key: string]: string } = {};

    if (!this.user.email) { // Primero verifica si está vacío o nulo
      currentErrors['email'] = 'El email es requerido.';
    } else { // Si tiene un valor, entonces procede a validar el formato
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.user.email)) {
        currentErrors['email'] = 'El formato del email no es válido.';
      }
    }

    if (!this.user.password1) {
      currentErrors['password1'] = 'La contraseña es requerida.';
    } else if (this.user.password1.length < 6) {
      currentErrors['password1'] = 'La contraseña debe tener al menos 6 caracteres.';
    }

    this.formErrors.set(currentErrors);
    if (Object.keys(currentErrors).length > 0) {
      console.warn("Formulario con errores de validación:", currentErrors);
      return;
    }

    let form: UserLogin = {
      email: this.user.email,
      password1: this.user.password1
    };

    /* aqui mandar a ingresar */

    this.usuariosService.loginUser(form).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.resetForm();
          const userLoggeado = response.body as User;

          if (response.body) {
            const loginUser = {
            id: userLoggeado.id,
            name: userLoggeado.name || 'Valor por defecto',
            lastname: userLoggeado.lastname,
            email:userLoggeado.email,
            token: userLoggeado.token,
            ripple: false
          };

          localStorage.setItem('loginUser', JSON.stringify(loginUser));
          if (userLoggeado.token) {
            localStorage.setItem('token', userLoggeado.token);
          }
          }

          this.router.navigateByUrl('/dashboard');

        } else if (response.status === 201) {

          this.messageService.add({
            severity: 'error', // Tipo de toast: 'success', 'info', 'warn', 'error'
            summary: 'Error',
            detail: 'Usuario o contraseña incorrectos.'
          });

        } else {

          this.messageService.add({
            severity: 'error', // Tipo de toast: 'success', 'info', 'warn', 'error'
            summary: 'Error',
            detail: 'Ocurrio un  error al validar el usuario'
          });

        }

      },
      error: (error) => {
        this.messageService.add({
          severity: 'error', // Tipo de toast: 'success', 'info', 'warn', 'error'
          summary: 'Error',
          detail: 'Ocurrió un error al momento de validar el usuario'
        });

        this.formErrors.update(errors => ({ ...errors, apiError: 'Error al ingresar el usuario. Inténtalo de nuevo.' }));
      }
    });

    this.submitted = false;
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

  resetForm() {
    this.user = {
      email: "",
      password1: ""
    };
    this.formErrors.set({});
  }

}
