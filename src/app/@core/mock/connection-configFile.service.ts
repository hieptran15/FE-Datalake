import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ConnectionModel} from '../model/connection.model';
@Injectable({
  providedIn: 'root'
})
export class ConnectionConfigFileService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }
  getConnections(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/connections`, { observe: 'response' });
  }
  getConnection(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/connection/${id}`, { observe: 'response' });
  }
  editConnection(connection: ConnectionModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/editConnection`, connection, { observe: 'response'});
  }
  addConfigFile(connection: ConnectionModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createConnection`, connection, { observe: 'response' })
  }
  validateConn(connection: ConnectionModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validateConn`, connection, { observe: 'response' })
  }
}
