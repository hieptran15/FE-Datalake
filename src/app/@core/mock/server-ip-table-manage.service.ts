import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../../env.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerIpTableManageService {
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  doSearch(): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/doSearchWpServerIp`, {observe: 'response'});
  }

  save(obj: any, id: number): Observable<any> {
    if (id === null) {
      return this.http.post<any>(`${this.env.apiUrl}/createWpServerIp`, obj, {observe: 'response'});
    } else {
      return this.http.post<any>(`${this.env.apiUrl}/editWpServerIp`, obj, {observe: 'response'});
    }

  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.env.apiUrl}/deleteWpServerIp?id=${id}`, {observe: 'response'})
  }

  updateStatus(status: number, id: number): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/editStatusWpServerIp?status=${status}&id=${id}`, {observe: 'response'});
  }
}
