import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { CartService } from './cart/cart.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ElkafrawyFE');
  loggedIn = signal<boolean>(!!localStorage.getItem('token'));
  private auth = inject(AuthService);
  private cart = inject(CartService);
cartCount = this.cart.cartCount;


  isAdmin() { return this.auth.isAdmin(); }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.set(false);
    window.dispatchEvent(new CustomEvent('auth-changed'));
  }

  constructor() {
    window.addEventListener('auth-changed', () => {
      this.loggedIn.set(!!localStorage.getItem('token'));
    });
  }
}
