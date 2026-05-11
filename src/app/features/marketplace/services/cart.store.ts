import { Injectable, computed, signal } from '@angular/core';
import type { CartItem, Currency } from '../models/marketplace.model';

const STRIPE_FEE_PERCENT = 0.029;
const STRIPE_FEE_FIXED = 1;

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly _items = signal<CartItem[]>([]);
  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().reduce((s, i) => s + i.quantity, 0));
  readonly currency = computed<Currency>(() => this._items()[0]?.currency ?? 'MYR');
  readonly subtotal = computed(() => this._items().reduce((s, i) => s + i.unitPrice * i.quantity, 0));
  readonly fees = computed(() => {
    const s = this.subtotal();
    return s === 0 ? 0 : Math.round((s * STRIPE_FEE_PERCENT + STRIPE_FEE_FIXED) * 100) / 100;
  });
  readonly discount = signal(0);
  readonly total = computed(() => Math.max(0, this.subtotal() + this.fees() - this.discount()));

  add(item: CartItem): void {
    this._items.update((rows) => {
      const existing = rows.find((r) => r.id === item.id);
      if (existing) {
        return rows.map((r) => r.id === item.id ? { ...r, quantity: r.quantity + item.quantity } : r);
      }
      return [...rows, item];
    });
  }
  remove(id: string): void { this._items.update((r) => r.filter((i) => i.id !== id)); }
  setQty(id: string, qty: number): void {
    this._items.update((r) => r.map((i) => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  }
  applyPromo(code: string): { ok: boolean; message: string } {
    if (code.trim().toUpperCase() === 'MEREKA20') {
      this.discount.set(Math.round(this.subtotal() * 0.2 * 100) / 100);
      return { ok: true, message: '20% off applied.' };
    }
    this.discount.set(0);
    return { ok: false, message: 'Unknown promo code.' };
  }
  clear(): void { this._items.set([]); this.discount.set(0); }
}
