import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../env.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleManagerService {

  constructor(private http: HttpClient, private env: EnvService) {
  }

  apiUrl = environment.apiUrl;

  getPermissionsDefault(data): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/permissionsDefault`, {observe: 'response'});
  }

  searchModuleGroup(data): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/searchModuleGroup?roleGroupId=${data.roleId}`, {observe: 'response'});
  }

  getAllRoleGroup(data): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/getAllRoleGroup`, {observe: 'response'});
  }

  addRoleGroup(data): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/addRoleGroup`, data);
  }

  updateModuleGroup(data): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/updateModuleGroup/${data.nameGroup}`, data.option);
  }

  updateModule(data): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/updateModule/${data.moduleId}`, data.option);
  }

  updateRoleGroup(data): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/updateRoleGroup`, data);
  }

  searchModule(data): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/searchModule`, {observe: 'response'});
  }

  deleteRoleGroup(data): Observable<any> {
    return this.http.delete<any>(`${this.env.apiUrl}/deleteRoleGroup/${data}`, {observe: 'response'});
  }

  getUserRoleGroup(data): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/getUserRoleGroup/${data}`, {observe: 'response'});
  }
}
