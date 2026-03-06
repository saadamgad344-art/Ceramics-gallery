import { Component, signal, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { Category } from '../models/category.model';
import { Brand } from '../models/brand.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProductCreate {
  id?: number;
  name: string;
  description: string;
  pricePerMeter: number;
  size?: string;
  color?: string;
  texture?: string;
  stockQuantity?: number;
  categoryId?: number;
  brandId?: number;
  productImages?: { imageUrl?: string | null }[];
}

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductFormComponent {
  model: ProductCreate = {
    name: '',
    description: '',
    pricePerMeter: 0,
    productImages: []
  };
  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]);
  error = signal<string | null>(null);
  loading = signal(false);
  isEdit = signal(false);

  imageFiles: File[] = [];

  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  ngOnInit() {
    this.loadMetadata();
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = idStr ? Number(idStr) : null;
    if (id) {
      this.isEdit.set(true);
      this.load(id);
    }
  }

  private loadMetadata() {
    this.api.get<Category[]>('categories').subscribe({ next: c => this.categories.set(c) });
    this.api.get<Brand[]>('brands').subscribe({ next: b => this.brands.set(b) });
  }

  load(id: number) {
    this.loading.set(true);
    this.api.get<any>(`products/${id}`).subscribe({
      next: (p) => {
        this.model = {
          id: p.id,
          name: p.name,
          description: p.description,
          pricePerMeter: p.pricePerMeter,
          size: p.size,
          color: p.color,
          texture: p.texture,
          stockQuantity: p.stockQuantity,
          categoryId: p.categoryId,
          brandId: p.brandId,
          productImages: (p.productImages || []).map((i: any) => ({ imageUrl: i.imageUrl }))
        };
      },
      error: (err) => this.error.set(err.error || err.message || 'فشل التحميل'),
      complete: () => this.loading.set(false)
    });
  }

  addImage() {
    this.model.productImages = this.model.productImages || [];
    this.model.productImages.push({ imageUrl: '' });
  }

  removeImage(idx: number) {
    this.model.productImages?.splice(idx, 1);
  }

  submit() {
    this.loading.set(true);
    this.error.set(null);
    if (this.isEdit()) {
      const id = this.model.id!;
      this.api.put(`products/${id}`, this.model).subscribe({
        next: () => {
          if (this.imageFiles.length) {
            const uploads = this.imageFiles.map(f => this.api.uploadImage(id, f));
            forkJoin(uploads).subscribe({
              next: () => this.router.navigate(['']),
              error: (e) => this.error.set(e.message || 'فشل رفع الصور'),
              complete: () => this.loading.set(false)
            });
          } else {
            this.router.navigate(['']);
            this.loading.set(false);
          }
        },
        error: (err) => this.error.set(err.error || err.message || 'فشل الحفظ'),
        complete: () => {}
      });
    } else {
      this.api.post<ProductCreate & { id: number }>('products', this.model).subscribe({
        next: (res) => {
          const id = res.id;
          if (this.imageFiles.length) {
            import('rxjs').then(rx => {
              const uploads = this.imageFiles.map(f => this.api.uploadImage(id, f));
              rx.forkJoin(uploads).subscribe({
                next: () => this.router.navigate(['']),
                error: (e) => this.error.set(e.message || 'فشل رفع الصور'),
                complete: () => this.loading.set(false)
              });
            });
          } else {
            this.router.navigate(['']);
            this.loading.set(false);
          }
        },
        error: (err) => this.error.set(err.error || err.message || 'فشل الإنشاء'),
        complete: () => {}
      });
    }
  }

  delete() {
    if (!this.isEdit()) return;
    const ok = window.confirm('حذف هذا المنتج؟');
    if (!ok) return;
    const id = this.model.id!;
    this.api.delete(`products/${id}`).subscribe({
      next: () => this.router.navigate(['']),
      error: (err) => this.error.set(err.error || err.message || 'فشل الحذف')
    });
  }

  onFileChange(evt: Event) {
    const input = evt.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.imageFiles.push(input.files[0]);
    }
  }

  isAdmin() { return this.auth.isAdmin(); }
}
