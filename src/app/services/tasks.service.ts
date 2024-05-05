import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private baseUrl = 'http://localhost:5000';

  constructor(private httpClient: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.baseUrl}/tasks`);
  }
  //http://localhost:5000/tasks/list/a51a4ca5-dc3c-43c9-aa33-0534d01aaab5
  getTasksByListId(listId: string): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.baseUrl}/tasks/list/${listId}`);
  }

  getTasksById(id: string): Observable<Task> {
    return this.httpClient.get<Task>(`${this.baseUrl}/tasks/${id}`);
  }
  getListsByUserId(userId: string): Observable<Task[]> {
    //http://localhost:5000/lists/user/4630c5cc-b050-4d4d-84d5-fbb6000649d4
    return this.httpClient.get<Task[]>(`${this.baseUrl}/lists/user/${userId}`);
  }

  addTask(task: Task): Observable<Task> {

    return this.httpClient.post<Task>(`${this.baseUrl}/tasks`, task);
  }
  addTaskToListId(task: Task, listId: string): Observable<Task> {
    return this.httpClient.post<Task>(`${this.baseUrl}/tasks/addTaskToList/${listId}`, task);
  }


  updateTask(id: string, task: Task): Observable<any> {
    const updateData = { ...task, isComplete: task.isComplete }; // Créer un objet contenant uniquement le champ isComplete
    return this.httpClient.put<any>(`${this.baseUrl}/tasks/${id}`, updateData);
  }


  deleteTask(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/tasks/${id}`);
  }
}
