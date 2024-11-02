import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  register() {
    this.loading = true;
    this.errorMessage = '';

    const payload = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:3000/auth/registro', payload)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = `${err.error.mensaje}`;
          console.error(err);
        }
      });
  }
}
