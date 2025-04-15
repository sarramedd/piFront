import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../core/models/user.model'; // Importation du modèle User
import { Observable } from 'rxjs'; // Ajoutez ceci en haut de votre fichier


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = []; // Typage des utilisateurs avec le modèle User
  isLoading: boolean = false;
  errorMessage: string = '';
  currentAction: string = '';
  actionUserId: number | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.userService.getUsers().subscribe({
      next: (data: User[]) => { // Typage des données reçues
        // Mise à jour de la liste des utilisateurs
        this.users = data.map(user => ({
          ...user,
          status: user.status || 'Active' // Valeur par défaut pour le statut
        }));
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        this.isLoading = false;
        console.error(error);
      }
    });
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
      next: (response) => {
        // Mise à jour locale de l'état des utilisateurs
        this.updateUserStatus(userId, action);
        this.resetAction();
      },
      error: (error) => {
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
      const updatedUser = this.users[userIndex];
      if (action === 'ban') {
        updatedUser.status = 'Banned';
      } else if (action === 'unban') {
        updatedUser.status = 'Active';
      } else if (action === 'delete') {
        this.users.splice(userIndex, 1); // Suppression de l'utilisateur
      }
      // Mise à jour immuable
      this.users = [...this.users];
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
