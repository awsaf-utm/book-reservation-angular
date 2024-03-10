import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient) { }

  register() {
    const requestBody = { name: this.name, email: this.email, password: this.password };
    
    this.http.post<any>('http://localhost:3000/v1/user/register', requestBody)
      .subscribe({
        next: (response: any) => {
          console.log('Registration successful:', response);
          // Handle successful registration response here
        },
        error: (error: any) => {
          console.error('Registration error:', error);
          // Handle registration error here
        }
      });
  }
}

