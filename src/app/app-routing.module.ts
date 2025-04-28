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

// Items & Category
import { AddItemFrontComponent } from './components/items/add-item-front/add-item-front.component';
import { DisplayItemsFrontComponent } from './components/items/display-items-front/display-items-front.component';
import { UpdateItemComponent } from './components/items/update-item/update-item.component';
import { CategoryListComponent } from './BackOffice/catrgory/category-list/category-list.component';
import { AddCategoryComponent } from './BackOffice/catrgory/add-category/add-category.component';
import { EditCategoryComponent } from './BackOffice/catrgory/edit-category/edit-category.component';
import { ItemChartComponent } from './BackOffice/item-chart/item-chart.component';
import { AddItemComponent } from './BackOffice/items/add-item/add-item.component';
import { EditItemComponent } from './BackOffice/items/edit-item/edit-item.component';
import { ItemListComponent } from './BackOffice/items/item-list/item-list.component';

// Guard
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Accessible à tous
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  // Pages publiques Front
  { path: 'displayItems', component: DisplayItemsFrontComponent },
  { path: 'addItemFront', component: AddItemFrontComponent },
  { path: 'updateItemFront/:id', component: UpdateItemComponent },

  // Pages accessibles aux utilisateurs connectés (BORROWER)
  { path: 'store', component: StoreComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'product', component: ProductComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'contract/:id', component: ContractComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'item', component: ItemComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'payment/:contractId', component: PaymentComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'profileBorrower', component: ProfileUserComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },

  // Pages réservées aux admins
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' },
    children: [
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
    ]
  },
  { path: 'profile', component: AdminProfileComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'ListUser', component: UserListComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'verification-sms/:id', component: VerificationSmsComponent },

  // Fallback (page 404)
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
