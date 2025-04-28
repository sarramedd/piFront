import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service'; // ajuste si nécessaire

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const isLoggedIn = this.authService.isLoggedIn();
    const expectedRole = route.data['expectedRole'];

    // Cas particulier : routes login/register => rediriger si déjà connecté
    if (state.url === '/login' || state.url === '/register') {
      if (isLoggedIn) {
        const role = this.authService.getRoleFromToken();
        if (role === 'ADMIN') {
          return this.router.parseUrl('/dashboard');
        } else if (role === 'BORROWER') {
          return this.router.parseUrl('/home');
        }
      }
      return true; // pas connecté, il peut aller sur login/register
    }

    // Cas général : vérifier si connecté
    if (!isLoggedIn) {
      return this.router.parseUrl('/login');
    }

    // Cas : rôle spécifique requis
    if (expectedRole) {
      const userRole = this.authService.getRoleFromToken();
      if (userRole !== expectedRole) {
        return this.router.parseUrl('/unauthorized');
      }
    }

    return true; // tout est OK
  }
}
