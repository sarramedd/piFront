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
import { FooterComponent } from './components/shared/footer/footer.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';

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
import { DisplayItemsFrontComponent } from './components/items/display-items-front/display-items-front.component';
import { AddItemFrontComponent } from './components/items/add-item-front/add-item-front.component';
import { UpdateItemComponent } from './components/items/update-item/update-item.component';
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from 'material.module';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AddCategoryComponent } from './BackOffice/catrgory/add-category/add-category.component';
import { CategoryListComponent } from './BackOffice/catrgory/category-list/category-list.component';
import { EditCategoryComponent } from './BackOffice/catrgory/edit-category/edit-category.component';
import { ItemChartComponent } from './BackOffice/item-chart/item-chart.component';
import { AddItemComponent } from './BackOffice/items/add-item/add-item.component';
import { EditItemComponent } from './BackOffice/items/edit-item/edit-item.component';
import { ItemListComponent } from './BackOffice/items/item-list/item-list.component';
import { ChartModule } from 'primeng/chart';
import { FeedbackListComponent } from './components/Feedback/feedback-list/feedback-list.component';
import { AddfeedbackComponent } from './components/Feedback/addfeedback/addfeedback.component';
import { AddFeedbackAdminComponent } from './FeedbackAdmin/add-feedback-admin/add-feedback-admin.component';
import { FeedbackListsignaleAdminComponent } from './FeedbackAdmin/feedback-listsignale-admin/feedback-listsignale-admin.component';
import { FeedbackListAdminComponent } from './FeedbackAdmin/feedback-list-admin/feedback-list-admin.component';
import { FeedbacksChartComponent } from './FeedbackAdmin/feedbacks-chart/feedbacks-chart.component';



@NgModule({
  declarations: [
    AppComponent,

    // Auth & Admin
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    AdminProfileComponent,
    UserListComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,

    // Shared & Layout
    HeaderComponent,
    FooterComponent,
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
    FeedbackListComponent,
    AddfeedbackComponent,
    AddFeedbackAdminComponent,
    FeedbackListAdminComponent,
    FeedbackListsignaleAdminComponent,
    FeedbacksChartComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
