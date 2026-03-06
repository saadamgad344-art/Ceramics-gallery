import { Injectable, signal, effect, computed } from '@angular/core';
import { Product } from '../products/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  private items = signal<CartItem[]>([]);
  readonly items$ = this.items.asReadonly();

  // ✅ ده الجديد — عدد العناصر الكلي
  readonly cartCount = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0)
  );

  constructor() {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try { this.items.set(JSON.parse(stored)); } catch {}
    }

    // حفظ تلقائي في localStorage
    effect(() => {
      const list = this.items();
      localStorage.setItem('cart', JSON.stringify(list));
    });
  }

  add(product: Product, qty = 1) {
    const list = [...this.items()];
    const existing = list.find(i => i.product.id === product.id);

    if (existing) {
      existing.quantity += qty;
    } else {
      list.push({ product, quantity: qty });
    }

    this.items.set(list);
  }

  remove(productId: number) {
    this.items.set(this.items().filter(i => i.product.id !== productId));
  }

  update(productId: number, qty: number) {
    const list = [...this.items()];
    const entry = list.find(i => i.product.id === productId);

    if (entry) {
      entry.quantity = qty;

      if (entry.quantity <= 0) {
        return this.remove(productId);
      }

      this.items.set(list);
    }
  }

  clear() {
    this.items.set([]);
  }

  total() {
    return this.items().reduce(
      (sum, i) => sum + i.product.pricePerMeter * i.quantity,
      0
    );
  }
}
