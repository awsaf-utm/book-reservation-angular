import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class BookInfoBL {
    httpHeaders: HttpHeaders;

    constructor(private http: HttpClient, private cookieService: CookieService) {
        this.httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.cookieService.get('userToken')}`,
        });
    }

    getBookInfos(): any {
        const url = `${environment.baseUrl}/book-info?page=1&pageSize=100&sortBy=bookInfo&sortOrder=asc`;
        return this.http.get<any[]>(url, { headers: this.httpHeaders });
    }

    addBookInfo(requestBody: any): any {
        const url = `${environment.baseUrl}/book-info`;
        return this.http.post<any>(url, requestBody, { headers: this.httpHeaders });
    }

    updateBookInfo(id: string, requestBody: any): any {
        const url = `${environment.baseUrl}/book-info/${id}`
        return this.http.put<any>(url, requestBody, { headers: this.httpHeaders });
    }

    deleteBookInfo(id: string): any {
        const url = `${environment.baseUrl}/book-info/${id}`;
        return this.http.delete<any>(url, { headers: this.httpHeaders });

    }

    deleteBulkBookInfo(ids: string[]): any {
        const url = `${environment.baseUrl}/book-info/bulk-delete`;
        return this.http.delete<any>(url, {
            headers: this.httpHeaders,
            body: ids
        });
    }
}