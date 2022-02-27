import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../env.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessAuthorizationService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private env: EnvService) {
  }

  searchAccessAuthorization(data: any): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/searchAccessAuthorization/${data.access}`, data.options)
  }

  addGroupThrift(data: any): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/addGroupThrift`, data)
  }

  addUserThrift(data: any): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/addUserThrift`, data)
  }

  updateGroupThrift(data: any): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/updateGroupThrift/${data.id}`, data.options)
  }

  updateUserThrift(data: any): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/updateUserThrift/${data.id}`, data.options)
  }

  getUsers(data): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/users/getAll`, {observe: 'response'});
  }

  searchWpThrift(data): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/searchWpThrift`, {observe: 'response'});
  }

  searchWpGroup(data): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/searchWpGroup`, {observe: 'response'});
  }

  deletebyIdGroupThrift(id: any) {
    return this.http.delete(`${this.env.apiUrl}/deletebyIdGroupThrift/${id}`);
  }

  deletebyIdUserThrift(data: any) {
    return this.http.post(`${this.env.apiUrl}/deletebyIdUserThrift/${data.id}`, {thriftId: data.thriftId, userId: data.userId});
  }
}
