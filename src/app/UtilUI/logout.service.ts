import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class Logout {
    httpHeaders: HttpHeaders;

    constructor(private http: HttpClient, private cookieService: CookieService) {
        this.httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.cookieService.get('userToken')}`,
        });
    }

    isLogin(): boolean {
        return !!this.cookieService.get('userToken');
    }

    logout(): void {
        this.cookieService.delete('userToken');
        const url = `${environment.baseUrl}/user/logout`;
        this.http.post<any[]>(url, { headers: this.httpHeaders });
    }
}