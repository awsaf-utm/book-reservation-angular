import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class ReservedBookBL {
    httpHeaders: HttpHeaders;

    constructor(private http: HttpClient, private cookieService: CookieService) {
        this.httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.cookieService.get('userToken')}`,
        });
    }

    getReservedBooks(): any {
        const url = `${environment.baseUrl}/book-reservation/reserved-book?page=1&pageSize=100&sortBy=reservedBook&sortOrder=asc`;
        return this.http.get<any[]>(url, { headers: this.httpHeaders });
    }

    addReservedBook(requestBody: any): any {
        const url = `${environment.baseUrl}/reserved-book`;
        return this.http.post<any>(url, requestBody, { headers: this.httpHeaders });
    }

    updateReservedBook(id: string, requestBody: any): any {
        const url = `${environment.baseUrl}/reserved-book/${id}`
        return this.http.put<any>(url, requestBody, { headers: this.httpHeaders });
    }

    deleteReservedBook(id: string): any {
        const url = `${environment.baseUrl}/reserved-book/${id}`;
        return this.http.delete<any>(url, { headers: this.httpHeaders });

    }

    deleteBulkReservedBook(ids: string[]): any {
        const url = `${environment.baseUrl}/reserved-book/bulk-delete`;
        return this.http.delete<any>(url, {
            headers: this.httpHeaders,
            body: ids
        });
    }
}