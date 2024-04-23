import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Todo } from '../models/todo.model';
import { ItemsService } from '../services/items.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent {
  todos: Todo[] = [];
  todo!: Todo;
  showItems = false;
  itemId = '';
  showCompletedTasks = false;
  auth_token = localStorage.getItem('auth_token');
  constructor(private itemsService: ItemsService) {}

  ngOnInit(): void {}

  getItemById(itemId: string): void {
    this.itemsService.getItemsById(itemId).subscribe((item: any) => {});
  }

  getItems(): void {
    this.itemsService.getItems().subscribe((items: Todo[]) => {
      this.todos = items;

      this.showItemsList();
    });
  }
  getItemsTodo(): void {
    this.showCompletedTasks = false;
    this.itemsService.getItems().subscribe((items: Todo[]) => {
      this.todos = items.filter((todo: Todo) => !todo.isComplete);
      this.showItemsList();
    });
  }
  getItemsRealised(): void {
    this.itemsService.getItems().subscribe((items: Todo[]) => {
      this.todos = items;
      this.todos = this.todos.filter((todo) => todo.isComplete);
    });
  }
  countCompletedTasks() {
    if (this.todos) {
      return this.todos.filter((todo) => !todo.isComplete).length;
    }
    return 0;
  }
  toggleCompletedTasks(): void {
    this.showItems = false;
    this.showCompletedTasks = !this.showCompletedTasks;
    if (this.showCompletedTasks) {
      this.getItemsRealised();
    }
  }

  showItemsList(): void {
    this.showItems = !this.showItems;
  }

  onSubmit(form: NgForm): void {
    const newTodo: Todo = {
      title: form.value.title,
      created: new Date(new Date().toISOString()),
      isComplete: false,
      itemContent: form.value.itemContent,
      id: '', // Laisser l'ID vide ici
    };

    this.itemsService.addItem(newTodo).subscribe(
      (response) => {
        const addedTodo: Todo = response;
        this.todos.push(addedTodo);
        form.resetForm();
        this.getItems();
        alert('Tâche ajoutée avec succès !');
      },

      (error) => {
        console.error("Erreur lors de l'ajout de la tâche", error);
      }
    );
    this.showItemsList();
  }

  onComplete(itemId: string): void {
    this.getItemById(itemId);

    this.itemsService.updateItem(itemId, { isComplete: true }).subscribe(
      (response) => {
        const updatedTodo: Todo = response;
        const index = this.todos.findIndex((x) => x.id === updatedTodo.id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
        }
        // this.getItems();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la tâche', error);
      }
    );
    this.getItemsTodo();
    alert('Tâche marquée comme terminée !');
  }
  getCompletedTasksCount(): number {
    if (this.todos) {
      return this.todos.filter((todo) => todo.isComplete).length;
    }
    return 0;
  }

  onDelete(id: string): void {
    this.getItemById(id);
    this.itemsService.deleteItem(id).subscribe(
      (response) => {
        console.info('Tâche supprimée avec succès', response);

        const index = this.todos.findIndex((x) => x.id === id);
        if (index !== -1) {
          this.todos.splice(index, 1);
        }

        this.getItems();
      },
      (error) => {
        console.error('Erreur lors de la suppression de la tâche', error);
      }
    );
    this.showItemsList();
  }
  isRealised(todo: Todo): boolean {
    return todo.isComplete;
  }
}
