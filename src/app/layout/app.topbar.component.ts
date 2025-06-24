import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [CommonModule, RouterLink, InputSwitchModule, FormsModule],
    templateUrl: './app.topbar.component.html',
    styleUrl: './topbar.css',
    providers: [MessageService]
})
export class AppTopBarComponent {

    items!: MenuItem[];
    private messageService = inject(MessageService);

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    ripple: boolean | undefined;

    infoUser = {
        colorScheme: '',
        theme: '',
        ripple: true
    };
    constructor(public layoutService: LayoutService, public router: Router) { }

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

    onRippleChange(): void {

        console.log("Estado actual de ripple:", this.ripple);

        if (this.ripple) {
            this.changeTheme('vela-purple', 'dark');
            this.infoUser = {
                colorScheme: 'dark',
                theme: 'vela-purple',
                ripple: true
            };

        } else {

            this.changeTheme('saga-purple', 'light');
            this.infoUser = {
                colorScheme: 'light',
                theme: 'saga-purple',
                ripple: false
            };
        }

        localStorage.setItem('infoUser', JSON.stringify(this.infoUser));
    }

    salir() {
        localStorage.removeItem('loginUser');
        this.router.navigateByUrl('/auth/login');
    }
} 
