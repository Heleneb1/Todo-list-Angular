import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Todo } from '../models/todo.model';
import { formatDate } from '@angular/common';
import { ItemsService } from '../services/items.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent {
  todos: Todo[] = [];
  newTodo!: Todo;
  items: any[] = [];
  showItems = false;
  constructor(private itemsService: ItemsService) {}
  // ngOnInit(): void {
  //   this.getItems();
  // }
  getItems(): void {
    this.itemsService.getItems().subscribe((items: any) => {
      this.items = items;
      this.showItemsList();
    });
  }
  showItemsList() {
    this.showItems = !this.showItems;
  }
  onSubmit(form: NgForm) {
    const newTodo: Todo = {
      title: form.value.title,
      created: new Date().toISOString(),
      isComplete: false,
      itemContent: form.value.itemContent,
      id: '', // Laissez l'ID vide ici
    };

    this.itemsService.addItem(newTodo).subscribe(
      (response) => {
        // Si l'ajout a réussi, l'API devrait retourner la nouvelle tâche avec son ID auto-incrémenté
        console.log('Nouvelle tâche ajoutée avec succès', response);
        const addedTodo: Todo = response; // Supposons que la réponse contienne la nouvelle tâche avec l'ID
        this.todos.push(addedTodo); // Ajouter la nouvelle tâche à la liste des todos localement
        form.resetForm(); // Réinitialiser le formulaire
      },
      (error) => {
        console.error("Erreur lors de l'ajout de la tâche", error);
        // Gérer l'erreur si nécessaire
      }
    );
  }
  onComplete(id: string) {
    const todo = this.todos.find((x) => x.id === id);
    if (todo) {
      todo.isComplete = true;
    }
  }

  onDelete(id: string) {
    const index = this.todos.findIndex((x) => x.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
    }
  }
}
