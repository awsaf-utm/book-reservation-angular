import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2'
import { AvailableBookBL } from '../../BL/AvailableBookBL.service';

@Component({
  selector: 'app-available-book',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './available-book.component.html',
  styleUrls: ['./available-book.component.css'],
  providers: [AvailableBookBL]
})
export class AvailableBookComponent implements OnInit {
  //btnAdd_Text: string = 'Add';
  //showDataForm: boolean = false; // Initially hide the add available book form
  //selectedAvailableBook: any; // Property to store the selected available book for update

  // Search query
  txtSearch: string = '';
  searchTerms: string = '';

  // Pagination
  currentPage: number = 1;
  maxPagesNumberToShow = 10;
  pageSize: number = environment.totalRecordsPerPage;

  // Available Books
  availableBooks: any[] = [];
  filteredAvailableBooks: any[] = [];
  filteredPagingAvailableBooks: any[] = [];

  // // Available Book to be added or updated
  // txtAvailableBookName: string = '';
  // txtAvailableBookDescription: string = '';


  constructor(private availableBookBL: AvailableBookBL) {

  }

  ngOnInit(): void {
    this.getAvailableBooks();
  }

  //#region Database functions
  getAvailableBooks(): void {
    this.availableBookBL.getAvailableBooks()
      .subscribe({
        next: (response: any) => {
          this.availableBooks = response.availableBooks.map((book: any) => ({ ...book, isSelected: false }));
          this.getFilteredPagingAvailableBooks;
        },
        error: (error: any) => {
          console.error('Error on getAvailableBooks: ', error);
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

  //#region Display available book
  // Function to filter and paginate available books based on the search query
  get getFilteredPagingAvailableBooks(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredAvailableBooks = this.availableBooks
      .filter(category => category.bookInfo.bookTitle.toLowerCase().includes(this.searchTerms))
    this.filteredPagingAvailableBooks = this.filteredAvailableBooks
      .slice(startIndex, endIndex);
    return this.filteredPagingAvailableBooks;
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
    return Math.ceil(this.filteredAvailableBooks.length / this.pageSize);
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

    // Sort the available books based on the selected column and direction
    this.availableBooks.sort((a, b) => {
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
