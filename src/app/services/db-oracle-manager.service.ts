import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../env.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbOracleManagerService {

  constructor(private http: HttpClient, private env: EnvService) {
  }

  getAllDbOracle(data): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/getAllDbOracle`, {observe: 'response'});
  }

  createDbOracle(data): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/createDbOracle`, data, {observe: 'response'});
  }

  updateDbOracle(id, data): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/updateDbOracle/${id}`, data, {observe: 'response'});
  }

  deleteDbOracle(id): Observable<any> {
    return this.http.delete<any>(`${this.env.apiUrl}/deleteDbOracle/${id}`, {observe: 'response'});
  }

  getTableSpace(data): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/getTableSpace`, data, {observe: 'response'});
  }


  // getUserOracle(data): Observable<any> {
  //   return this.http.get<any>(`${this.env.apiUrl}/getUserOracle`,{observe: 'body'});
  // }
  getUserOracle(data): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/getUserOracle`, data, {
      observe: 'response',
    });
  }

  createUserDbOracle(data): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/createUserDbOracle`, data, {observe: 'response'});
  }

  createTableSpace(data): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/createTableSpace`, data, {observe: 'response'});
  }

  createDatafile(data): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/createDatafile`, data, {observe: 'response'});
  }

  getTableSpaceName(data): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/getTableSpaceName`, data, {observe: 'response'});
  }
}
