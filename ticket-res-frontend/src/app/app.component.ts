import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/header/header.component'; // Import HeaderComponent
import { FooterComponent } from './core/footer/footer.component'; // Import FooterComponent
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent, // Add HeaderComponent
    FooterComponent,  // Add FooterComponent
    HttpClientModule, // <--- Make sure this is imported!
    MatIconModule,
    CommonModule
  ],
  template: `
    <app-header></app-header>
    <main class="content-wrapper">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    /* Basic body reset and full height setup */
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .content-wrapper {
      flex: 1; /* Allows main content to grow and push footer down */
      //padding: 20px; /* Some padding around the routed content */
      background-color: #1a1a1a; /* Dark background as per your design */
      color: white;
    }

    /* Override default Angular Material primary color if needed to match dark theme */

    /* Basic global styles for font and margin */
    body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }
  `]
})
export class AppComponent {
  title = 'Frhadny';
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
  this.matIconRegistry.addSvgIcon(
    'calendar_today_icon', // Name you'll use in HTML
    this.domSanitizer.bypassSecurityTrustResourceUrl('/calendar_today.svg')
  );
  this.matIconRegistry.addSvgIcon(
    'location_on_icon', // Name you'll use in HTML
    this.domSanitizer.bypassSecurityTrustResourceUrl('/location_on.svg')
  );
}
}
