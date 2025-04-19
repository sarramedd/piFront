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
import { FeedbackListComponent } from './components/Feedback/feedback-list/feedback-list.component';
import { AddfeedbackComponent } from './components/Feedback/addfeedback/addfeedback.component';
import { AddFeedbackAdminComponent } from './components/FeedbackAdmin/add-feedback-admin/add-feedback-admin.component';
import { FeedbackListAdminComponent } from './components/FeedbackAdmin/feedback-list-admin/feedback-list-admin.component';
import { FeedbakListsignaleAdminComponent } from './components/FeedbackAdmin/feedbak-listsignale-admin/feedbak-listsignale-admin.component';

const routes: Routes = [
  // E-commerce
 { path: '', component: IndexComponent },
{ path: 'store', component: StoreComponent },
{ path: 'product', component: ProductComponent },

 { path: 'checkout', component: CheckoutComponent },
  { path: 'contract/:id', component: ContractComponent },
  { path: 'item', component: ItemComponent },
 { path: 'payment/:contractId', component: PaymentComponent },

  // Auth & Admin
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: AdminProfileComponent },
  { path: 'ListUser', component: UserListComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'listFeedback', component: FeedbackListComponent },
  { path: 'addFeedback', component: AddfeedbackComponent},
  { path: 'list-Feedback', component: FeedbackListAdminComponent},
  { path: 'add-Feedback', component: AddFeedbackAdminComponent},
  { path: 'reported-Feedbacks', component: FeedbakListsignaleAdminComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
