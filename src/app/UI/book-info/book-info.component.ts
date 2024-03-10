import { BookCategoryBL } from './../../BL/BookCategoryBL.service';
import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2'
import { BookInfoBL } from '../../BL/BookInfoBL.service';

@Component({
  selector: 'app-book-info',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.css'],
  providers: [BookInfoBL, BookCategoryBL]
})
export class BookInfoComponent implements OnInit {
  btnAdd_Text: string = 'Add';
  showDataForm: boolean = false; // Initially hide the add book info form
  selectedBookInfo: any; // Property to store the selected book info for update

  // Search query
  txtSearch: string = '';
  searchTerms: string = '';

  // Pagination
  currentPage: number = 1;
  maxPagesNumberToShow = 10;
  pageSize: number = environment.totalRecordsPerPage;

  // Book Infos
  bookInfos: any[] = [];
  filteredBookInfos: any[] = [];
  filteredPagingBookInfos: any[] = [];

  // Book Info to be added or updated
  txtBookTitle: string = '';
  txtAuthor: string = '';
  txtISBN: string = '';
  txtPublisher: string = '';
  txtPublishDate: string = '';
  txtLanguage: string = '';
  txtStock: string = '';
  txtNote: string = '';

  // Book Categories
  bookCategories: any[] = [];
  cboBookCategory: any;


  constructor(private bookInfoBL: BookInfoBL, private bookCategoryBL: BookCategoryBL) {

  }

  ngOnInit(): void {
    this.getBookInfos();
    this.getBookCategories();
  }

  //#region Database functions
  getBookInfos(): void {
    this.bookInfoBL.getBookInfos()
      .subscribe({
        next: (response: any) => {
          this.bookInfos = response.bookInfos.bookInfos.map((category: any) => ({ ...category, isSelected: false }));
          this.getFilteredPagingBookInfos;
        },
        error: (error: any) => {
          console.error('Error on getBookInfos: ', error);
        }
      });
  }

  addBookInfo(): void {
    // // Create a new book info object
    // const requestBody = {
    //   bookTitle: this.txtBookTitle,
    //   author: this.txtAuthor,
    //   ISBN: this.txtISBN,
    //   publisher: this.txtPublisher,
    //   publishDate: this.txtPublishDate,
    //   language: this.txtLanguage,
    //   bookCategoryId: this.cboBookCategory,
    //   stock: this.txtStock,
    //   note: this.txtNote,
    //   bookInfoAccessLevel: 1
    // };

    this.bookInfoBL.addBookInfo(this.requestBody()).subscribe({
      next: (response: any) => {
        // Add the new category to the beginning of the array to display it first
        this.bookInfos.unshift(
          {
            _id: response.createdBookInfo._id,
            bookTitle: response.createdBookInfo.bookTitle,
            author: response.createdBookInfo.author,
            ISBN: response.createdBookInfo.ISBN,
            publisher: response.createdBookInfo.publisher,
            publishDate: response.createdBookInfo.publishDate,
            language: response.createdBookInfo.language,
            bookCategoryId: response.createdBookInfo.bookCategoryId,
            stock: response.createdBookInfo.stock,
            note: response.createdBookInfo.note,
            bookInfoAccessLevel: response.createdBookInfo.bookInfoAccessLevel,
            isSelected: false,
            bookCategory: {
              bookCategoryName: this.bookCategories.find(category => category._id === response.createdBookInfo.bookCategoryId)?.bookCategoryName,
            }
          }
        );

        // Reset pagination to show the first page
        this.currentPage = 1;
        this.showDataForm = false;

        // Reset the form fields
        this.clearControls();

        // Success message
        Swal.fire({
          title: "Added!",
          html: "Book info added successfully.",
          icon: "success",
          timer: 10000,
          timerProgressBar: true,
        });
      },
      error: (error: any) => {

      }
    });
  }

