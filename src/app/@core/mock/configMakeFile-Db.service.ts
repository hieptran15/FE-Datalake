import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {MakeConfigFileDbModel} from '../model/makeConfigFileDb.model';
@Injectable({
  providedIn: 'root'
})
export class ConfigMakeFileDbService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }
  getConfigFiles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/configMakeFileDbs`, { observe: 'response' });
  }
  getConfigFile(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/configMakeFileDb/${id}`, { observe: 'response' });
  }

  editConfigFile(id: number, makeConfigFileDb: MakeConfigFileDbModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/editConfig/${id}`, makeConfigFileDb, { observe: 'response'});
  }
  addConfigFile(makeConfigFileDb: MakeConfigFileDbModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createConfig`, makeConfigFileDb, { observe: 'response' })
  }
  validateConfigFile(makeConfigFileDb: MakeConfigFileDbModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/vaidate`, makeConfigFileDb, { observe: 'response' })
  }
  deleteConfigFile(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/deleteconfig/${id}`, '', {observe: 'response'});
  }
}
