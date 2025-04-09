import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminProfileComponent } from './admin-profile-component/admin-profile-component.component';
import {  UserListComponent } from './user-list/user-list.component'; // Import the DashboardComponent
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';  // Import the ForgotPasswordComponent
import { ResetPasswordComponent } from './reset-password/reset-password.component';  // Import the ForgotPasswordComponent





const routes: Routes = [
  { path: 'login', component: LoginComponent }, 
  { path: 'ListUser', component: UserListComponent },     
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: AdminProfileComponent }, // Add the route for the sidebar test
  { path: 'dashboard', component: DashboardComponent }, // Add the route for the sidebar test
  { path: 'forgot-password', component: ForgotPasswordComponent }, // Add the route for forgot password page
  { path: 'reset-password', component: ResetPasswordComponent }, // Ajout de la route pour la réinitialisation


  // Ajoutez ici d'autres routes si nécessaire
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
