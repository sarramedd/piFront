import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Pages e-commerce
import { HomeComponent } from './components/home/home.component';
import { StoreComponent } from './components/store/store.component';
import { ProductComponent } from './components/product/product.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { IndexComponent } from './components/index/index.component';
import { ContractComponent } from './components/contract/contract.component';
import { ItemComponent } from './components/item/item.component';
import { PaymentComponent } from './components/payment/payment.component';

// Auth et Admin
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileUserComponent } from './components/profile-user/profile-user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminProfileComponent } from './components/admin-profile-component/admin-profile-component.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { VerificationSmsComponent } from './components/verification-sms/verification-sms.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

// AuthGuard
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Accessible à tous (pas besoin d'être connecté)
  { path: '', component: IndexComponent },
  
  // Pages accessibles uniquement aux utilisateurs connectés en tant que BORROWER
  { path: 'store', component: StoreComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'product', component: ProductComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'contract/:id', component: ContractComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'item', component: ItemComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'payment/:contractId', component: PaymentComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },

  // Authentification (login / register / reset password)
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
{ path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },

  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'verification-sms/:id', component: VerificationSmsComponent },

  // Pages accessibles à tous les utilisateurs connectés (peu importe le rôle)
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },

  // Pages réservées uniquement aux BORROWERS
  { path: 'profileBorrower', component: ProfileUserComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },

  // Pages réservées uniquement aux ADMINS
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'profile', component: AdminProfileComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'ListUser', component: UserListComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },

  // Page accès refusé
  { path: 'unauthorized', component: UnauthorizedComponent },

  // Si l'URL n'existe pas
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
