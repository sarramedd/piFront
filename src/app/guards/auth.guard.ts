import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.currentUser$.pipe(
      take(1),
      map(currentUser => {
        if (currentUser) {
          // Vérifier si la route nécessite un rôle spécifique
          if (route.data['roles'] && !route.data['roles'].includes(currentUser.role)) {
            // Rôle non autorisé, rediriger vers la page d'accueil
            this.router.navigate(['/']);
            return false;
          }

          // Utilisateur authentifié et autorisé
          return true;
        }

        // Non authentifié, rediriger vers la page de connexion
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
      })
    );
  }
} 