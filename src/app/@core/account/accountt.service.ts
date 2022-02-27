import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Accountt} from './accountt';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccounttService {
  public resourceUrl = `${environment.apiUrl}/account`

  constructor(private http: HttpClient) {
  }

  getAccount(): Observable<Accountt> {
    return this.http.get<Accountt>(this.resourceUrl);
  }

  getUser(id): Observable<Accountt> {
    return this.http.get<Accountt>(`${this.resourceUrl}/user?userId=${id}`);
  }

  getHdfsUser(id): Observable<any> {
    return this.http.get<any>(`${this.resourceUrl}/hdfs-user?userId=${id}`);
  }

  getModule(userId): Observable<any> {
    return this.http.get<any>(`${this.resourceUrl}/module?userId=${userId}`);
  }

  getListRole(moduleId): Observable<any> {
    return this.http.get<any>(`${this.resourceUrl}/find-role?moduleId=${moduleId}`);
  }

  getListRoleByHDFS(hdfsUserId, userId): Observable<any> {
    return this.http.get<any>(`${this.resourceUrl}/find-role-hdfs?hdfsUserId=${hdfsUserId}&userId=${userId}`);
  }

  addRole(role): Observable<any> {
    return this.http.post(environment.apiUrl + '/account/addRole', role);
  }

  updateRole(role): Observable<any> {
    return this.http.post(environment.apiUrl + '/account/updateRole', role);
  }

  deleteRole(obj): Observable<any> {
    return this.http.post(environment.apiUrl + '/account/change-role', obj);
  }

  updateRoleGroup(obj): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/update/${obj.roleName}`, obj.option);
  }

  getBroweseUserHdfs(data): Observable<any> {
    const token = localStorage.getItem('ngx-webstorage|authenticationtoken');
    const headers = new Headers({'Authorization': `Bearer ${token}`});
    const option = {
      Headers: headers,
    };
    // @ts-ignore
    return this.http.get<any>(`${environment.apiUrl}/searchDHdfsUser`, option);
  }
}
