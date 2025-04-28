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

// Auth
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileUserComponent } from './components/profile-user/profile-user.component';
import { AdminProfileComponent } from './components/admin-profile-component/admin-profile-component.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { VerificationSmsComponent } from './components/verification-sms/verification-sms.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

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

// Guard
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
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
  { path: 'commandes', component: CommandeListComponent },
  { path: 'commandes/item/:id', component: DisplayItemsFrontComponent },
  { path: 'payment/:contractId', component: PaymentComponent },

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

  // Fallback route
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
