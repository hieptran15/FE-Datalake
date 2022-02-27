import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {flatMap} from 'rxjs/operators';

import {Login} from './login.model';
import {AccountService} from '../auth/account.service';
import {AuthServerProvider} from '../auth/auth-jwt.service';
import {Account} from '../user/account.model';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class LoginService {
  constructor(
    private accountService: AccountService,
    private authServerProvider: AuthServerProvider,
    private router: Router
  ) {
  }

  login(credentials: Login): Observable<Account | null> {
    return this.authServerProvider.login(credentials).pipe(flatMap(() => this.accountService.identity(true)));
  }

  loginSSO(credentials): Observable<Account | null> {
    return this.authServerProvider.loginSso(credentials).pipe(flatMap(() => this.accountService.identity(true)));
  }

  logout(): void {
    this.authServerProvider.logout().subscribe(null, null, () => {
      this.accountService.authenticate(null);
      this.router.navigate(['auth/login']);
      const tickets = localStorage.getItem('ticket');
      if (tickets) {
        window.location.href = 'https://sso2.viettel.vn:8001/sso/logout?appCode=DWP&service=http%3A%2F%2F10.60.170.189%3A8097%2Fwebportal%2F';
        localStorage.removeItem('ticket');
      }
    });
  }
}
