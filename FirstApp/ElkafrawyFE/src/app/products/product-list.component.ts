import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { Product } from './product.model';
import { CartService } from '../cart/cart.service';
import { FormsModule } from '@angular/forms';
import { CurrencyFormatPipe } from '../currency-format-pipe';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe]
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  quantities: number[] = []; // مصفوفة لتخزين كمية كل منتج

  private auth = inject(AuthService);
  constructor(private api: ApiService, private router: Router) {}
  private cart = inject(CartService);

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Product[]>('products').subscribe({
      next: (list) => {
        const safe = list.map(p => ({
          ...p,
          productImages: p.productImages?.map(img => ({
            ...img,
            imageUrl: img.imageUrl === 'null' ? undefined : img.imageUrl
          }))
        }));
        this.products.set(safe);

        // تهيئة الكميات لكل منتج بالقيمة الافتراضية 1
        this.quantities = safe.map(() => 1);
      },
      error: (err) => this.error.set(err.message || 'خطأ في التحميل'),
      complete: () => this.loading.set(false)
    });
  }

  view(product: Product) {
    this.router.navigate(['/product', product.id]);
  }

  edit(product: Product) {
    this.router.navigate(['/product', product.id, 'edit']);
  }

  remove(product: Product) {
    const ok = window.confirm(`حذف المنتج "${product.name}"؟`);
    if (!ok) return;
    this.api.delete(`products/${product.id}`).subscribe({
      next: () => this.fetch(),
      error: (err) => this.error.set(err.error || err.message || 'فشل الحذف')
    });
  }

  isAdmin() { return this.auth.isAdmin(); }

  addToCart(p: Product, index: number) {
    const qty = this.quantities[index] || 1;
    this.cart.add(p, qty);
   
  }
}
