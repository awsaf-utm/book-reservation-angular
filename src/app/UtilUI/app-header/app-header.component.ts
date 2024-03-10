import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logout } from '../logout.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css',
  providers: [Logout]
})
export class AppHeaderComponent {
  constructor(private logoutService: Logout) {

  }

  isLogin() {
    return this.logoutService.isLogin();
  }

  logout() {
    this.logoutService.logout();

    localStorage.clear();
    window.location.reload();
  }
}
