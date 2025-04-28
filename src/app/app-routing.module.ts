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
import { FeedbackListComponent } from './components/Feedback/feedback-list/feedback-list.component';
import { AddfeedbackComponent } from './components/Feedback/addfeedback/addfeedback.component';
import { FeedbackListAdminComponent } from './FeedbackAdmin/feedback-list-admin/feedback-list-admin.component';
import { AddFeedbackAdminComponent } from './FeedbackAdmin/add-feedback-admin/add-feedback-admin.component';
import { FeedbackListsignaleAdminComponent } from './FeedbackAdmin/feedback-listsignale-admin/feedback-listsignale-admin.component';
import { FeedbacksChartComponent } from './FeedbackAdmin/feedbacks-chart/feedbacks-chart.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

// AuthGuard
import { AuthGuard } from './guards/auth.guard';
import { AnalyseChartComponent } from './FeedbackAdmin/analyse-chart/analyse-chart.component';
import { UserSpecificFeedbacksComponent } from './components/Feedback/user-specific-feedbacks/user-specific-feedbacks.component';



const routes: Routes = [
  // E-commerce
 /* {
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
      { path: 'payment/:contractId', component: PaymentComponent },
      { path: 'listFeedback', component: FeedbackListComponent },
      { path: 'addFeedback', component: AddfeedbackComponent},]
  },
*/
 /*{ path: '', component: IndexComponent },
{ path: 'store', component: StoreComponent },
{ path: 'product', component: ProductComponent },

 { path: 'checkout', component: CheckoutComponent },
  { path: 'contract/:id', component: ContractComponent },
  { path: 'item', component: ItemComponent },
 { path: 'payment/:contractId', component: PaymentComponent },*/


  // Auth & Admin
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent,
    children:[
      
    ]
   },
  { path: 'register', component: RegisterComponent },
 /* {
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
      // *****    Feedbacks Routes   ***** //
      { path: 'list-Feedback', component: FeedbackListAdminComponent},
      { path: 'feedbackschart', component: FeedbacksChartComponent},
      { path: 'reported-Feedbacks', component: FeedbackListsignaleAdminComponent},
 
    ]
  },*/
  { path: 'profile', component: AdminProfileComponent },
  { path: 'ListUser', component: UserListComponent },
  { path: 'verification-sms/:id', component: VerificationSmsComponent },
  // Accessible à tous (pas besoin d'être connecté)
  { path: '', component: IndexComponent },
  
  // Pages accessibles uniquement aux utilisateurs connectés en tant que BORROWER
  { path: 'store', component: StoreComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'product', component: ProductComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'contract/:id', component: ContractComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'item', component: ItemComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'payment/:contractId', component: PaymentComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },
  { path: 'listFeedback', component: FeedbackListComponent },
  { path: 'addFeedback', component: AddfeedbackComponent},
  { path: 'specificFeedback', component: UserSpecificFeedbacksComponent},

  // Authentification (login / register / reset password)
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
{ path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },

  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  
  
  { path: 'add-Feedback', component: AddFeedbackAdminComponent},
 
  { path: 'verification-sms/:id', component: VerificationSmsComponent },

  // Pages accessibles à tous les utilisateurs connectés (peu importe le rôle)
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },

  // Pages réservées uniquement aux BORROWERS
  { path: 'profileBorrower', component: ProfileUserComponent, canActivate: [AuthGuard], data: { expectedRole: 'BORROWER' } },

  // Pages réservées uniquement aux ADMINS
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' }},
    
      { path: 'list-Feedback', component: FeedbackListAdminComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
      { path: 'feedbackschart', component: FeedbacksChartComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
      { path: 'reported-Feedbacks', component: FeedbackListsignaleAdminComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
      { path: 'analysechart', component: AnalyseChartComponent , canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
 
  { path: 'profile', component: AdminProfileComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'ListUser', component: UserListComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'list-Feedback', component: FeedbackListAdminComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'feedbackschart', component: FeedbacksChartComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' }},
  { path: 'reported-Feedbacks', component: FeedbackListsignaleAdminComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' }},
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
