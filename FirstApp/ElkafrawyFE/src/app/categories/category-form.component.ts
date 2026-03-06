import { Component, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CategoryFormComponent {
  model: Partial<Category> = { name: '' };
  loading = signal(false);
  error = signal<string | null>(null);
  isEdit = signal(false);

  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.load(Number(id));
    }
  }

  load(id: number) {
    this.loading.set(true);
    this.api.get<Category>(`categories/${id}`).subscribe({
      next: (c) => this.model = c,
      error: (e) => this.error.set(e.error || e.message || 'فشل التحميل'),
      complete: () => this.loading.set(false)
    });
  }

  submit() {
    this.loading.set(true);
    this.error.set(null);
    if (this.isEdit()) {
      const id = this.model.id!;
      this.api.put(`categories/${id}`, { name: this.model.name, parentCategoryId: this.model.parentCategoryId }).subscribe({
        next: () => this.router.navigate(['categories']),
        error: (e) => this.error.set(e.error || e.message || 'فشل الحفظ'),
        complete: () => this.loading.set(false)
      });
    } else {
      this.api.post('categories', { name: this.model.name, parentCategoryId: this.model.parentCategoryId }).subscribe({
        next: () => this.router.navigate(['categories']),
        error: (e) => this.error.set(e.error || e.message || 'فشل الإنشاء'),
        complete: () => this.loading.set(false)
      });
    }
  }
}
