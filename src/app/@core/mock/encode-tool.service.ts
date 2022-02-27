import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncodeToolService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {
  }

  encodeTool(input): Observable<any> {
    const form = new FormData();
    form.append('input', input);
    return this.http.post(`${this.apiUrl}/encode`, form, {observe: 'response'});
  }

  decodeTool(input): Observable<any> {
    const form = new FormData();
    form.append('input', input);
    return this.http.post(`${this.apiUrl}/decode`, form, {observe: 'response'});
  }

  encryptSensitiveData(input): Observable<any> {
    const form = new FormData();
    form.append('input', input);
    return this.http.post(`${this.apiUrl}/encryptSensitiveData`, form, {observe: 'response'});
  }

  decryptSensitiveData(input): Observable<any> {
    const form = new FormData();
    form.append('input', input);
    return this.http.post(`${this.apiUrl}/decryptSensitiveData`, form, {observe: 'response'});
  }

  checkAuth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/checkAuth`, {observe: 'response'});
  }
}
