import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token'); // Cambia 'token' por el nombre que estés usando para guardar el token
    this.router.navigate(['/login']); // Redirige a la ruta del login
  }
}
