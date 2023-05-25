import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent {
  todos: Todo[] = [];
  newTodo: string = '';

  onSubmit(form: NgForm) {
    const todo = new Todo(Guid.create(), form.value.title, false);
    this.todos.push(todo);
    form.resetForm();
  }

  onComplete(id: Guid) {
    const todo = this.todos.find((x) => x.id === id);
    if (todo) {
      todo.isComplete = true;
    }
  }

  onDelete(id: Guid) {
    const index = this.todos.findIndex((x) => x.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
    }
  }
}
