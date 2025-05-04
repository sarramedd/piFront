
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ChartModule } from 'primeng/chart';
import { InvoiceDetailsComponent } from './components/facture/facture.Component';
import { MaterialModule } from 'material.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CommandeComponent } from './components/commande/commande.component';
import { CommandeListComponent } from './components/commande-list/commande-list.component';
import { DiscountComponent } from './BackOffice/discount/discount.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { AdminProfileComponent } from './components/admin-profile-component/admin-profile-component.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FooterBackComponent } from './components/footer/footer.component';
import { SidebarBackComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { StoreComponent } from './components/store/store.component';
import { ProductComponent } from './components/product/product.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { IndexComponent } from './components/index/index.component';
import { ContractComponent } from './components/contract/contract.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ContractAffichageComponent } from './components/contarctAffichage/contractAffichage.component';
import { ContractDetailsComponent } from './components/contractDetails/ContractDetails.component';
import { ContractSignComponent } from './components/borrowerSign/ContractSign.component';
import { ChatbotComponent } from './components/chatbot/chatbot.componenet';
import { DisplayItemsFrontComponent } from './components/items/display-items-front/display-items-front.component';
import { AddItemFrontComponent } from './components/items/add-item-front/add-item-front.component';
import { UpdateItemComponent } from './components/items/update-item/update-item.component';
import { AddCategoryComponent } from './BackOffice/catrgory/add-category/add-category.component';
import { CategoryListComponent } from './BackOffice/catrgory/category-list/category-list.component';
import { EditCategoryComponent } from './BackOffice/catrgory/edit-category/edit-category.component';
import { ItemListComponent } from './BackOffice/items/item-list/item-list.component';
import { EditItemComponent } from './BackOffice/items/edit-item/edit-item.component';
import { AddItemComponent } from './BackOffice/items/add-item/add-item.component';
import { ItemChartComponent } from './BackOffice/item-chart/item-chart.component';
import { VerificationSmsComponent } from './components/verification-sms/verification-sms.component';
import { ProfileUserComponent } from './components/profile-user/profile-user.component';
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './services/auth.interceptor';
import { MesCommandesComponent } from './components/mes-commandes/mes-commandes.component';
import { ListContratsComponent } from './components/list-contrats/list-contrats.component';
import { FeedbackListComponent } from './components/Feedback/feedback-list/feedback-list.component';
import { AddfeedbackComponent } from './components/Feedback/addfeedback/addfeedback.component';
import { AddFeedbackAdminComponent } from './FeedbackAdmin/add-feedback-admin/add-feedback-admin.component';
import { FeedbackListAdminComponent } from './FeedbackAdmin/feedback-list-admin/feedback-list-admin.component';
import { FeedbackListsignaleAdminComponent } from './FeedbackAdmin/feedback-listsignale-admin/feedback-listsignale-admin.component';
import { FeedbacksChartComponent } from './FeedbackAdmin/feedbacks-chart/feedbacks-chart.component';
import { UserSpecificFeedbacksComponent } from './components/Feedback/user-specific-feedbacks/user-specific-feedbacks.component';
import { AnalyseChartComponent } from './FeedbackAdmin/analyse-chart/analyse-chart.component';



@NgModule({
  declarations: [
    AppComponent ,
    CommandeComponent,
    CommandeListComponent,
    DiscountComponent,
    // Auth & Admin
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    AdminProfileComponent,
    UserListComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    FooterBackComponent,
    SidebarBackComponent,

    // Shared & Layout
    HeaderComponent,
   // FooterComponent,
    SidebarComponent,
    NavbarComponent,  // Ajoute NavbarComponent ici

    // E-commerce
    HomeComponent,
    StoreComponent,
    ProductComponent,
    CheckoutComponent,
    IndexComponent,
    ContractComponent,
    PaymentComponent,
    InvoiceDetailsComponent,
    
    ContractAffichageComponent,
    ContractDetailsComponent,
    CommandeListComponent,
    ContractSignComponent,
    ChatbotComponent,


    //Items
    // npm install primeng@16.3.1 chart.js --save
    //npm i angular-animations
    //ng add @angular/material
    //npm install primeicons --save
    //kdfiljkihdfsk@erkHUG5

    DisplayItemsFrontComponent,
    AddItemFrontComponent,
    UpdateItemComponent,
    // BackOffice
    AddCategoryComponent,
    CategoryListComponent,
    EditCategoryComponent,
    ItemListComponent,
    EditItemComponent,
    AddItemComponent,
    ItemChartComponent,



    VerificationSmsComponent,

    ProfileUserComponent,
    HeaderUserComponent,
    UnauthorizedComponent,
    DashboardComponent,
    MesCommandesComponent,
    ListContratsComponent,
    FeedbackListComponent,
    AddfeedbackComponent,
    AddFeedbackAdminComponent,
    FeedbackListAdminComponent,
    FeedbackListsignaleAdminComponent,
    FeedbacksChartComponent,
    UserSpecificFeedbacksComponent,
    AnalyseChartComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,

    RouterModule,
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ChartModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],  
  bootstrap: [AppComponent]
})
export class AppModule { }