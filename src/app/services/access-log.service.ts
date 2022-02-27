import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../env.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessLogService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private env: EnvService) {
  }

  searchLogThrift(data: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/searchLogThrift`, data)
  }
}
