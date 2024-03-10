import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  providers: [CookieService],
})
export class AuthComponent {
  private router = inject(Router);
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  login() {
    // Perform login logic here
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    const requestBody = { email: this.email, password: this.password };

    this.http.post('http://localhost:3000/v1/user/login', requestBody)
      .subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          // Handle successful login response here
          //sessionStorage.setItem('userToken', response.token);
          // Set token in cookies
          this.cookieService.set('userToken', response.token, { expires: 2, sameSite: 'Lax' });

          this.router.navigate(['/']);

        },
        error: (error: any) => {
          console.error('Login error:', error);
          // Handle login error here
        }
      });

  }
}
