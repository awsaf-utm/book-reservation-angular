import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2'
import { BookCategoryBL } from '../../BL/BookCategoryBL.service';

@Component({
  selector: 'app-book-category',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './book-category.component.html',
  styleUrls: ['./book-category.component.css'],
  providers: [BookCategoryBL]
})
export class BookCategoryComponent implements OnInit {
  btnAdd_Text: string = 'Add';
  showDataForm: boolean = false; // Initially hide the add book category form
  selectedBookCategory: any; // Property to store the selected book category for update

  // Search query
  txtSearch: string = '';
  searchTerms: string = '';

  // Pagination
  currentPage: number = 1;
  maxPagesNumberToShow = 10;
  pageSize: number = environment.totalRecordsPerPage;

  // Book Categories
  bookCategories: any[] = [];
  filteredBookCategories: any[] = [];
  filteredPagingBookCategories: any[] = [];

  // Book Category to be added or updated
  txtBookCategoryName: string = '';
  txtBookCategoryDescription: string = '';


  constructor(private bookCategoryBL: BookCategoryBL) {

  }

  ngOnInit(): void {
    this.getBookCategories();
  }

  //#region Database functions
  getBookCategories(): void {
    this.bookCategoryBL.getBookCategories()
      .subscribe({
        next: (response: any) => {
          this.bookCategories = response.bookCategories.map((category: any) => ({ ...category, isSelected: false }));
          this.getFilteredPagingBookCategories;
        },
        error: (error: any) => {
          console.error('Error on getBookCategories: ', error);
        }
      });
  }

  addBookCategory(): void {
    this.bookCategoryBL.addBookCategory(this.requestBody()).subscribe({
      next: (response: any) => {
        // Add the new category to the beginning of the array to display it first
        this.bookCategories.unshift(
          {
            _id: response.createdBookCategory._id,
            bookCategoryName: response.createdBookCategory.bookCategoryName,
            bookCategoryDescription: response.createdBookCategory.bookCategoryDescription,
            bookCategoryAccessLevel: response.createdBookCategory.bookCategoryAccessLevel
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
          html: "Book category added successfully.",
          icon: "success",
          timer: 10000,
          timerProgressBar: true,
        });
      },
      error: (error: any) => {

      }
    });
  }

