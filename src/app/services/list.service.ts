import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { List } from '../models/list.model';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  baseUrl = 'http://localhost:5000';

  constructor(private httpClient: HttpClient) { }
  getListsByUserId(userId: string): Observable<List[]> {
    //http://localhost:5000/lists/user/4630c5cc-b050-4d4d-84d5-fbb6000649d4
    return this.httpClient.get<List[]>(`${this.baseUrl}/lists/user/${userId}`);
  }
  getListById(id: string): Observable<List> {
    return this.httpClient.get<List>(`${this.baseUrl}/lists/${id}`);
  }
  //router.post("/user/:userId", addOneList);
  addListByUserId(userId: string, list: List): Observable<List> {
    return this.httpClient.post<List>(`${this.baseUrl}/lists/user/${userId}`, list);
  }
  updateList(id: string, list: any): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/lists/${id}`, list);
  }
  deleteList(id: string): Observable<List> {
    return this.httpClient.delete<List>(`${this.baseUrl}/lists/${id}`);
  }
  getTasksByListId(listId: string): Observable<List[]> {
    return this.httpClient.get<List[]>(`${this.baseUrl}/tasks/list/${listId}`);
  }
}
