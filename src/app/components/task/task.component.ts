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
  showCompletedTasks = false;
  isComplete = false;
  lists: List[] = [];
  list!: List
  isSelectList = false;
  selectedListMessage: string = '';
  userId = localStorage.getItem('id');
  user!: User;
  showlist = false;
  listId!: string;
  showtasks: any;


  constructor(private taskService: TasksService,
    private authService: AuthenticationService,
    private listService: ListService) { }

  ngOnInit(): void { }
  onGetTaskById(taskId: string): void {
    this.authService.getUserData(this.userId || '').subscribe((user: User) => {
      this.user = user;
    });
    this.taskService.getTasksById(taskId).subscribe((task: any) => { });
  }


  onAddTaskBySelectedList(form: NgForm, selectedListId: string): void {
    if (!selectedListId) {
      alert('Veuillez sélectionner une liste.');
      return;
    }


    const newTask: Task = {
      title: form.value.title,
      created: new Date(new Date().toLocaleDateString()),
      isComplete: false,
      taskContent: form.value.taskContent,
      id: '', // Laisser l'ID vide ici
    };
    console.log(newTask, 'newTask');

    if (!form.value.title) {
      alert('Le titre de la tâche est obligatoire.');
      return;
    }

    this.taskService.addTaskToListId(newTask, selectedListId).subscribe(
      (response) => {
        const addedTask: Task = response;
        console.log(addedTask, 'addedTask');

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
      console.log('Tasks', this.tasks);
      this.showTasksList();
    });
  }

  toggleCompletedTasks(selectedListId: string): void {
    this.showTasks = false;
    this.showCompletedTasks = !this.showCompletedTasks;
    console.log('showCompletedTasks', this.showCompletedTasks);

    if (this.showCompletedTasks) {
      // Only fetch if we are about to show them
      this.getTasksRealised();
    }
  }

  showTasksList(): void {
    this.showTasks = !this.showTasks;
  }

  getTasksByListId(listId: string): void {
    this.selectedListId = listId;
    this.taskService.getTasksByListId(listId).subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      console.log('Tasks', this.tasks);
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
    console.log('Tâche supprimée', id);

    this.taskService.deleteTask(id).subscribe(
      (response) => {
        console.log('Tâche supprimée avec succès', response);

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

}

