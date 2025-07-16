import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations'; // Should be here
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http'; // We'll add interceptors later
import { authInterceptorProvider } from './core/interceptors/auth.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from './services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    authInterceptorProvider, // <-- Ensure this line is present
    importProvidersFrom(MatSnackBarModule, BrowserAnimationsModule),
    AuthService
  ]
};