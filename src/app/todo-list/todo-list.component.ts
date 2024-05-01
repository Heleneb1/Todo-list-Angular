import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Todo } from '../models/todo.model';
import { TasksService } from '../services/tasks.service';
import { ListService } from '../services/list.service';
import { List } from '../models/list.model';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent {
  todos: Todo[] = [];
  todo!: Todo;
  showtasks = false;
  taskId = '';
  lists: List[] = [];
  list!: List
  userId = localStorage.getItem('id');
  showCompletedTasks = false;
  auth_token = localStorage.getItem('auth_token');
  selectedListId = '';
  isSelectList = false;
  userAvatar: string = '';
  user!: User
  newImage: string = '';
  defaultAvatar: string = 'src/assets/home.jpg';
  taskContent: string = '';
  title: string = '';

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
    });
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

  onGetTaskById(taskId: string): void {
    this.tasksService.getTasksById(taskId).subscribe((task: any) => { });
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
  onGetListById(id: string): void {
    this.listService.getListById(id).subscribe((list: List) => {
      if (list) {
        // Si la liste n'est pas vide, affectez-la à la variable de composant this.list
        this.list = list;
      } else {
        // Si la liste est vide, affichez un message
        console.log("La liste est vide.");
      }
    });
  }
  getTasksByListId(listId: string): void {
    this.tasksService.getTasksByListId(listId).subscribe((tasks: Todo[]) => {
      this.todos = tasks;
    });
    this.showTasksList();
  }
  selectList(listId: string): void {
    this.selectedListId = listId;
    this.isSelectList = true;
    console.log(this.selectedListId, 'selectedListId');
  }

  //TODO: modifier la fonction onAddList pour qu'elle prenne en compte l'ID de l'utilisateur contenu dans le body de la requête
  onAddList(form: NgForm): void {
    const newList: List = {
      name: form.value.name,
      id: '', // Laisser l'ID vide ici
      user_id: this.userId || '',
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
  onAddTaskBySelectedList(form: NgForm): void {
    if (!this.selectedListId) {
      alert('Veuillez sélectionner une liste.');
      return;
    }


    const newTodo: Todo = {
      title: form.value.title,
      created: new Date(new Date().toLocaleDateString()),
      isComplete: false,
      taskContent: form.value.taskContent,
      id: '', // Laisser l'ID vide ici
    };
    console.log(newTodo, 'newTodo');
    if (!form.value.title) {
      alert('Le titre de la tâche est obligatoire.');
      return;
    }

    this.tasksService.addTaskToListId(newTodo, this.selectedListId).subscribe(
      (response) => {
        const addedTodo: Todo = response;
        console.log(addedTodo, 'addedTodo');

        this.todos.push(addedTodo);
        form.resetForm();
        this.getTasksByListId(this.selectedListId);
        alert('Tâche ajoutée avec succès !');
      },

      (error) => {
        console.error("Erreur lors de l'ajout de la tâche", error);
      }
    );
    this.showTasksList();
  }

  getTasks(): void {
    this.tasksService.getTasks().subscribe((tasks: Todo[]) => {
      this.todos = tasks;

      this.showTasksList();
    });
  }

  getTasksTodo(): void {
    this.showCompletedTasks = false;
    this.tasksService.getTasks().subscribe((tasks: Todo[]) => {
      this.todos = tasks.filter((todo: Todo) => !todo.isComplete);
      this.showTasksList();
    });
  }
  getTasksRealised(): void {
    this.tasksService.getTasks().subscribe((tasks: Todo[]) => {
      this.todos = tasks;
      this.todos = this.todos.filter((todo) => todo.isComplete);
      console.log(this.todos, 'todos');

    });
  }
  countCompletedTasks() {
    if (this.todos) {
      return this.todos.filter((todo) => !todo.isComplete).length;
    }
    return 0;
  }
  toggleCompletedTasks(): void {
    this.showtasks = false;
    this.showCompletedTasks = !this.showCompletedTasks;
    if (this.showCompletedTasks) {
      this.getTasksRealised();
    }
  }

  showTasksList(): void {
    this.showtasks = !this.showtasks;
  }

  onSubmit(form: NgForm): void {
    const newTodo: Todo = {
      title: form.value.title,
      created: new Date(new Date().toISOString()),
      isComplete: false,
      taskContent: form.value.taskContent,
      id: '', // Laisser l'ID vide ici
    };

    this.tasksService.addTask(newTodo).subscribe(
      (response) => {
        const addedTodo: Todo = response;
        this.todos.push(addedTodo);
        form.resetForm();
        this.getTasks();
        alert('Tâche ajoutée avec succès !');
      },

      (error) => {
        console.error("Erreur lors de l'ajout de la tâche", error);
      }
    );
    this.showTasksList();
  }

  onComplete(taskId: string): void {
    const taskToUpdate = this.todos.find(todo => todo.id === taskId);
    if (!taskToUpdate) {
      console.error('Tâche non trouvée pour l\'ID donné');
      return;
    }

    // Mettre à jour les champs de la tâche à marquer comme terminée
    taskToUpdate.isComplete = true;


    // Mettre à jour la tâche sur le serveur
    const updatedTodo: Todo = {
      id: taskToUpdate.id,
      title: taskToUpdate.title,
      isComplete: true,
      taskContent: taskToUpdate.taskContent,
      created: new Date(new Date()),
    };
    console.log(updatedTodo, 'updatedTodo');


    this.tasksService.updateTask(taskId, updatedTodo).subscribe(
      (response) => {
        console.log('Tâche mise à jour avec succès', response);

        // Actualiser la liste des tâches après la mise à jour
        this.getTasksByListId(this.selectedListId);
        alert('Tâche marquée comme terminée !');
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la tâche', error);
      }
    );
  }
  // onComplete(taskId: string): void {
  //   const taskToUpdate = this.todos.find(todo => todo.id === taskId);
  //   if (!taskToUpdate) {
  //     console.error('Tâche non trouvée pour l\'ID donné');
  //     return;
  //   }

  //   // Mise à jour de la tâche pour la marquer comme terminée
  //   taskToUpdate.isComplete = true;

  //   // Préparer l'objet à envoyer
  //   const updatedTodo: Todo = {
  //     ...taskToUpdate,
  //     isComplete: true  // Assurez-vous que isComplete est défini comme booléen
  //   };

  //   this.tasksService.updateTask(taskId, updatedTodo).subscribe(
  //     (response) => {
  //       console.log('Tâche mise à jour avec succès', response);
  //       this.getTasksByListId(this.selectedListId);
  //       alert('Tâche marquée comme terminée !');
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la mise à jour de la tâche', error);
  //     }
  //   );
  // }

  getCompletedTasksCount(): number {
    if (this.todos) {
      return this.todos.filter((todo) => todo.isComplete).length;
    }
    return 0;
  }

  onDelete(taskId: string): void {
    this.onGetTaskById(taskId);
    console.log(taskId, 'taskId');

    this.tasksService.deleteTask(taskId).subscribe(
      (response) => {
        console.info('Tâche supprimée avec succès', response);

        const index = this.todos.findIndex((x) => x.id === taskId);
        if (index !== -1) {
          this.todos.splice(index, 1);
        }

        this.getTasksByListId(this.selectedListId);
      },
      (error) => {
        console.error('Erreur lors de la suppression de la tâche', error);
      }
    );
    alert('Tâche supprimée avec succès !');
  }
  isRealised(task: Todo): boolean {
    return task.isComplete;
  }
  loadUser(): void {
    this.authService.getUserData(this.userId || '').subscribe((user: User) => {
      this.user = user;
      console.log(this.user, 'user');
      this.displayAvatar(); // Appeler la fonction pour récupérer l'avatar de l'utilisateur
    });
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
      console.log(this.userAvatar, 'userAvatar');
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

}  