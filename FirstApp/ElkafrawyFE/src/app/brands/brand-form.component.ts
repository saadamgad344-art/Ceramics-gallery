import { Component, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Brand } from '../models/brand.model';

@Component({
  selector: 'app-brand-form',
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BrandFormComponent {
  model: Partial<Brand> = { name: '' };
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
    this.api.get<Brand>(`brands/${id}`).subscribe({
      next: b => this.model = b,
      error: e => this.error.set(e.error || e.message || 'فشل التحميل'),
      complete: () => this.loading.set(false)
    });
  }

  submit() {
    this.loading.set(true);
    this.error.set(null);
    if (this.isEdit()) {
      const id = this.model.id!;
      this.api.put(`brands/${id}`, { name: this.model.name }).subscribe({
        next: () => this.router.navigate(['brands']),
        error: e => this.error.set(e.error || e.message || 'فشل الحفظ'),
        complete: () => this.loading.set(false)
      });
    } else {
      this.api.post('brands', { name: this.model.name }).subscribe({
        next: () => this.router.navigate(['brands']),
        error: e => this.error.set(e.error || e.message || 'فشل الإنشاء'),
        complete: () => this.loading.set(false)
      });
    }
  }
}
