import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';

// Racine
import { AppComponent } from './app.component';

// Auth & Admin
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminProfileComponent } from './components/admin-profile-component/admin-profile-component.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

// E-commerce & Shared
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterBackComponent } from './components/footer/footer.component';
import { FooterComponent } from './components/shared/footer/footer.component';


import { SidebarComponent } from './components/shared/sidebar/sidebar.component'; 
import { SidebarBackComponent } from './components/sidebar/sidebar.component';
// Navbar
import { NavbarComponent } from './components/navbar/navbar.component';  // Ajoute cette ligne

import { HomeComponent } from './components/home/home.component';
import { StoreComponent } from './components/store/store.component';
import { ProductComponent } from './components/product/product.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { IndexComponent } from './components/index/index.component';
import { ContractComponent } from './components/contract/contract.component';
import { ItemComponent } from './components/item/item.component';
import { PaymentComponent } from './components/payment/payment.component';
import { CommonModule } from '@angular/common';
import { ContractAffichageComponent } from './components/contarctAffichage/contractAffichage.component';
import { ContractDetailsComponent } from './components/contractDetails/ContractDetails.component';
import { CommandesComponent } from './components/commande/Commande.component';
import { ContractSignComponent } from './components/borrowerSign/ContractSign.component';
import { ChatbotComponent } from './components/chatbot/chatbot.componenet';
import { ProfileUserComponent } from './components/profile-user/profile-user.component';
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { VerificationSmsComponent } from './components/verification-sms/verification-sms.component';
import { InvoiceDetailsComponent } from './components/facture/facture.Component';


@NgModule({
  declarations: [
    AppComponent,

    // Auth & Admin
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
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
    ItemComponent,
    PaymentComponent,
    InvoiceDetailsComponent,

    ContractAffichageComponent,
    ContractDetailsComponent,
    CommandesComponent,
    ContractSignComponent,
    ChatbotComponent,

    VerificationSmsComponent,
    ProfileUserComponent,
    HeaderUserComponent,
    UnauthorizedComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,

    RouterModule,
    CommonModule

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
