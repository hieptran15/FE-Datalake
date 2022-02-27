import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {createRequestOption} from '../utils/request-util';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';

type EntityResponseType = HttpResponse<any>;


@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor(private http: HttpClient) { }
  query(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${environment.apiUrl}/node-relations`, {
      params: options,
      observe: 'response',
    });
  }

  create(objModel: any): Observable<EntityResponseType> {
    return this.http.post<any>(`${environment.apiUrl}/node-relations`, objModel, {observe: 'response'});
  }

  update(objModel: any): Observable<EntityResponseType> {
    return this.http.put<any>(`${environment.apiUrl}/node-relations`, objModel, {observe: 'response'});
  }

  updateList(objModel: any[]): Observable<EntityResponseType> {
    return this.http.put(`${environment.apiUrl}/node-relations-list`, objModel, {observe: 'response'});
  }

  delete(id: any) {
    return this.http.delete(`${environment.apiUrl}/node-relations/${id}`);
  }

  find(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/node-relations/${id}`, {observe: 'response'});
  }
}
