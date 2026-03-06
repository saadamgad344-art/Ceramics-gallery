import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Product } from './product.model';
import { CartService } from '../cart/cart.service';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms'; // ضروري لـ ngModel
import { CurrencyFormatPipe } from '../currency-format-pipe';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyFormatPipe
  ]
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  quantity = 1; // القيمة الافتراضية للكمية

  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private router = inject(Router);
  private cart = inject(CartService);
  private auth = inject(AuthService);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.fetch(id);
  }

  fetch(id: number) {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Product>(`products/${id}`).subscribe({
      next: (p) => {
        const safe = {
          ...p,
          productImages: p.productImages?.map(img => ({
            ...img,
            imageUrl: img.imageUrl === 'null' ? undefined : img.imageUrl
          }))
        } as Product;
        this.product.set(safe);
      },
      error: (err) => this.error.set(err.message || 'خطأ'),
      complete: () => this.loading.set(false)
    });
  }

  back() {
    this.router.navigate(['/']);
  }

  addToCart() {
    const p = this.product();
    if (p) {
      const qty = Math.max(1, Math.min(this.quantity, p.stockQuantity)); // التأكد من الكمية صحيحة
      this.cart.add(p, qty);
      
    }
  }

  isAdmin() { return this.auth.isAdmin(); }
}
