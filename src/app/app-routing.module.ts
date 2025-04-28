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

// Pages utilisateur/admin
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminProfileComponent } from './components/admin-profile-component/admin-profile-component.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ContractAffichageComponent } from './components/contarctAffichage/contractAffichage.component';
import { ContractDetailsComponent } from './components/contractDetails/ContractDetails.component';
import { CommandesComponent } from './components/commande/Commande.component';
import { ContractSignComponent } from './components/borrowerSign/ContractSign.component';
import { VerificationSmsComponent } from './components/verification-sms/verification-sms.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileUserComponent } from './components/profile-user/profile-user.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { InvoiceDetailsComponent } from './components/facture/facture.Component';

const routes: Routes = [
  // E-commerce
 { path: '', component: IndexComponent },
{ path: 'store', component: StoreComponent },
{ path: 'product', component: ProductComponent },

 { path: 'checkout', component: CheckoutComponent },
  { path: 'contract/:id', component: ContractComponent },
  { path: 'item', component: ItemComponent },
 { path: 'payment/:contractId', component: PaymentComponent },
 { path: 'my-contracts/:id', component: ContractAffichageComponent },
 { path: 'contract-details/:id', component: ContractDetailsComponent },
 { path: 'commandes/user/:userId', component: CommandesComponent },
 { path: 'contract-sign/:id', component: ContractSignComponent },
 { path: 'facture/:id', component:  InvoiceDetailsComponent},


  // Auth & Admin
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: AdminProfileComponent },
  { path: 'ListUser', component: UserListComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'verification-sms/:id', component: VerificationSmsComponent },
//Pages accessibles à tous les utilisateurs connectés (peu importe le rôle)
{ path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { expectedRoles: ['BORROWER', 'OWNER'] } },

  // Pages réservées uniquement aux BORROWERS
  { path: 'client', component: ProfileUserComponent, canActivate: [AuthGuard], data: { expectedRoles: ['BORROWER', 'OWNER'] } },
  // Pages réservées uniquement aux ADMINS
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'profile', component: AdminProfileComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'ListUser', component: UserListComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },

  // Page accès refusé
  { path: 'unauthorized', component: UnauthorizedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
