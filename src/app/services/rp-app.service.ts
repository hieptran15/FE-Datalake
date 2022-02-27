import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RpAppService {

  constructor(private http: HttpClient) {
  }


  apiUrl = environment.apiUrl;


  GetAll(): Observable<any> {
    // const option = {keySearch: text.toString().trim(), typeSearch: type}
    return this.http.get(`${this.apiUrl}/lb-rp-app/doSearch`, {observe: 'response'});
  }

  // update(data?: any, id?: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/table-rule/update/${id}`, data, {observe: 'response'});
  // }

  // save(data?: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/table-rule`, data, {observe: 'response'});
  // }

  // getUserIP(id?: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/wp-user-ip?userId=${id}`, {observe: 'response'});
  //
  // }

  // getServer(id?: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/sm-server`, {observe: 'response'});
  //
  // }

  // getAllUser(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/users/getAll`, {observe: 'response'});
  //
  // }

  // getPort(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/lb-rp-app`, {observe: 'response'});
  // }

  //
  // updateStatus(status: any, key: any): Observable<any> {
  //
  //   return this.http.post<any>(`${this.apiUrl}/table-rule/update-status/?status=${status}&id=${key}`, {
  //     observe: 'response'
  //   });
  //
  // }

  CreateRPApp(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/lb-rp-app`, data, {observe: 'response'})
  }

  UpdateRpApp(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/lb-rp-app/update`, data, {observe: 'response'})

  }

  GetServerSM(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sm-server`, {observe: 'response'})
  }

  GetAllThriftRPApp(): Observable<any> {
    return this.http.get(`${this.apiUrl}/wp/getListWpThrift`, {observe: 'response'})
  }
}
