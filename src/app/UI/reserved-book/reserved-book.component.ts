import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReservedBookBL } from '../../BL/ReservedBookBL.service';

@Component({
  selector: 'app-reserved-book',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './reserved-book.component.html',
  styleUrls: ['./reserved-book.component.css'],
  providers: [ReservedBookBL]
})
export class ReservedBookComponent implements OnInit {
  // Search query
  txtSearch: string = '';
  searchTerms: string = '';

  // Pagination
  currentPage: number = 1;
  maxPagesNumberToShow = 10;
  pageSize: number = environment.totalRecordsPerPage;

  // Reserved Books
  reservedBooks: any[] = [];
  filteredReservedBooks: any[] = [];
  filteredPagingReservedBooks: any[] = [];


  constructor(private reservedBookBL: ReservedBookBL) {

  }

  ngOnInit(): void {
    this.getReservedBooks();
  }

  //#region Database functions
  getReservedBooks(): void {
    this.reservedBookBL.getReservedBooks()
      .subscribe({
        next: (response: any) => {
          this.reservedBooks = response.reservedBooks.map((book: any) => ({ ...book, isSelected: false }));
          this.getFilteredPagingReservedBooks;
        },
        error: (error: any) => {
          console.error('Error on getReservedBooks: ', error);
        }
      });
  }

  // #endregion

  //#region Controls events
  btnSearch_Click(): void {
    this.searchTerms = this.txtSearch.toLowerCase();
  }

  btnClearSearch_Click() {
    this.txtSearch = '';
    this.searchTerms = this.txtSearch;
  }

  //#endregion

  //#region Display reserved book
  // Function to filter and paginate reserved books based on the search query
  get getFilteredPagingReservedBooks(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredReservedBooks = this.reservedBooks
      .filter(category => category.bookInfo.bookTitle.toLowerCase().includes(this.searchTerms))
    this.filteredPagingReservedBooks = this.filteredReservedBooks
      .slice(startIndex, endIndex);
    return this.filteredPagingReservedBooks;
  }

  //#endregion

  //#region Pagination methods
  changePage(page: number) {
    this.currentPage = page;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredReservedBooks.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getDisplayedPages(): number[] {
    const displayedPages: number[] = [];
    const halfMaxPagesToShow = Math.floor(this.maxPagesNumberToShow / 2);
    let startPage = Math.max(1, this.currentPage - halfMaxPagesToShow);
    const endPage = Math.min(this.totalPages, startPage + this.maxPagesNumberToShow - 1);

    // Adjust startPage if needed to ensure maxPagesToShow pages are displayed
    if (endPage - startPage + 1 < this.maxPagesNumberToShow) {
      startPage = Math.max(1, endPage - this.maxPagesNumberToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      displayedPages.push(i);
    }

    return displayedPages;
  }

  firstPage() {
    this.currentPage = 1;
  }

  lastPage() {
    this.currentPage = this.totalPages;
  }

  //#endregion

  //#region Sorting by column
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  // Method to handle sorting based on column click
  sortTable(column: string): void {
    if (this.sortColumn === column) {
      // If the same column is clicked again, toggle the sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If a new column is clicked, set it as the sort column and reset direction to 'asc'
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Sort the reserved books based on the selected column and direction
    this.reservedBooks.sort((a, b) => {
      const valueA = a[column].toLowerCase();
      const valueB = b[column].toLowerCase();
      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Method to get the sort icon based on the current sort column and direction
  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'bi-caret-up-fill' : 'bi-caret-down-fill';
    }
    return 'none'; // Default icon when column is not sorted
  }

  //#endregion

}
