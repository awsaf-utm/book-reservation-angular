import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class BookReservationBL {
    httpHeaders: HttpHeaders;

    constructor(private http: HttpClient, private cookieService: CookieService) {
        this.httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.cookieService.get('userToken')}`,
        });
    }

    getBookReservations(): any {
        const url = `${environment.baseUrl}/book-reservation?page=1&pageSize=100&sortBy=bookReservation&sortOrder=asc`;
        return this.http.get<any[]>(url, { headers: this.httpHeaders });
    }

    addBookReservation(requestBody: any): any {
        const url = `${environment.baseUrl}/book-reservation`;
        return this.http.post<any>(url, requestBody, { headers: this.httpHeaders });
    }

    updateBookReservation(id: string, requestBody: any): any {
        console.log("🚀 ~ file: BookReservationBL.service.ts:30 ~ BookReservationBL ~ updateBookReservation ~ requestBody:", requestBody)
        const url = `${environment.baseUrl}/book-reservation/${id}`
        return this.http.put<any>(url, requestBody, { headers: this.httpHeaders });
    }

    deleteBookReservation(id: string): any {
        const url = `${environment.baseUrl}/book-reservation/${id}`;
        return this.http.delete<any>(url, { headers: this.httpHeaders });

    }

    deleteBulkBookReservation(ids: string[]): any {
        const url = `${environment.baseUrl}/book-reservation/bulk-delete`;
        return this.http.delete<any>(url, {
            headers: this.httpHeaders,
            body: ids
        });
    }
}