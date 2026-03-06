import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Brand } from '../models/brand.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class BrandListComponent implements OnInit {
  brands = signal<Brand[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  private api = inject(ApiService);
  router = inject(Router);
  private auth = inject(AuthService);

  ngOnInit() { this.fetch(); }

  fetch() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Brand[]>('brands').subscribe({
      next: list => this.brands.set(list),
      error: e => this.error.set(e.message || 'خطأ في التحميل'),
      complete: () => this.loading.set(false)
    });
  }

  edit(b: Brand) { this.router.navigate(['brands', b.id, 'edit']); }
  remove(b: Brand) {
    if (!this.isAdmin()) return;
    const ok = window.confirm(`حذف العلامة "${b.name}"؟`);
    if (!ok) return;
    this.api.delete(`brands/${b.id}`).subscribe({
      next: () => this.fetch(),
      error: e => this.error.set(e.error || e.message || 'فشل الحذف')
    });
  }

  isAdmin() { return this.auth.isAdmin(); }
}
