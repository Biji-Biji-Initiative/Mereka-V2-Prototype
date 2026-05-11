import { Routes } from '@angular/router';
import { CheckoutPage } from './pages/checkout.page';
import { CheckoutSuccessPage } from './pages/checkout-success.page';
export const CHECKOUT_ROUTES: Routes = [
  { path: '', component: CheckoutPage, pathMatch: 'full' },
  { path: 'success', component: CheckoutSuccessPage, pathMatch: 'full' },
];
