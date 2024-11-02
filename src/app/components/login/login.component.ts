import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = null;

    const payload = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost:3000/auth/login', payload).subscribe({
      next: (data) => {
        // Guardar el token en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.user._id);

        // Redirigir a una página de inicio o dashboard
        this.router.navigate(['/my-tasks']);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `${err.error.mensaje}`;
        this.isLoading = false;
      }
    });
  }
}
