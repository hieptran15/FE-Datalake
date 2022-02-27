import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../../env.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserThriftService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  gitListWpGroup(): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/wp/getListWpGroup`, {observe: 'response'});
  }

  gitListStatus(type: string): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/wp/getListStatus?type=${type}`, {observe: 'response'});
  }

  getListWpUser(groupId: any): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/wp/getWpUser?groupId=${groupId}`, {observe: 'response'});
  }

  saveOrEditWpGroup(obj: any): Observable<any> {
    if (obj.wpGroupId === null) {
      return this.http.post<any>(`${this.env.apiUrl}/wp/createWpGroup`, obj, {observe: 'response'});
    } else {
      return this.http.post<any>(`${this.env.apiUrl}/wp/updateWpGroup`, obj, {observe: 'response'});
    }
  }

  deleteWpUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.env.apiUrl}/wp/deleteWpUser?id=${id}`, {observe: 'response'});
  }

  createWpUser(wpUser: Object): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/wp/createWpUser`, wpUser, {observe: 'response'});
  }

  updateWpUser(wpUser: Object): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/wp/updateWpUser`, wpUser, {observe: 'response'});
  }
}
