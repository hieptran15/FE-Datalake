import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  public changePass(body?: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/account/change-password`, body);
  }
  public requestResetPassword(body?: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/account/reset-password/init`, body);
  }
  public requestResetPasswordComplete(body?: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/account/reset-password/finish`, body);
  }
}