  updateBookCategory(): void {
    this.bookCategoryBL.updateBookCategory(this.selectedBookCategory._id, this.requestBody()).subscribe({
      next: (response: any) => {
        const index = this.bookCategories.findIndex(category => category._id === response.bookCategory._id);

        if (index !== -1) {
          this.bookCategories[index] =
          {
            _id: response.bookCategory._id,
            bookCategoryName: response.bookCategory.bookCategoryName,
            bookCategoryDescription: response.bookCategory.bookCategoryDescription,
            bookCategoryAccessLevel: response.bookCategory.bookCategoryAccessLevel
          }
        }

        this.showDataForm = false;

        // Reset the form fields
        this.clearControls();

        // Success message
        Swal.fire({
          title: "Updated!",
          html: "Book category updated successfully.",
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

  deleteBookCategory(id: string): void {
    this.bookCategoryBL.deleteBookCategory(id)
      .subscribe({
        next: (response: any) => {
          // Find the index of the deleted category in the array
          const index = this.bookCategories.findIndex(category => category._id === id);
          if (index !== -1) {
            // Remove the deleted category from the array
            this.bookCategories.splice(index, 1);
            // Reset pagination to show the first page
            this.currentPage = 1;
            // Filter out the deleted category from the filteredPagingBookCategories array
            this.getFilteredPagingBookCategories;
          }
          // Success message
          Swal.fire({
            title: "Deleted!",
            html: "Book category deleted successfully.",
            icon: "success",
            timer: 10000,
            timerProgressBar: true,
          });
        },
        error: (error: any) => {

        }
      });
  }

  deleteBulkBookCategory(ids: string[]): void {
    this.bookCategoryBL.deleteBulkBookCategory(ids)
      .subscribe({
        next: (response: any) => {
          // Filter out the deleted categories from the bookCategories array
          ids.forEach(id => {
            const index = this.bookCategories.findIndex(category => category._id === id);
            if (index !== -1) {
              this.bookCategories.splice(index, 1);
            }
          });

          this.currentPage = 1;
          this.getFilteredPagingBookCategories;

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
    if (this.txtBookCategoryName.trim() === '' || !this.txtBookCategoryName) {
      await Swal.fire({
        title: "Error!",
        html: `Book category is required.`,
        icon: "error",
        timer: 5000,
        timerProgressBar: true,
      });

      return;
    }
    else if (this.txtBookCategoryDescription.trim() === '' || !this.txtBookCategoryDescription) {
      await Swal.fire({
        title: "Error!",
        html: `Description is required.`,
        icon: "error",
        timer: 5000,
        timerProgressBar: true,
      });

      return;
    }

    if (this.selectedBookCategory) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to update this book category!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (result.isConfirmed) {
        this.updateBookCategory();
      }
    } else {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to add this book category!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add it!",
      });

      if (result.isConfirmed) {
        this.addBookCategory();
      }
    }
  }

  btnAdd_Click(): void {

    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'You will not be able to recover this imaginary file!',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes, delete it!',
    //   cancelButtonText: 'No, keep it'
    // }).then((result) => {
    //   if (result.value) {
    //     Swal.fire(
    //       'Deleted!',
    //       'Your imaginary file has been deleted.',
    //       'success'
    //     )
    //   } else if (result.dismiss === Swal.DismissReason.cancel) {
    //     Swal.fire(
    //       'Cancelled',
    //       'Your imaginary file is safe :)',
    //       'error'
    //     )
    //   }
    // })

    this.clearControls();
    this.showDataForm = true;
  }

  btnUpdate_Click(category: any) {
    this.selectedBookCategory = { ...category }; // Copy the selected category
    this.txtBookCategoryName = this.selectedBookCategory.bookCategoryName;
    this.txtBookCategoryDescription = this.selectedBookCategory.bookCategoryDescription;

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
      this.deleteBookCategory(id);
    }
  }

  async btnCancel_Click() {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this book category!",
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
      let ids: string[] = this.bookCategories
        .filter((category: any) => category.isSelected)
        .map((category: any) => category._id);
      this.deleteBulkBookCategory(ids);
    }

  }

  //#endregion

  //#region Display book category
  // Function to filter and paginate book categories based on the search query
  get getFilteredPagingBookCategories(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredBookCategories = this.bookCategories
      .filter(category => category.bookCategoryName.toLowerCase().includes(this.searchTerms))
    this.filteredPagingBookCategories = this.filteredBookCategories
      .slice(startIndex, endIndex);
    return this.filteredPagingBookCategories;
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
    return Math.ceil(this.filteredBookCategories.length / this.pageSize);
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

    // Sort the book categories based on the selected column and direction
    this.bookCategories.sort((a, b) => {
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
    this.filteredPagingBookCategories.forEach(category => {
      category.isSelected = checked;
    });
  }

  isAllSelected(): boolean {
    return this.filteredPagingBookCategories && this.filteredPagingBookCategories.length > 0 && this.filteredPagingBookCategories.every(category => category.isSelected);
  }

  //#endregion

  //#region Helper methods
  clearControls() {
    this.txtBookCategoryName = '';
    this.txtBookCategoryDescription = '';
    this.selectedBookCategory = null;
  }

  requestBody(): any {
    return {
      bookCategoryName: this.txtBookCategoryName,
      bookCategoryDescription: this.txtBookCategoryDescription,
      bookCategoryAccessLevel: 1
    };
  }
  displayDeleteButton(): boolean {
    return this.filteredPagingBookCategories.some(category => category.isSelected);
  }

  //#endregion
}
