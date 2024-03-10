import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2'
import { BookReservationBL } from '../../BL/BookReservationBL.service';
import { BookInfoBL } from '../../BL/BookInfoBL.service';

@Component({
  selector: 'app-book-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './book-reservation.component.html',
  styleUrls: ['./book-reservation.component.css'],
  providers: [BookReservationBL, BookInfoBL]
})
export class BookReservationComponent implements OnInit {
  btnAdd_Text: string = 'Add';
  showDataForm: boolean = false; // Initially hide the add book reservation form
  selectedBookReservation: any; // Property to store the selected book reservation for update

  // Search query
  txtSearch: string = '';
  searchTerms: string = '';

  // Pagination
  currentPage: number = 1;
  maxPagesNumberToShow = 10;
  pageSize: number = environment.totalRecordsPerPage;

  // Book Reservations
  bookReservations: any[] = [];
  filteredBookReservations: any[] = [];
  filteredPagingBookReservations: any[] = [];

  // Book Reservation to be added or updated
  txtReservationRef: string = '';
  txtReservationDate: string = '';
  txtName: string = '';
  txtEmail: string = '';
  txtMobile: string = '';
  txtReservationComment: string = '';
  userId: string = '';

  // Book Categories
  bookInfos: any[] = [];
  //cboBookInfo: any;

  // Reservation Details add/edit form
  reservationDetails: any[] = [];

  constructor(private bookReservationBL: BookReservationBL, private bookInfoBL: BookInfoBL) {

  }

  ngOnInit(): void {
    this.getBookInfos();
  }

  //#region Database functions
  getBookReservations(): void {
    this.bookReservationBL.getBookReservations()
      .subscribe({
        next: (response: any) => {
          this.bookReservations = response.bookReservations.map((reservation: any) => ({ ...reservation, isSelected: false }));
          this.bookReservations.forEach(category => {
            category.reservationDetails = category.reservationDetails.map((detail: any) => (
              {
                ...detail,
                bookTitle: this.bookInfos.find((bookInfo: any) => bookInfo._id == detail.bookInfoId)?.bookTitle || 'Unknown Book Title',

              }))
          });
          this.getFilteredPagingBookReservations;
        },
        error: (error: any) => {
          console.error('Error on getBookReservations: ', error);
        }
      });

  }

  addBookReservation(): void {
    const requestBody = this.requestBodyForAdding();
    this.bookReservationBL.addBookReservation(requestBody).subscribe({
      next: (response: any) => {
        // Add the new category to the beginning of the array to display it first
        this.bookReservations.unshift(
          {
            _id: response.createdBookReservation._id,
            reservationRef: response.createdBookReservation.reservationRef,
            reservationDate: response.createdBookReservation.reservationDate,
            reservationComment: response.createdBookReservation.reservationComment,
            userId: response.createdBookReservation.userId,
            userInfo: {
              _id: response.createdBookReservation.user._id,
              name: response.createdBookReservation.user.customerName,
              email: response.createdBookReservation.user.customerEmail,
              mobile: response.createdBookReservation.user.customerPhone,
              address: response.createdBookReservation.user.address
            },
            reservationDetails: response.createdBookReservation.reservationDetails
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
          html: "Book reservation added successfully.",
          icon: "success",
          timer: 10000,
          timerProgressBar: true,
        });
      },
      error: (error: any) => {

      }
    });
  }

