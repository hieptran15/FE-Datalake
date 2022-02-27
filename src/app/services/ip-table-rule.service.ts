import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpTableRuleService {

  constructor(private http: HttpClient
  ) {

  }

  apiUrl = environment.apiUrl;

  doSearch(text: string, type: string): Observable<any> {
    const option = {keySearch: text.toString().trim(), typeSearch: type}
    return this.http.get(`${this.apiUrl}/table-rule`, {params: option, observe: 'response'});
  }

  update(data?: any, id?: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/table-rule/update/${id}`, data, {observe: 'response'});
  }

  save(data?: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/table-rule`, data, {observe: 'response'});
  }

  getUserIP(id?: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/wp-user-ip?userId=${id}`, {observe: 'response'});

  }

  getServer(id?: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sm-server`, {observe: 'response'});

  }

  getAllUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/getAll`, {observe: 'response'});

  }
  getPort(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lb-rp-app`, {observe: 'response'});
  }

  updateStatus(status: any, key: any): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/table-rule/update-status/?status=${status}&id=${key}`, {
      observe: 'response'
    });

  }

}
