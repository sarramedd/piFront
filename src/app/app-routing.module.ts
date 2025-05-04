import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Pages e-commerce
import { HomeComponent } from './components/home/home.component';
import { StoreComponent } from './components/store/store.component';
import { ProductComponent } from './components/product/product.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { IndexComponent } from './components/index/index.component';
import { ContractComponent } from './components/contract/contract.component';
//import { ItemComponent } from './components/item/item.component';
import { PaymentComponent } from './components/payment/payment.component';
import { CommandeComponent } from './components/commande/commande.component';
import { CommandeListComponent } from './components/commande-list/commande-list.component';


// Pages utilisateur/admin

import { DashboardComponent } from './components/dashboard/dashboard.component';

// Auth
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminProfileComponent } from './components/admin-profile-component/admin-profile-component.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ContractAffichageComponent } from './components/contarctAffichage/contractAffichage.component';
import { ContractDetailsComponent } from './components/contractDetails/ContractDetails.component';
import { ContractSignComponent } from './components/borrowerSign/ContractSign.component';
import { VerificationSmsComponent } from './components/verification-sms/verification-sms.component';

// Items & Categories - BackOffice
import { AddItemFrontComponent } from './components/items/add-item-front/add-item-front.component';
import { DisplayItemsFrontComponent } from './components/items/display-items-front/display-items-front.component';
import { UpdateItemComponent } from './components/items/update-item/update-item.component';
import { CategoryListComponent } from './BackOffice/catrgory/category-list/category-list.component';
import { AddCategoryComponent } from './BackOffice/catrgory/add-category/add-category.component';
import { EditCategoryComponent } from './BackOffice/catrgory/edit-category/edit-category.component';
import { DiscountComponent } from './BackOffice/discount/discount.component';
import { ItemChartComponent } from './BackOffice/item-chart/item-chart.component';
import { AddItemComponent } from './BackOffice/items/add-item/add-item.component';
import { EditItemComponent } from './BackOffice/items/edit-item/edit-item.component';
import { ItemListComponent } from './BackOffice/items/item-list/item-list.component';
import { ListContratsComponent } from './components/list-contrats/list-contrats.component';

// Guard
import { AuthGuard } from './guards/auth.guard';
import { ProfileUserComponent } from './components/profile-user/profile-user.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { InvoiceDetailsComponent } from './components/facture/facture.Component';
import { MesCommandesComponent } from './components/mes-commandes/mes-commandes.component';
import { FeedbackListComponent } from './components/Feedback/feedback-list/feedback-list.component';
import { AddfeedbackComponent } from './components/Feedback/addfeedback/addfeedback.component';
import { UserSpecificFeedbacksComponent } from './components/Feedback/user-specific-feedbacks/user-specific-feedbacks.component';
import { FeedbackListAdminComponent } from './FeedbackAdmin/feedback-list-admin/feedback-list-admin.component';
import { FeedbacksChartComponent } from './FeedbackAdmin/feedbacks-chart/feedbacks-chart.component';
import { FeedbackListsignaleAdminComponent } from './FeedbackAdmin/feedback-listsignale-admin/feedback-listsignale-admin.component';
import { AnalyseChartComponent } from './FeedbackAdmin/analyse-chart/analyse-chart.component';

const routes: Routes = [
  // E-commerce
 { path: '', component: IndexComponent },
{ path: 'store', component: StoreComponent },
{ path: 'product', component: ProductComponent },

 { path: 'checkout', component: CheckoutComponent },
  { path: 'contract/:id', component: ContractComponent },
 { path: 'payment/:contractId', component: PaymentComponent },
 { path: 'my-contracts/:id', component: ContractAffichageComponent },
 { path: 'contract-details/:id', component: ContractDetailsComponent },
 { path: 'commandes/user/:userId', component: CommandeComponent },
 { path: 'contract-sign/:id', component: ContractSignComponent },
 { path: 'facture/:id', component:  InvoiceDetailsComponent},
 { path: 'listFeedback', component: FeedbackListComponent },
 { path: 'addFeedback', component: AddfeedbackComponent},
 { path: 'specificFeedback', component: UserSpecificFeedbacksComponent},

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
  { path: 'list-Feedback', component: FeedbackListAdminComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'feedbackschart', component: FeedbacksChartComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'reported-Feedbacks', component: FeedbackListsignaleAdminComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'analysechart', component: AnalyseChartComponent , canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },

  // Page accès refusé
  { path: 'unauthorized', component: UnauthorizedComponent },
  // Public
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verification-sms/:id', component: VerificationSmsComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  // E-commerce
  { path: 'store', component: StoreComponent },
  { path: 'product', component: ProductComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'contract/:id', component: ContractComponent },
  //{ path: 'item', component: ItemComponent },
  { path: 'commande/:id', component: CommandeComponent },
 // { path: 'commandes', component: CommandeListComponent },
  { path: 'commandes/item/:id', component: DisplayItemsFrontComponent },
  { path: 'payment/:contractId', component: PaymentComponent },
  { path: 'commandes/owner/:userId', component: MesCommandesComponent },


  // Items Front
  { path: 'displayItems', component: DisplayItemsFrontComponent },
  { path: 'addItemFront', component: AddItemFrontComponent },
  { path: 'updateItemFront/:id', component: UpdateItemComponent },

  // Profile Borrower
  { path: 'client', component: ProfileUserComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },


  // Dashboard (Admin)
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AdminProfileComponent },
      { path: 'discounts', component: DiscountComponent },
      { path: 'get-commandes', component: CommandeListComponent },
      { path: 'users', component: UserListComponent },

      // Category Management
      { path: 'listCategorie', component: CategoryListComponent },

      { path: 'addCategorie', component: AddCategoryComponent },
      { path: 'editCategorie/:id', component: EditCategoryComponent },

      // Item Management
      { path: 'listItems', component: ItemListComponent },
      { path: 'addItem', component: AddItemComponent },
      { path: 'editItem/:id', component: EditItemComponent },

      // Charts
      { path: 'pieChart', component: ItemChartComponent },
    
  // Profile Admin
  { path: 'profile', component: AdminProfileComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'ListContrat', component: ListContratsComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },


  // Fallback route
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
