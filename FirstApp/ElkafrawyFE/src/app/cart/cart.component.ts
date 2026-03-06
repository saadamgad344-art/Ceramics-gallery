/*import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './cart.service';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class CartComponent {
  private cart = inject(CartService);
  items = this.cart.items$;
  total = signal(0);
  loading = signal(false);
  error = signal<string | null>(null);
  private api = inject(ApiService);
  private router = inject(Router);

  constructor() {
    // recalc total whenever items change
    effect(() => {
      this.items(); // track
      this.total.set(this.cart.total());
    });
  }

  update(id: number, qty: string) {
    const n = parseInt(qty, 10) || 0;
    this.cart.update(id, n);
  }

  remove(id: number) {
    this.cart.remove(id);
  }

  checkout() {
    if (!this.items() || this.items().length === 0) return;
    this.loading.set(true);
    this.error.set(null);
    const dto = { orderItems: this.items().map(i => ({ productId: i.product.id, quantity: i.quantity })) };
    console.log(dto);
    this.api.post('orders', dto).subscribe({
      next: () => {
        this.cart.clear();
        this.router.navigate(['']);
      },
      error: e => this.error.set(e.error || e.message || 'فشل الدفع'),
      complete: () => this.loading.set(false)
    });
  }
}*/

import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './cart.service';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { CurrencyFormatPipe } from '../currency-format-pipe';
import { BrandFormComponent } from '../brands/brand-form.component';
import { BrandListComponent } from '../brands/brand-list.component';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe]
})
export class CartComponent {
  private cart = inject(CartService);
  items = this.cart.items$;
  total = signal(0);
  loading = signal(false);
  error = signal<string | null>(null);
  private api = inject(ApiService);
  private router = inject(Router);

  constructor() {
    // حساب المجموع كل مرة تتغير السلة
    effect(() => {
      this.items(); // track
      this.total.set(this.cart.total());
    });
  }

  update(id: number, qty: string) {
    const n = parseInt(qty, 10) || 0;
    this.cart.update(id, n);
  }

  remove(id: number) {
    this.cart.remove(id);
  }

  checkout() {
    if (!this.items() || this.items().length === 0) return;

    this.loading.set(true);
    this.error.set(null);

    // 1️⃣ حضّر DTO للإرسال للـ API
    const dto = {
      orderItems: this.items().map(i => ({
        productId: i.product.id,
        quantity: i.quantity,
        price: i.product.pricePerMeter,
        
        // ممكن تحتاج السعر لو الـ API بيطل
      }))
    };
    console.log(dto);

    // 2️⃣ أرسل الأوردر للـ API
    this.api.post('orders', dto).subscribe({
      next: () => {
        // بعد نجاح الأوردر

        // a) جلب اسم العميل (ممكن يكون من localStorage أو JWT)
        const customerName = localStorage.getItem('userName') || 'العميل';

        // b) حضّر رسالة WhatsApp
        const message = `عميل ${customerName} طلب المنتجات التالية:\n` +
          this.items().map(i => `- ${i.product.name} (كمية: ${i.quantity}, سعر: ${i.product.pricePerMeter} ج.م)`).join('\n');

        // c) رقم صاحب المعرض مع كود الدولة
        const ownerNumber = '201026455778'; 
        const whatsappLink = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(message)}`;

        // d) افتح WhatsApp في تبويب جديد
        window.open(whatsappLink, "_blank");

        // e) نظف السلة وارجع للصفحة الرئيسية أو صفحة نجاح
        this.cart.clear();
        this.router.navigate(['']);
      },
      error: e => this.error.set(e.error || e.message || 'فشل الدفع'),
      complete: () => this.loading.set(false)
    });
  }
}
