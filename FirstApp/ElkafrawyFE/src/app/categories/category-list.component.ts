import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Category } from '../models/category.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class CategoryListComponent implements OnInit {
  categories = signal<Category[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  private api = inject(ApiService);
  router = inject(Router);
  private auth = inject(AuthService);

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Category[]>('categories').subscribe({
      next: (list) => this.categories.set(list),
      error: (err) => this.error.set(err.message || 'خطأ في التحميل'),
      complete: () => this.loading.set(false)
    });
  }

  edit(cat: Category) {
    this.router.navigate(['categories', cat.id, 'edit']);
  }

  remove(cat: Category) {
    if (!this.isAdmin()) return;
    const ok = window.confirm(`حذف التصنيف "${cat.name}"؟`);
    if (!ok) return;
    this.api.delete(`categories/${cat.id}`).subscribe({
      next: () => this.fetch(),
      error: (err) => this.error.set(err.error || err.message || 'فشل الحذف')
    });
  }

  isAdmin() { return this.auth.isAdmin(); }
}
