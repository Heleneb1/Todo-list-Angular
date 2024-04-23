import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private baseUrl = 'http://localhost:5000'; 

  constructor(private httpClient: HttpClient) {}

  getItems(): Observable<Todo[]> {
    return this.httpClient.get<Todo[]>(`${this.baseUrl}/items`);
  } 

  getItemsById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(`${this.baseUrl}/items/${id}`);
  }

  addItem(item: Todo): Observable<Todo> {
    
    return this.httpClient.post<Todo>(`${this.baseUrl}/items`, item);
  }

  updateItem(id: string, item: any): Observable<any> {
    
    return this.httpClient.put<any>(`${this.baseUrl}/items/${id}`, item);
  }

  deleteItem(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/items/${id}`);
  }
}
