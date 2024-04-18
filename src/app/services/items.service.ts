import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private baseUrl = 'http://localhost:5000'; // URL de votre backend

  constructor(private httpClient: HttpClient) {}

  // Exemple de requête GET pour récupérer tous les éléments
  getItems(): Observable<Todo[]> {
    return this.httpClient.get<Todo[]>(`${this.baseUrl}/items`);
  } // getArticles() {
  //   return this.httpClient.get(`${this.baseUrl}/items`);
  // }

  getItemsById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(`${this.baseUrl}/items/${id}`);
  }

  // Exemple de requête POST pour créer un nouvel élément
  addItem(item: Todo): Observable<Todo> {
    console.log(item);
    return this.httpClient.post<Todo>(`${this.baseUrl}/items`, item);
  }

  // Exemple de requête PUT pour mettre à jour un élément existant
  updateItem(id: string, item: any): Observable<any> {
    console.log(item);
    return this.httpClient.put<any>(`${this.baseUrl}/items/${id}`, item);
  }

  // Exemple de requête DELETE pour supprimer un élément existant
  deleteItem(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/items/${id}`);
  }
}
