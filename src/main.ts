import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { routes } from './app/app.routes'; // <-- Your routes file
import { provideRouter } from '@angular/router';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideAnimations(),
    provideNzI18n(en_US),
    provideHttpClient(withFetch()),
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
