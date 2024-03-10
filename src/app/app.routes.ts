import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './UtilUI/auth/auth.component';
import { RegisterComponent } from './UtilUI/register/register.component';
import { NotFoundComponent } from './UtilUI/not-found/not-found.component';
import { authGuard } from './auth.guard';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { DashboardComponent } from './UtilUI/dashboard/dashboard.component';
import { BookCategoryComponent } from './UI/book-category/book-category.component';
import { BookInfoComponent } from './UI/book-info/book-info.component';
import { BookReservationComponent } from './UI/book-reservation/book-reservation.component';
import { AvailableBookComponent } from './UI/available-book/available-book.component';
import { ReservedBookComponent } from './UI/reserved-book/reserved-book.component';


export const routes: Routes = [
    // { path: '', redirectTo: 'dashboard', pathMatch: 'full', title: 'Home' },
    // { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
    // { path: '', component: DashboardComponent, title: 'Home', canActivate: [authGuard] },
    { path: '', component: BookReservationComponent, title: 'Home', canActivate: [authGuard] },
    { path: 'auth', component: AuthComponent, title: 'Login' },
    { path: 'register', component: RegisterComponent, title: 'Register' },
    { path: 'book-category', component: BookCategoryComponent, title: 'Book Category', canActivate: [authGuard] },
    { path: 'book-info', component: BookInfoComponent, title: 'Book Info', canActivate: [authGuard] },
    { path: 'book-reservation/available-book', component: AvailableBookComponent, title: 'Available Book', canActivate: [authGuard] },
    { path: 'book-reservation/reserved-book', component: ReservedBookComponent, title: 'Reserved Book', canActivate: [authGuard] },
    { path: 'book-reservation', component: BookReservationComponent, title: 'Book Reservation', canActivate: [authGuard] },
    { path: '**', component: NotFoundComponent, title: 'Page Not Found' }
];

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule],
    providers: [
        provideHttpClient() // Configure HttpClient to use fetch
    ],
})
export class AppRoutingModule { }