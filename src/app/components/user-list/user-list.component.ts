import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../core/models/user.model'; // Assurez-vous que ce modèle existe et est correct

import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: [
    './user-list.component.css',
    '../../../assets/bootstrap-template/css/style.css',
    '../../../assets/bootstrap-template/vendors/mdi/css/materialdesignicons.min.css',
    '../../../assets/bootstrap-template/vendors/font-awesome/css/font-awesome.min.css',
    '../../../assets/bootstrap-template/vendors/css/vendor.bundle.base.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];
  displayedUsers: User[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  currentAction: string = '';
  actionUserId: number | null = null;

  searchTerm: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 1;

  // Expose Math to template
  Math = Math;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data.map(user => ({
          ...user,
          status: user.status || 'Active'
        }));
        this.filteredUsers = [...this.users];
        this.totalItems = this.filteredUsers.length;
        this.calculateTotalPages();
        this.updateDisplayedUsers();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        this.isLoading = false;
        console.error(error);
      }
    });
  }


  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.totalItems = this.filteredUsers.length;
    this.calculateTotalPages();
    this.updateDisplayedUsers();
  }

  // Méthodes de pagination
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages > 0 ? this.totalPages : 1;
    }
  }

  updateDisplayedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updateDisplayedUsers();
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.calculateTotalPages();
    this.updateDisplayedUsers();
  }

  confirmAction(action: string, userId: number): void {
    this.currentAction = action;
    this.actionUserId = userId;

    const actionMessages: { [key: string]: string } = {
      'ban': 'Êtes-vous sûr de vouloir bannir cet utilisateur ?',
      'unban': 'Êtes-vous sûr de vouloir débannir cet utilisateur ?',
      'delete': 'Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ?'
    };

    if (window.confirm(actionMessages[action])) {
      this.executeAction(action, userId);
    } else {
      this.resetAction();
    }
  }

  executeAction(action: string, userId: number): void {
    this.isLoading = true;

    const actions: { [key: string]: Observable<any> } = {
      'ban': this.userService.banUser(userId),
      'unban': this.userService.unbanUser(userId),
      'delete': this.userService.deleteUser(userId)
    };

    actions[action].subscribe({

      next: () => {
        this.updateUserStatus(userId, action);
        this.resetAction();
      },
      error: (error: any) => {
        this.errorMessage = `Erreur lors ${this.getActionName(action)}`;
        this.isLoading = false;
        console.error(error);
        this.resetAction();
      }
    });
  }

  updateUserStatus(userId: number, action: string): void {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {

      if (action === 'delete') {
        this.users.splice(userIndex, 1);
        this.totalItems--;
      } else {
        this.users[userIndex].status = action === 'ban' ? 'Banned' : 'Active';
      }
      
      this.users = [...this.users];
      this.applyFilter(); // Re-appliquer le filtre après modification
    }
  }

  getActionName(action: string): string {
    const actionNames: { [key: string]: string } = {
      'ban': 'du bannissement',
      'unban': 'du débannissement',
      'delete': 'de la suppression'
    };
    return actionNames[action];
  }

  resetAction(): void {
    this.isLoading = false;
    this.currentAction = '';
    this.actionUserId = null;
  }

}
