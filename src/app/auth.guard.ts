import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    
    if (token) {
      return true; // Si el token existe, permite la navegación
    } else {
      this.router.navigate(['/login']); // Si no existe el token, redirige al login
      return false;
    }
  }
}
