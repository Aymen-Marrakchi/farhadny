import { NgModule } from '@angular/core';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    // your components heres
  ],
  imports: [
    BrowserModule, // Usually required for root module
    HttpClientModule,
    MatIconModule,
  ],
  bootstrap: []
})

export class ApplicationModule {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'calendar_today_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/calendar_today.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'location_on_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/location_on.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'facebook',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/facebook.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'twitter',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/twitter.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'whatsapp',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/whatsapp.svg')
    );
  }
}
  