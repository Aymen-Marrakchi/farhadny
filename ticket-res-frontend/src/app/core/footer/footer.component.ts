import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'; // Import MatToolbarModule
import { NewsletterSubscriptionComponent } from '../../newsletter-subscription/newsletter-subscription.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule,
    MatIconModule, // Import MatIconModule
    NewsletterSubscriptionComponent
  ], // Add to imports
  template: `
  <div class="footer-main">
  <div class="footer-columns">
    <div class="footer-column">
      <h2>FARHADNI</h2>
      <p>
        Farhadni is a global self-service ticketing platform for live experiences that allows anyone
        to create, share, find and attend events that fuel their passions and enrich their lives.
      </p>
    </div>

    <div class="footer-column">
      <h4>Farhadni</h4>
      <ul>
        <li><a href="#">About Us</a></li>
        <li><a href="#">Contact Us</a></li>
        <li><a href="#">Privacy</a></li>
        <li><a href="#">Terms</a></li>
      </ul>
    </div>

    <div class="footer-column">
      <h4>Stay In The Loop</h4>
      <p>Join our mailing list to stay in the loop with our newest for Event and concert</p>
      <div class="newsletter-wrapper">
        <app-newsletter-subscription></app-newsletter-subscription>
      </div>
    </div>

<mat-toolbar class="footer-toolbar">
  <span class="footer-text">&copy; {{ currentYear }} Farhadni. All rights reserved.</span>
</mat-toolbar>
  `,
  styles: [`
   .footer-main {
  background-color: #0a0056; // Deep navy background
  padding: 60px 40px 30px;
  color: white;
  font-family: 'DM Sans', sans-serif;
}

.footer-columns {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-column {
  flex: 1;
  min-width: 250px;
}

.footer-column h2,
.footer-column h4 {
  font-size: 1.3em;
  margin-bottom: 15px;
}

.footer-column p {
  font-size: 0.95em;
  line-height: 1.6;
  color: #cccccc;
}

.footer-column ul {
  list-style: none;
  padding: 0;
}

.footer-column li {
  margin-bottom: 10px;
}

.footer-column a {
  text-decoration: none;
  color: #ffffff;
  transition: color 0.3s;
}

.footer-column a:hover {
  color: #ff148f;
}

/* Newsletter component should be styled as shown in previous steps */

.footer-toolbar {
  background-color: #0a0056;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85em;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
}
.newsletter-wrapper {
  margin-top: 20px;
  max-width: 100%;
}
  `]
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}
