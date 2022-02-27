import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {Login} from '../login/login.model';
import {environment} from '../../../environments/environment';
import {DeviceDetectorService} from 'ngx-device-detector';

interface JwtToken {
  id_token: string;
}

@Injectable({providedIn: 'root'})
export class AuthServerProvider {

  constructor(private http: HttpClient, private $localStorage: LocalStorageService, private $sessionStorage: SessionStorageService) {
  }

  getToken(): string {
    return this.$localStorage.retrieve('authenticationToken') || this.$sessionStorage.retrieve('authenticationToken') || '';
  }

  login(credentials: Login): Observable<void> {
    console.log(environment.apiUrl);
    return this.http
      .post<JwtToken>(environment.apiUrl + '/authenticate', credentials)
      .pipe(map(response => this.authenticateSuccess(response, credentials.rememberMe)));
  }

  loginSso(credentials): Observable<void> {
    console.log(environment.apiUrl);
    return this.http
      .post<JwtToken>(environment.apiUrl + '/authenticate', credentials)
      .pipe(map(response => this.authenticateSuccess(response, true)));
  }

  logout(): Observable<void> {
    /*const deviceToken = 'test_1';
    this.http.get<string>(`${environment.apiUrl}/logout/${deviceToken}`).subscribe();*/
    return new Observable(observer => {
      this.$localStorage.clear('authenticationToken');
      this.$localStorage.clear('authenticationToken');
      localStorage.removeItem('roleGroup');
      observer.complete();
    });
  }

  private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    const jwt = response.id_token;
    if (rememberMe) {
      this.$localStorage.store('authenticationToken', jwt);
    } else {
      this.$sessionStorage.store('authenticationToken', jwt);
    }
  }

}
