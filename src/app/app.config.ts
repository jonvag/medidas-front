import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { APP_CONFIG } from './core/config/app-config.token';
import { APP_DEV_CONFIG } from './core/config/app-config.development';
import { APP_PROD_CONFIG } from './core/config/app-config.production';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), provideRouter(routes),provideAnimations(), {
      provide: APP_CONFIG,
      useValue: isDevMode() ? APP_DEV_CONFIG : APP_PROD_CONFIG,
    }]
};
