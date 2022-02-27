import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../../env.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThriftManagerService {
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  getListThrift(): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/wp/getListWpThrift`, {observe: 'response'})
  }

  saveThrift(obj: any, id:number): Observable<any> {
    if (id === null) {
      return this.http.post<any>(`${this.env.apiUrl}/wp/createWpThrift`, obj, {observe: 'response'})
    } else {
      return this.http.post<any>(`${this.env.apiUrl}/wp/editWpThrift`, obj, {observe: 'response'})
    }
  }

  deleteWpThrift(id: number): Observable<any> {
    return this.http.delete(`${this.env.apiUrl}/wp/deleteWpThrift?id=${id}`, {observe: 'response'})
  }
}
