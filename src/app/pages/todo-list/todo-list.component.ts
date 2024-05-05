import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import { ListService } from '../../services/list.service';
import { List } from '../../models/list.model';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent {

  completedTasks: Task[] = [];
  tasks: Task[] = [];
  showtasks = false;
  lists: List[] = [];
  list!: List
  userId = localStorage.getItem('id');
  selectedListId = '';
  isSelectList = false;
  userAvatar: string = '';
  user!: User
  defaultAvatar: string = 'src/assets/home.jpg';
  selectedListMessage: string = '';
  showList = false;
  showTasks = false;
  selectedListTasks: Task[] = [];
  users: User[] = [];

  constructor(private tasksService: TasksService,
    private listService: ListService,
    private authService: AuthenticationService,
    private router: Router) { }

  ngOnInit(


  ): void {
    this.authService.getUserData(this.userId || '').subscribe((user: User) => {
      this.user = user;
      console.log(this.user, 'user');

      this.displayAvatar(); // Appeler la fonction pour récupérer l'avatar de l'utilisateur
      this.user.firstname;
      this.user.lastname;
      console.log(this.user.firstname, 'firstName');

    });
  }

  showUserList(): void {
    this.showList = !this.showList;
  }

  onTaskCompleted(taskId: string): void {
    const taskToUpdate = this.tasks.find(task => task.id === taskId);
    if (!taskToUpdate) {
      console.error('Tâche non trouvée pour l\'ID donné');
      return;
    }

    // Mettre à jour les champs de la tâche à marquer comme terminée
    taskToUpdate.isComplete = true;


    // Mettre à jour la tâche sur le serveur
    const updatedTask: Task = {
      id: taskToUpdate.id,
      title: taskToUpdate.title,
      isComplete: true,
      taskContent: taskToUpdate.taskContent,
      created: new Date(new Date()),
    };
    console.log(updatedTask, 'updatedTask');

    this.tasksService.updateTask(taskId, taskToUpdate).subscribe(
      (response) => {
        console.info('Tâche marquée comme complétée avec succès', response);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la tâche', error);
      }
    );
  }
  onTaskDeleted(taskId: string): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.tasksService.deleteTask(taskId).subscribe(
      (response) => {
        console.info('Tâche supprimée avec succès', response);
      },
      (error) => {
        console.error('Erreur lors de la suppression de la tâche', error);
      }
    );
  }


  logoutUsingCookie() {
    this.authService.logout().subscribe(response => {
      console.info('Déconnexion réussie !', response);
    }, error => {
      console.error('Erreur de déconnexion :', error);
    });
    localStorage.removeItem('auth_token');
    localStorage.removeItem('id');
    alert('Vous êtes deconnecté !');
    this.router.navigate(['/']);
  }

  toggleTasksList(userId: string): void {
    this.showTasks = !this.showTasks;
    if (this.showTasks) {

      this.listService.getListsByUserId(userId).subscribe((lists: List[]) => {
        if (lists && lists.length > 0) {
          console.log(lists, 'lists');

          // Si la liste n'est pas vide, affectez-la à la variable de composant this.lists
          this.lists = lists;

        } else {
          this.lists = []; // Assurez-vous que les listes sont vides si aucune n'est trouvée
        }
      });
    }

  }


  onGetListByUserId(userId: string): void {
    console.log(userId);

    this.listService.getListsByUserId(userId).subscribe((lists: List[]) => {
      if (lists && lists.length > 0) {
        console.log(lists, 'lists');

        // Si la liste n'est pas vide, affectez-la à la variable de composant this.lists
        this.lists = lists;
      } else {
        // Si la liste est vide, affichez un message
        console.log("Aucune liste.");
      }
    });
  }

  onGetTasksByListId(listId: string): void {
    this.tasksService.getTasksByListId(listId).subscribe(
      (tasks: Task[]) => {
        // Filtrer les tâches pour ne récupérer que celles avec isComplete à false
        this.tasks = tasks.filter(task => !task.isComplete);
        console.log(this.tasks, 'tasks');
      },
      error => console.error('Erreur lors de la récupération des tâches', error)
    );
    this.showTasksList();
  }


  selectList(listId: string): void {
    this.selectedListId = listId;
    console.log(listId, 'listId');

    this.listService.getListById(listId).subscribe((list: List) => {
      this.list = list;
      if (this.list) {
        this.selectedListMessage = "Liste sélectionnée : " + this.list.name;
      }
    });
    this.isSelectList = true;
    console.log(this.selectedListId, 'selectedListId');
    this.selectedListTasks = this.tasks;
  }
  //TODO: modifier la fonction onAddList pour qu'elle prenne en compte l'ID de l'utilisateur contenu dans le body de la requête
  onAddList(form: NgForm): void {
    const newList: List = {
      name: form.value.name,
      id: '', // Laisser l'ID vide ici
      user_id: this.userId || '',
      listContent: form.value.listContent,
    };

    if (this.userId) {
      this.listService.addListByUserId(this.userId, newList).subscribe(
        (response) => {
          const addedList: List = response;
          this.lists.push(addedList);
          form.resetForm();
          if (this.userId) {
            this.onGetListByUserId(this.userId);
          }
          console.log(this.userId, 'userId');

          alert('Liste ajoutée avec succès !');
        },

        (error) => {
          console.error("Erreur lors de l'ajout de la liste", error);
        }
      );
    } else {
      console.error("L'ID de l'utilisateur est null.");
    }
  }
  showTasksList(): void {
    this.showtasks = !this.showtasks;
  }


  displayAvatar(): void {
    this.authService.getUserAvatar(this.userId || '').subscribe((avatar: any) => {
      if (!avatar) {
        // Si aucun avatar n'est disponible, utilisez l'image par défaut
        this.userAvatar = this.defaultAvatar;
        console.log(this.defaultAvatar, 'defaultAvatar');

      } else {
        this.userAvatar = avatar;
      }
      // console.log(this.userAvatar, 'userAvatar');
    });
  }
  selectedImage: File | null = null;

  onImageSelected(event: any) {
    const selectedFile = event.target.files[0];
    this.selectedImage = selectedFile;
  }
  onUpdateAvatar(event: any): void {
    const file = event.target.files[0];

    if (!file) {
      console.error("Aucun fichier sélectionné.");
      return;
    }

    if (!this.userId) {
      console.error("L'ID de l'utilisateur est vide.");
      return;
    }

    this.authService.updateUserAvatar(file, this.userId).subscribe(
      (response) => {
        console.info('Avatar de l\'utilisateur mis à jour avec succès', response);
        this.displayAvatar(); // Appeler la fonction pour récupérer l'avatar de l'utilisateur
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'avatar de l\'utilisateur', error);
      }
    );
  }
  onDeleteList(listId: string): void {
    this.listService.deleteList(listId).subscribe(
      (response) => {
        console.info('Liste supprimée avec succès', response);
        const index = this.lists.findIndex((x) => x.id === listId);
        if (index !== -1) {
          this.lists.splice(index, 1);
        }
      },
      (error) => {
        console.error('Erreur lors de la suppression de la liste', error);
      }
    );
    alert('Liste supprimée avec succès !');
  }
}  