import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email = '';
  password = '';
  error = signal<string | null>(null);
  loading = signal(false);

  private api = inject(ApiService);
  private router = inject(Router);

  submit() {
    this.loading.set(true);
    this.error.set(null);
    this.api.login(this.email, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        window.dispatchEvent(new CustomEvent('auth-changed'));
        this.router.navigate(['']);
      },
      error: (err) => this.error.set(err.error || err.message || 'فشل الدخول'),
      complete: () => this.loading.set(false)
    });
  }
}
