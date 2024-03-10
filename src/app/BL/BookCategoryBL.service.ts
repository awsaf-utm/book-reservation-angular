import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class BookCategoryBL {
    httpHeaders: HttpHeaders;

    constructor(private http: HttpClient, private cookieService: CookieService) {
        this.httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.cookieService.get('userToken')}`,
        });
    }

    getBookCategories(): any {
        const url = `${environment.baseUrl}/book-category?page=1&pageSize=100&sortBy=bookCategory&sortOrder=asc`;
        return this.http.get<any[]>(url, { headers: this.httpHeaders });
    }

    addBookCategory(requestBody: any): any {
        const url = `${environment.baseUrl}/book-category`;
        return this.http.post<any>(url, requestBody, { headers: this.httpHeaders });
    }

    updateBookCategory(id: string, requestBody: any): any {
        const url = `${environment.baseUrl}/book-category/${id}`
        return this.http.put<any>(url, requestBody, { headers: this.httpHeaders });
    }

    deleteBookCategory(id: string): any {
        const url = `${environment.baseUrl}/book-category/${id}`;
        return this.http.delete<any>(url, { headers: this.httpHeaders });

    }

    deleteBulkBookCategory(ids: string[]): any {
        const url = `${environment.baseUrl}/book-category/bulk-delete`;
        return this.http.delete<any>(url, {
            headers: this.httpHeaders,
            body: ids
        });
    }
}