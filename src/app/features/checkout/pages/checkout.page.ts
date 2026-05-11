import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartStore } from '../../marketplace/services/cart.store';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';

@Component({
  selector: 'mereka-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-12 gap-8">
      <main class="col-span-12 md:col-span-7 space-y-6">
        <h1 class="text-2xl font-semibold">Checkout</h1>

        <section class="bg-white border border-neutral-200 rounded-lg p-6">
          <h2 class="font-semibold mb-4">Contact details</h2>
          <div class="grid grid-cols-2 gap-3">
            <label class="block">
              <span class="text-xs uppercase tracking-wider text-neutral-500">Full name</span>
              <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="name()" (ngModelChange)="name.set($event)" name="name" />
            </label>
            <label class="block">
              <span class="text-xs uppercase tracking-wider text-neutral-500">Email</span>
              <input type="email" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="email()" (ngModelChange)="email.set($event)" name="email" />
            </label>
          </div>
        </section>

        <section class="bg-white border border-neutral-200 rounded-lg p-6">
          <h2 class="font-semibold mb-4">Payment</h2>
          <div class="flex items-center gap-3 mb-4">
            <button type="button" class="flex-1 px-4 py-3 rounded border text-sm text-left"
                    [class.border-neutral-900]="method() === 'card'" [class.border-neutral-200]="method() !== 'card'"
                    (click)="method.set('card')">
              <div class="font-medium">💳 Card</div>
              <div class="text-xs text-neutral-500">Visa, Mastercard, Amex via Stripe</div>
            </button>
            <button type="button" class="flex-1 px-4 py-3 rounded border text-sm text-left"
                    [class.border-neutral-900]="method() === 'fpx'" [class.border-neutral-200]="method() !== 'fpx'"
                    (click)="method.set('fpx')">
              <div class="font-medium">🏦 Online banking (FPX)</div>
              <div class="text-xs text-neutral-500">MY local banks</div>
            </button>
          </div>
          <ng-container *ngIf="method() === 'card'">
            <label class="block mb-3">
              <span class="text-xs uppercase tracking-wider text-neutral-500">Card number</span>
              <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200 font-mono" placeholder="4242 4242 4242 4242" [ngModel]="cardNumber()" (ngModelChange)="cardNumber.set($event)" name="card" />
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label class="block">
                <span class="text-xs uppercase tracking-wider text-neutral-500">Expiry</span>
                <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200 font-mono" placeholder="MM / YY" [ngModel]="expiry()" (ngModelChange)="expiry.set($event)" name="expiry" />
              </label>
              <label class="block">
                <span class="text-xs uppercase tracking-wider text-neutral-500">CVC</span>
                <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200 font-mono" placeholder="123" [ngModel]="cvc()" (ngModelChange)="cvc.set($event)" name="cvc" />
              </label>
            </div>
          </ng-container>
        </section>
      </main>

      <aside class="col-span-12 md:col-span-5">
        <div class="sticky top-20 bg-white border border-neutral-200 rounded-lg p-6">
          <h2 class="font-semibold mb-4">Order summary</h2>
          <ul class="space-y-3 max-h-64 overflow-y-auto">
            <li *ngFor="let i of items()" class="flex gap-3">
              <img [src]="i.thumbnail" [alt]="i.title" class="w-14 h-14 rounded object-cover" />
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">{{ i.title }}</div>
                <div class="text-xs text-neutral-500 truncate">{{ i.subtitle }}</div>
                <div class="text-xs text-neutral-500 mt-1">Qty {{ i.quantity }}</div>
              </div>
              <div class="text-sm font-medium">
                {{ i.unitPrice === 0 ? 'Free' : i.currency + ' ' + (i.unitPrice * i.quantity) }}
                <button class="block text-[10px] text-error mt-1" (click)="cart.remove(i.id)">Remove</button>
              </div>
            </li>
            <li *ngIf="items().length === 0" class="text-center text-neutral-500 py-8 text-sm">
              Your cart is empty. <a routerLink="/experiences" class="text-primary-700">Browse experiences →</a>
            </li>
          </ul>

          <div class="mt-5 border-t border-neutral-100 pt-4">
            <div class="flex gap-2 mb-3">
              <input class="flex-1 px-3 py-2 rounded border border-neutral-200 text-sm" placeholder="Promo code" [ngModel]="promo()" (ngModelChange)="promo.set($event)" name="promo" />
              <button type="button" class="px-3 py-2 rounded bg-neutral-100 text-sm" (click)="applyPromo()">Apply</button>
            </div>
            <p *ngIf="promoMsg() as msg" class="text-xs mb-3" [class.text-success]="promoOk()" [class.text-error]="!promoOk()">{{ msg }}</p>
            <dl class="space-y-1 text-sm">
              <div class="flex justify-between"><dt class="text-neutral-500">Subtotal</dt><dd>{{ cart.currency() }} {{ cart.subtotal() | number: '1.2-2' }}</dd></div>
              <div class="flex justify-between"><dt class="text-neutral-500">Fees</dt><dd>{{ cart.currency() }} {{ cart.fees() | number: '1.2-2' }}</dd></div>
              <div *ngIf="cart.discount() > 0" class="flex justify-between text-success"><dt>Discount</dt><dd>− {{ cart.currency() }} {{ cart.discount() | number: '1.2-2' }}</dd></div>
              <div class="flex justify-between font-semibold text-base pt-2 border-t border-neutral-100"><dt>Total</dt><dd>{{ cart.currency() }} {{ cart.total() | number: '1.2-2' }}</dd></div>
            </dl>
          </div>

          <button type="button" class="mt-5 w-full px-4 py-3 rounded-full bg-neutral-900 text-white font-medium"
                  [disabled]="items().length === 0" [class.opacity-40]="items().length === 0"
                  (click)="pay()">
            {{ paying() ? 'Processing…' : 'Pay ' + cart.currency() + ' ' + (cart.total() | number: '1.2-2') }}
          </button>
          <p class="text-[10px] text-neutral-400 mt-2 text-center">Payments processed by Stripe. By placing your order you agree to Mereka's terms.</p>
        </div>
      </aside>
    </div>
  `,
})
export class CheckoutPage {
  readonly cart = inject(CartStore);
  private readonly api = inject(MarketplaceService);
  private readonly router = inject(Router);

  readonly items = this.cart.items;
  readonly name = signal(''); readonly email = signal('');
  readonly method = signal<'card' | 'fpx'>('card');
  readonly cardNumber = signal(''); readonly expiry = signal(''); readonly cvc = signal('');
  readonly promo = signal(''); readonly promoMsg = signal(''); readonly promoOk = signal(false);
  readonly paying = signal(false);

  applyPromo(): void {
    const r = this.cart.applyPromo(this.promo());
    this.promoOk.set(r.ok); this.promoMsg.set(r.message);
  }

  pay(): void {
    if (this.items().length === 0) return;
    this.paying.set(true);
    this.api.confirmOrder({
      items: this.items(),
      total: this.cart.total(),
      currency: this.cart.currency(),
    }).subscribe({
      next: (order) => {
        this.cart.clear();
        this.router.navigate(['/checkout/success'], { state: { order } });
      },
      error: () => this.paying.set(false),
    });
  }
}