  updateBookInfo(): void {

    // const requestBody = {
    //   bookTitle: this.txtBookTitle,
    //   author: this.txtAuthor,
    //   ISBN: this.txtISBN,
    //   publisher: this.txtPublisher,
    //   publishDate: this.txtPublishDate,
    //   language: this.txtLanguage,
    //   bookCategoryId: this.cboBookCategory,
    //   stock: this.txtStock,
    //   note: this.txtNote,
    //   bookInfoAccessLevel: 1
    // };

    this.bookInfoBL.updateBookInfo(this.selectedBookInfo._id, this.requestBody()).subscribe({
      next: (response: any) => {
        const index = this.bookInfos.findIndex(category => category._id === response.bookInfo._id);

        if (index !== -1) {
          this.bookInfos[index] =
          {
            _id: response.bookInfo._id,
            bookTitle: response.bookInfo.bookTitle,
            author: response.bookInfo.author,
            ISBN: response.bookInfo.ISBN,
            publisher: response.bookInfo.publisher,
            publishDate: response.bookInfo.publishDate,
            language: response.bookInfo.language,
            bookCategoryId: response.bookInfo.bookCategoryId,
            stock: response.bookInfo.stock,
            note: response.bookInfo.note,
            bookInfoAccessLevel: response.bookInfo.bookInfoAccessLevel,
            bookCategory: {
              bookCategoryName: this.bookCategories.find(category => category._id === response.bookInfo.bookCategoryId)?.bookCategoryName,
            }
          }
        }

        this.showDataForm = false;

        // Reset the form fields
        this.clearControls();

        // Success message
        Swal.fire({
          title: "Updated!",
          html: "Book info updated successfully.",
          icon: "success",
          timer: 10000,
          timerProgressBar: true,
        });
      },
      error: (error: any) => {
        // Handle registration error here
      }
    });
  }

  deleteBookInfo(id: string): void {
    this.bookInfoBL.deleteBookInfo(id)
      .subscribe({
        next: (response: any) => {
          // Find the index of the deleted category in the array
          const index = this.bookInfos.findIndex(category => category._id === id);
          if (index !== -1) {
            // Remove the deleted category from the array
            this.bookInfos.splice(index, 1);
            // Reset pagination to show the first page
            this.currentPage = 1;
            // Filter out the deleted category from the filteredPagingBookInfos array
            this.getFilteredPagingBookInfos;
          }
          // Success message
          Swal.fire({
            title: "Deleted!",
            html: "Book info deleted successfully.",
            icon: "success",
            timer: 10000,
            timerProgressBar: true,
          });
        },
        error: (error: any) => {

        }
      });
  }

  deleteBulkBookInfo(ids: string[]): void {
    this.bookInfoBL.deleteBulkBookInfo(ids)
      .subscribe({
        next: (response: any) => {
          // Filter out the deleted categories from the bookInfos array
          ids.forEach(id => {
            const index = this.bookInfos.findIndex(category => category._id === id);
            if (index !== -1) {
              this.bookInfos.splice(index, 1);
            }
          });

          this.currentPage = 1;
          this.getFilteredPagingBookInfos;

          // Success message
          Swal.fire({
            title: "Deleted!",
            html: "Book categories deleted successfully.",
            icon: "success",
            timer: 10000,
            timerProgressBar: true,
          });
        },
        error: (error: any) => {
        }
      });
  }

