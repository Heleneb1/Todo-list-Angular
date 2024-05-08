import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ListService } from 'src/app/services/list.service';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  @Input() selectedListId: string | undefined;
  @Input() tasks: Task[] = [];
  @Input() completedTasks: Task[] = [];

  @Output() taskCompleted = new EventEmitter<string>();
  @Output() taskDeleted = new EventEmitter<string>();

  task!: Task;
  showTasks = false;
  taskId = '';
  // showCompletedTasks = false;
  isComplete = false;
  lists: List[] = [];
  list!: List;
  isSelectList = false;
  selectedListMessage: string = '';
  userId = localStorage.getItem('id');
  user!: User;
  showlist = false;
  listId!: string;
  // showtasks: any;
  showTasksCompletedByList = false;
  message = '';

  constructor(
    private taskService: TasksService,
    private authService: AuthenticationService,
    private listService: ListService
  ) {}

  ngOnInit(): void {}
  onGetTaskById(taskId: string): void {
    this.authService.getUserData(this.userId || '').subscribe((user: User) => {
      this.user = user;
    });
    this.taskService.getTasksById(taskId).subscribe((task: any) => {});
  }

  onAddTaskBySelectedList(form: NgForm, selectedListId: string): void {
    const newTask: Task = {
      title: form.value.title,
      created: new Date(new Date().toLocaleDateString()),
      isComplete: false,
      id: '', // Laisser l'ID vide ici
    };
    console.info('newTask adding');

    if (!form.value.title) {
      alert('Veuillez compléter le champ de la tâche');
      return;
    }

    this.taskService.addTaskToListId(newTask, selectedListId).subscribe(
      (response) => {
        const addedTask: Task = response;
        console.info('addedTask');

        this.tasks.push(addedTask);
        form.resetForm();
        this.getTasksByListId(selectedListId);
        alert('Tâche ajoutée avec succès !');
      },

      (error) => {
        console.error("Erreur lors de l'ajout de la tâche", error);
      }
    );
    this.showTasksList();
    if (!selectedListId) {
      this.message =
        '🚦Veuillez sélectionner une liste pour ajouter cette tâche🚦';
    }
  }

  getTasks(): void {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;

      this.showTasksList();
    });
  }

  getTasksRealised(): void {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks.filter((task: Task) => task.isComplete);
      console.info('Tasks', this.tasks);
      this.showTasksList();
    });
  }

  openCompleteTask(selectedListId: string): void {
    this.showTasksCompletedByList = !this.showTasksCompletedByList;
    if (this.showTasksCompletedByList) {
      this.getRealisedTaskByListId(selectedListId);
    }
  }

  getRealisedTaskByListId(selectedListId: string): void {
    if (!selectedListId) {
      this.message =
        ' 🚦- Veuillez sélectionner une liste pour voir les tâches réalisées';
    } else {
      this.message = '✅ - Liste des tâches réalisées par liste';

      this.taskService
        .getTasksByListId(selectedListId)
        .subscribe((tasks: Task[]) => {
          this.tasks = tasks.filter((task: Task) => task.isComplete);
          console.info('Tasks', this.tasks);
        });
    }
  }

  showTasksList(): void {
    this.showTasks = !this.showTasks;
  }

  getTasksByListId(listId: string): void {
    this.selectedListId = listId;
    this.taskService.getTasksByListId(listId).subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      console.info('Tasks', this.tasks);
    });
    this.showTasksList();
  }

  getCompletedTasksCount(): number {
    if (this.tasks) {
      return this.tasks.filter((task) => task.isComplete).length;
    }
    return 0;
  }

  onDelete(id: string): void {
    console.info('Tâche supprimée', id);

    this.taskService.deleteTask(id).subscribe(
      (response) => {
        console.info('Tâche supprimée avec succès', response);

        // Supprimer la tâche de la liste actuelle
        const index = this.tasks.findIndex((x) => x.id === id);
        if (index !== -1) {
          this.tasks.splice(index, 1);
        }

        // Mettre à jour la liste des tâches après la suppression
        this.getTasksByListId(this.listId);

        // Émettre un événement pour informer le parent de la suppression de la tâche
        this.taskDeleted.emit(id);
      },
      (error) => {
        console.error('Erreur lors de la suppression de la tâche', error);
      }
    );

    // Mettre à jour l'affichage
    this.showTasksList();
  }
  onChangeStatus(id: string, task: Task): void {
    // Mettre à jour le statut de la tâche localement
    task.isComplete = !task.isComplete;

    // Mettre à jour la tâche sur le serveur
    this.taskService.updateTask(id, task).subscribe(
      (response) => {
        console.info('Tâche mise à jour avec succès', response);

        // Si la mise à jour est réussie, supprimer la tâche de la liste actuelle
        const index = this.tasks.findIndex((x) => x.id === id);
        if (index !== -1) {
          this.tasks.splice(index, 1);
        }

        // Émettre un événement pour informer le parent de la mise à jour de la tâche
        this.taskCompleted.emit(id);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la tâche', error);
      }
    );

    // Mettre à jour l'affichage
    this.showTasksList();
  }
}
