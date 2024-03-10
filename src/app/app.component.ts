import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthComponent } from "./UtilUI/auth/auth.component";
import { AppHeaderComponent } from './UtilUI/app-header/app-header.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, RouterLink, HttpClientModule, AppHeaderComponent, AuthComponent]
})
export class AppComponent {
  title = 'book-reservation-angular';
}


//hamburger menu