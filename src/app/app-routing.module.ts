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
import { VerificationSmsComponent } from './components/verification-sms/verification-sms.component';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminProfileComponent } from './components/admin-profile-component/admin-profile-component.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
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

const routes: Routes = [
  // E-commerce

  {
    path: '', component: IndexComponent,
    children: [
      { path: 'displayItems', component: DisplayItemsFrontComponent },
      { path: 'addItemFront', component: AddItemFrontComponent },
      { path: 'updateItemFront/:id', component: UpdateItemComponent },
      { path: 'store', component: StoreComponent },
      { path: 'product', component: ProductComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'contract/:id', component: ContractComponent },
      { path: 'item', component: ItemComponent },
      { path: 'payment/:contractId', component: PaymentComponent },]
  },


 { path: '', component: IndexComponent },
{ path: 'store', component: StoreComponent },
{ path: 'product', component: ProductComponent },

 { path: 'checkout', component: CheckoutComponent },
  { path: 'contract/:id', component: ContractComponent },
  { path: 'item', component: ItemComponent },
 { path: 'payment/:contractId', component: PaymentComponent },


  // Auth & Admin
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      // *****    Category Routes   ***** //
      
      { path: "listCategorie", component: CategoryListComponent },
      { path: "addCategorie", component: AddCategoryComponent },
      { path: "editCategorie/:id", component: EditCategoryComponent },
      { path: "pieChart", component: ItemChartComponent },
      // *****    Item Routes   ***** //
      { path: "listItems", component: ItemListComponent },
      { path: "addItem", component: AddItemComponent },
      { path: "editItem/:id", component: EditItemComponent },
    ]
  },
  { path: 'profile', component: AdminProfileComponent },
  { path: 'ListUser', component: UserListComponent },
  { path: 'verification-sms/:id', component: VerificationSmsComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
