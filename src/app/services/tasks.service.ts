import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private baseUrl = 'http://localhost:5000'; 

  constructor(private httpClient: HttpClient) {}

  getTasks(): Observable<Todo[]> {
    return this.httpClient.get<Todo[]>(`${this.baseUrl}/tasks`);
  } 
  //http://localhost:5000/tasks/list/a51a4ca5-dc3c-43c9-aa33-0534d01aaab5
  getTasksByListId(listId: string): Observable<Todo[]> {
    return this.httpClient.get<Todo[]>(`${this.baseUrl}/tasks/list/${listId}`);
  }

  getTasksById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(`${this.baseUrl}/tasks/${id}`);
  }
  getListsByUserId(userId: string): Observable<Todo[]> {
    //http://localhost:5000/lists/user/4630c5cc-b050-4d4d-84d5-fbb6000649d4
    return this.httpClient.get<Todo[]>(`${this.baseUrl}/lists/user/${userId}`);
  }

  addTask(task: Todo): Observable<Todo> {
    
    return this.httpClient.post<Todo>(`${this.baseUrl}/tasks`, task);
  }
  //http://localhost:5000/tasks/addTaskToList/2722257c-102b-4f3b-a8bd-c1f943694f59/07351fc5-304e-4561-a71f-17f77c51c9b7
 // http://localhost:5000/tasks/addTaskToList/2722257c-102b-4f3b-a8bd-c1f943694f59
  addTaskToListId(task: Todo, listId: string): Observable<Todo> {
    return this.httpClient.post<Todo>(`${this.baseUrl}/tasks/addTaskToList/${listId}`, task);
  }

  updateTask(id: string, task: any): Observable<any> {
    
    return this.httpClient.put<any>(`${this.baseUrl}/tasks/${id}`, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/tasks/${id}`);
  }
}