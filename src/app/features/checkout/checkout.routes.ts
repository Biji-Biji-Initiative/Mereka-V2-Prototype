import { Routes } from '@angular/router';
import { CheckoutPage } from './pages/checkout.page';
import { CheckoutSuccessPage } from './pages/checkout-success.page';
import { CheckoutExpiredPage } from './pages/checkout-expired.page';
import { CheckoutSoldOutPage } from './pages/checkout-sold-out.page';
import { ProposalCheckoutPage } from './pages/proposal-checkout.page';
export const CHECKOUT_ROUTES: Routes = [
  { path: '', component: CheckoutPage, pathMatch: 'full' },
  { path: 'success', component: CheckoutSuccessPage },
  { path: 'expired', component: CheckoutExpiredPage },
  { path: 'sold-out', component: CheckoutSoldOutPage },
  { path: 'proposal', component: ProposalCheckoutPage },
];