  updateBookReservation(): void {
    const requestBody = this.requestBodyForUpdating();
    this.bookReservationBL.updateBookReservation(this.selectedBookReservation._id, requestBody).subscribe({
      next: (response: any) => {
        const index = this.bookReservations.findIndex(category => category._id === response.updatedBookReservation._id);
        if (index !== -1) {

          requestBody.reservationDetails = requestBody.reservationDetails.map((detail: any) => (
            {
              ...detail,
              bookTitle: this.bookInfos.find((bookInfo: any) => bookInfo._id == detail.bookInfoId)?.bookTitle || 'Unknown Book Title',

            }))


          this.bookReservations[index] =
          {
            _id: this.selectedBookReservation._id,
            reservationRef: requestBody.reservationRef,
            reservationDate: requestBody.reservationDate,
            reservationStatusNum: requestBody.reservationStatusNum,
            userId: requestBody.userId,
            reservationComment: requestBody.reservationComment,
            reservationAccessLevel: requestBody.bookReservationAccessLevel,
            isSelected: false,
            userInfo: {
              name: this.txtName,
              email: this.txtEmail,
              mobile: this.txtMobile
            },
            reservationDetails: requestBody.reservationDetails
          }
        }

        this.showDataForm = false;

        // Reset the form fields
        this.clearControls();

        // Success message
        Swal.fire({
          title: "Updated!",
          html: "Book reservation updated successfully.",
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

  deleteBookReservation(id: string): void {
    this.bookReservationBL.deleteBookReservation(id)
      .subscribe({
        next: (response: any) => {
          // Find the index of the deleted category in the array
          const index = this.bookReservations.findIndex(category => category._id === id);
          if (index !== -1) {
            // Remove the deleted category from the array
            this.bookReservations.splice(index, 1);
            // Reset pagination to show the first page
            this.currentPage = 1;
            // Filter out the deleted category from the filteredPagingBookReservations array
            this.getFilteredPagingBookReservations;
          }
          // Success message
          Swal.fire({
            title: "Deleted!",
            html: "Book reservation deleted successfully.",
            icon: "success",
            timer: 10000,
            timerProgressBar: true,
          });
        },
        error: (error: any) => {

        }
      });
  }

  deleteBulkBookReservation(ids: string[]): void {
    this.bookReservationBL.deleteBulkBookReservation(ids)
      .subscribe({
        next: (response: any) => {
          // Filter out the deleted categories from the bookReservations array
          ids.forEach(id => {
            const index = this.bookReservations.findIndex(category => category._id === id);
            if (index !== -1) {
              this.bookReservations.splice(index, 1);
            }
          });

          this.currentPage = 1;
          this.getFilteredPagingBookReservations;

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
  getBookInfos(): void {
    this.bookInfoBL.getBookInfos()
      .subscribe({
        next: (response: any) => {
          this.bookInfos = response.bookInfos.bookInfos;
          this.getBookReservations(); // Call here to use bookInfos
        },
        error: (error: any) => {
          console.error('Error on getBookInfos: ', error);
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
    if (this.txtReservationRef.trim() === '' || !this.txtReservationRef) {
      await Swal.fire({
        title: "Error!",
        html: `Book reservation is required.`,
        icon: "error",
        timer: 5000,
        timerProgressBar: true,
      });

      return;
    }
    else if (this.txtReservationComment.trim() === '' || !this.txtReservationComment) {
      await Swal.fire({
        title: "Error!",
        html: `Description is required.`,
        icon: "error",
        timer: 5000,
        timerProgressBar: true,
      });

      return;
    }

    if (this.selectedBookReservation) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to update this book reservation!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (result.isConfirmed) {
        this.updateBookReservation();
      }
    } else {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to add this book reservation!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add it!",
      });

      if (result.isConfirmed) {
        this.addBookReservation();
      }
    }
  }

  btnAdd_Click(): void {
    this.clearControls();
    this.reservationDetails = [{ bookInfoId: "", quantity: 1 }];
    this.showDataForm = true;
  }

  btnUpdate_Click(reservation: any) {
    this.selectedBookReservation = { ...reservation }; // Copy the selected category
    this.txtReservationRef = this.selectedBookReservation.reservationRef;
    this.txtReservationDate = new Date(this.selectedBookReservation.reservationDate).toISOString().split('T')[0];
    this.txtName = this.selectedBookReservation.userInfo.name;
    this.txtEmail = this.selectedBookReservation.userInfo.email;
    this.txtMobile = this.selectedBookReservation.userInfo.mobile;
    this.txtReservationComment = this.selectedBookReservation.reservationComment;
    this.userId = this.selectedBookReservation.userId
    this.reservationDetails = this.selectedBookReservation.reservationDetails;

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
      this.deleteBookReservation(id);
    }
  }

  async btnCancel_Click() {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this book reservation!",
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
      let ids: string[] = this.bookReservations
        .filter((category: any) => category.isSelected)
        .map((category: any) => category._id);
      this.deleteBulkBookReservation(ids);
    }

  }

  //#endregion

  //#region Display book reservation
  // Function to filter and paginate book reservations based on the search query
  get getFilteredPagingBookReservations(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredBookReservations = this.bookReservations
      .filter(category => category.reservationRef.toLowerCase().includes(this.searchTerms))
    this.filteredPagingBookReservations = this.filteredBookReservations
      .slice(startIndex, endIndex);
    return this.filteredPagingBookReservations;
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
    return Math.ceil(this.filteredBookReservations.length / this.pageSize);
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

    // Sort the book reservations based on the selected column and direction
    this.bookReservations.sort((a, b) => {
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
    this.filteredPagingBookReservations.forEach(category => {
      category.isSelected = checked;
    });
  }

  isAllSelected(): boolean {
    return this.filteredPagingBookReservations && this.filteredPagingBookReservations.length > 0 && this.filteredPagingBookReservations.every(category => category.isSelected);
  }

  //#endregion

  //#region Helper methods
  clearControls() {
    this.txtReservationRef = '';
    this.txtReservationDate = '';
    this.txtName = '';
    this.txtEmail = '';
    this.txtMobile = '';
    this.txtReservationComment = '';
    this.selectedBookReservation = null;

    this.reservationDetails = [];
  }

  requestBodyForAdding(): any {
    const userInfo = {
      customerName: this.txtName,
      customerEmail: this.txtEmail,
      customerPhone: this.txtMobile,
      address: '',
    }

    return {
      reservationRef: this.txtReservationRef,
      reservationComment: this.txtReservationComment,
      user: userInfo,
      reservationDetails: this.reservationDetails
    };
  }

  requestBodyForUpdating(): any {
    const reservationDetails = this.reservationDetails.map(detail => {
      const { _id, bookInfoId, quantity } = detail;

      return {
        _id,
        bookInfoId,
        quantity
      };
    });


    return {
      reservationRef: this.txtReservationRef,
      reservationDate: this.txtReservationDate,
      reservationComment: this.txtReservationComment,
      userId: this.userId,
      reservationDetails
    };
  }

  displayDeleteButton(): boolean {
    return this.filteredPagingBookReservations.some(category => category.isSelected);
  }


  // Define the toggleDetails method
  expandedReservationId: string | null = null;
  toggleDetails(bookReservation: any) {
    console.log('Toggle details called for:', bookReservation._id);
    if (this.expandedReservationId === bookReservation._id) {
      this.expandedReservationId = null; // Collapse the details
    } else {
      this.expandedReservationId = bookReservation._id; // Expand the details
    }
  }


  addDetail() {
    this.reservationDetails.push({ bookInfoId: '', quantity: 1 });
  }

  removeDetail(index: number) {
    this.reservationDetails.splice(index, 1);
  }

  //#endregion
}
