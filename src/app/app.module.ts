import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';  // Importez le module de routage
import { LoginComponent } from './login/login.component';  // Assurez-vous d'importer votre composant Login
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Importez FormsModule pour utiliser ngModel
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';  // Import ReactiveFormsModule
import { HttpClientModule } from '@angular/common/http';
import { UserListComponent } from './user-list/user-list.component';
import { AdminProfileComponent } from './admin-profile-component/admin-profile-component.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    SidebarComponent,
    DashboardComponent,
    NavbarComponent,
    FooterComponent,
    UserListComponent,
    AdminProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,    // Assurez-vous d'importer RouterModule ici
    FormsModule      // Importez FormsModule pour lier ngModel dans vos formulaires
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