  // Book Category
  getBookCategories(): void {
    this.bookCategoryBL.getBookCategories()
      .subscribe({
        next: (response: any) => {
          this.bookCategories = response.bookCategories.map((category: any) => ({ ...category, isSelected: false }));
        },
        error: (error: any) => {
          console.error('Error on getBookCategories: ', error);
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

  async formAdd_Click() {
    if (this.txtBookTitle.trim() === '' || !this.txtBookTitle) {
      await Swal.fire({
        title: "Error!",
        html: `Book info is required.`,
        icon: "error",
        timer: 5000,
        timerProgressBar: true,
      });

      return;
    }
    else if (this.txtNote.trim() === '' || !this.txtNote) {
      await Swal.fire({
        title: "Error!",
        html: `Description is required.`,
        icon: "error",
        timer: 5000,
        timerProgressBar: true,
      });

      return;
    }

    if (this.selectedBookInfo) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to update this book info!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (result.isConfirmed) {
        this.updateBookInfo();
      }
    } else {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to add this book info!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add it!",
      });

      if (result.isConfirmed) {
        this.addBookInfo();
      }
    }
  }

  btnAdd_Click(): void {
    this.clearControls();
    this.showDataForm = true;
  }

  btnUpdate_Click(category: any) {
    this.selectedBookInfo = { ...category }; // Copy the selected category
    this.txtBookTitle = this.selectedBookInfo.bookTitle;
    this.txtAuthor = this.selectedBookInfo.author;
    this.txtISBN = this.selectedBookInfo.ISBN;
    this.txtPublisher = this.selectedBookInfo.publisher;
    this.txtPublishDate = new Date(this.selectedBookInfo.publishDate).toISOString().split('T')[0]; // Convert UTC date to local date this.selectedBookInfo.publishDate;
    this.txtLanguage = this.selectedBookInfo.language;
    this.txtStock = this.selectedBookInfo.stock;
    this.txtNote = this.selectedBookInfo.note;

    this.cboBookCategory = this.selectedBookInfo.bookCategoryId;

    this.showDataForm = true; // Show the add form
  }

  async btnDelete_Click(id: string) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      this.deleteBookInfo(id);
    }
  }

  async btnCancel_Click() {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this book info!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      this.showDataForm = false;
    }
  }

  async btnDeleteBulk_Click() {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this/these!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete selected!",
    });
    if (result.isConfirmed) {
      let ids: string[] = this.bookInfos
        .filter((category: any) => category.isSelected)
        .map((category: any) => category._id);
      this.deleteBulkBookInfo(ids);
    }

  }

  //#endregion

  //#region Display book info
  // Function to filter and paginate book infos based on the search query
  get getFilteredPagingBookInfos(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredBookInfos = this.bookInfos
      .filter(category => category.bookTitle.toLowerCase().includes(this.searchTerms))
    this.filteredPagingBookInfos = this.filteredBookInfos
      .slice(startIndex, endIndex);
    return this.filteredPagingBookInfos;
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
    return Math.ceil(this.filteredBookInfos.length / this.pageSize);
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

    // Sort the book infos based on the selected column and direction
    this.bookInfos.sort((a, b) => {
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

  //#region Selection
  toggleSelection(category: any) {

  }

  toggleAllSelection(checked: boolean): void {
    this.filteredPagingBookInfos.forEach(category => {
      category.isSelected = checked;
    });
  }

  isAllSelected(): boolean {
    return this.filteredPagingBookInfos && this.filteredPagingBookInfos.length > 0 && this.filteredPagingBookInfos.every(category => category.isSelected);
  }

  //#endregion

  //#region Helper methods
  clearControls() {
    this.txtBookTitle = '';
    this.txtAuthor = '';
    this.txtISBN = '';
    this.txtPublisher = '';
    this.txtPublishDate = '';
    this.txtLanguage = '';
    this.txtStock = '1';
    this.txtNote = '';

    this.selectedBookInfo = null;
  }

  requestBody(): any {
    return {
      bookTitle: this.txtBookTitle,
      author: this.txtAuthor,
      ISBN: this.txtISBN,
      publisher: this.txtPublisher,
      publishDate: this.txtPublishDate,
      language: this.txtLanguage,
      bookCategoryId: this.cboBookCategory,
      stock: this.txtStock,
      note: this.txtNote,
      bookInfoAccessLevel: 1
    };
  }
  displayDeleteButton(): boolean {
    return this.filteredPagingBookInfos.some(category => category.isSelected);
  }

  //#endregion
}
