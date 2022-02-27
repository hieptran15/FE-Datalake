import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../env.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditIptableService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private env: EnvService) {
  }

  getFindContent(data): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/findContent`, data, {observe: 'response'});
  }

  updateFileConten(data): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/updateFileContent`, data, {observe: 'response'});
  }

  doSearchWpServerIp(data): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/doSearchWpServerIp`, {observe: 'response'});
  }
}
