import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandeListComponent } from './components/commande-list/commande-list.component';
import { AuthGuard } from './guards/auth.guard';

// Pages e-commerce
import { HomeComponent } from './components/home/home.component';
import { StoreComponent } from './components/store/store.component';
import { ProductComponent } from './components/product/product.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { IndexComponent } from './components/index/index.component';
import { ContractComponent } from './components/contract/contract.component';
import { ItemComponent } from './components/item/item.component';
import { PaymentComponent } from './components/payment/payment.component';
import { VerificationSmsComponent } from './components/verification-sms/verification-sms.component';
import { CommandeComponent } from './components/commande/commande.component';
import { DiscountComponent } from './components/discount/discount.component';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminProfileComponent } from './components/admin-profile-component/admin-profile-component.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ProfileComponent } from './components/profile/profile.component';
const routes: Routes = [
  // E-commerce
  { path: '', component: IndexComponent },
  { path: 'store', component: StoreComponent },
  { path: 'product', component: ProductComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'contract/:id', component: ContractComponent },
  { path: 'item', component: ItemComponent },
  { path: 'commande/:id', component: CommandeComponent },
  { path: 'commandes', component: CommandeListComponent },
  { path: 'payment/:contractId', component: PaymentComponent },

  // Auth & Admin
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AdminProfileComponent },
      { path: 'discounts', component: DiscountComponent },
      { path: 'get-commandes', component: CommandeListComponent },
      { path: 'users', component: UserListComponent }
    ]
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    data: { roles: ['BORROWER', 'OWNER'] },
    component: ProfileComponent
  },
  { path: 'verification-sms/:id', component: VerificationSmsComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
