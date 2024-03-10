import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class AvailableBookBL {
    httpHeaders: HttpHeaders;

    constructor(private http: HttpClient, private cookieService: CookieService) {
        this.httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.cookieService.get('userToken')}`,
        });
    }

    getAvailableBooks(): any {
        const url = `${environment.baseUrl}/book-reservation/available-book?page=1&pageSize=100&sortBy=availableBook&sortOrder=asc`;
        return this.http.get<any[]>(url, { headers: this.httpHeaders });
    }

    addAvailableBook(requestBody: any): any {
        const url = `${environment.baseUrl}/book-reservation/available-book`;
        return this.http.post<any>(url, requestBody, { headers: this.httpHeaders });
    }

    updateAvailableBook(id: string, requestBody: any): any {
        const url = `${environment.baseUrl}/available-book/${id}`
        return this.http.put<any>(url, requestBody, { headers: this.httpHeaders });
    }

    deleteAvailableBook(id: string): any {
        const url = `${environment.baseUrl}/available-book/${id}`;
        return this.http.delete<any>(url, { headers: this.httpHeaders });

    }

    deleteBulkAvailableBook(ids: string[]): any {
        const url = `${environment.baseUrl}/available-book/bulk-delete`;
        return this.http.delete<any>(url, {
            headers: this.httpHeaders,
            body: ids
        });
    }
}