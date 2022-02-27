import {Observable, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {IUser} from './user.model';
import {Injectable} from '@angular/core';
import {createRequestOption} from '../../utils/request-util';
import {EnvService} from '../../env.service';

type EntityResponseType = HttpResponse<IUser>;

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }


  // cache data when navigate from user config to user detail
  CurrentUserManagement = {};



  userMessChange: Subject<any> = new Subject<any>();
  public resourceUrl = `${this.env.apiUrl}/users`

  create(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.resourceUrl, user);
  }

  update(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(this.resourceUrl, user);
  }


  gitListWpGroup(): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/wp/getListWpGroup`, {observe: 'response'});
  }

  updateReadedMess(data: any): Observable<any> {
    return this.http.put<any>(`${this.env.apiUrl}/notification-users/saveAll`, data);
  }

  updateStatus(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${this.env.apiUrl}/users/update-status`, user);
  }

  resetPass(id): Observable<IUser> {
    return this.http.post<IUser>(`${this.env.apiUrl}/users/reset-password/${id}`, null);
  }

  find(login: string): Observable<EntityResponseType> {
    return this.http.get<any>(`${this.resourceUrl}/${login}`, {observe: 'response'});
  }

  query(req?: any): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(this.resourceUrl, {params: options, observe: 'response'});
  }

  delete(login: string): Observable<any> {
    return this.http.delete(`${this.resourceUrl}/${login}`);
  }

  getNotifications(userId?: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/notification/count-notice-of-user/${userId}`, {observe: 'response'});
  }

  getUserChat(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any>(`${this.resourceUrl}/notifications`, {params: options, observe: 'response'});
  }

  getMessage(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get(`${environment.apiUrl}/notifications`, {params: options, observe: 'response'});
  }

  downloadFile(downloadLink): Observable<any> {
    return this.http.get(`${environment.apiUrl}/notification/get-file?type=type&&path=${downloadLink}`)
  }

  deleteMessage(data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/notification-users/saveAll`, data);

  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.env.apiUrl}/users/authorities`);
  }

  addUser(data): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/users/addUser`, data)
  }

  saveOrEditWpGroup(obj: any, id: number): Observable<any> {
    if (id === null) {
      return this.http.post<any>(`${this.env.apiUrl}/wp/createWpGroup`, obj, {observe: 'response'});
    } else {
      return this.http.post<any>(`${this.env.apiUrl}/wp/updateWpGroup`, obj, {observe: 'response'});
    }
  }

  deleteWpGroup(id: number): Observable<any> {
    return this.http.delete<any>(`${this.env.apiUrl}/wp/deleteWpGroup/${id}`, {observe: 'response'});
  }
}
