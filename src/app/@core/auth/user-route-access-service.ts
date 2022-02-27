import { Injectable, isDevMode } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';

import { StateStorageService } from './state-storage.service';
import {AccountService} from './account.service';

@Injectable({ providedIn: 'root' })
export class UserRouteAccessService implements CanActivate {
  constructor(
    private router: Router,
    private accountService: AccountService,
    private stateStorageService: StateStorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.identity().pipe(
      map(account => {
        if (account) {
          const authorities = route.data['authorities'];
          console.log(authorities)
          if (!authorities || authorities.length === 0 || this.accountService.hasAnyAuthority(authorities)) {
            return true;
          }

          if (isDevMode()) {
            console.error('User has not any of required authorities: ', authorities);
          }
          this.router.navigate(['accessdenied']);
          return false;
        }

        this.stateStorageService.storeUrl(state.url);
        this.router.navigate(['/login']);
        return false;
      })
    );
  }

  /* canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const authorities = route.data['authorities'];
    // We need to call the checkLogin / and so the accountService.identity() function, to ensure,
    // that the client has a principal too, if they already logged in by the server.
    // This could happen on a page refresh.
    // return this.checkLogin(authorities, state.url);
    this.localStorage.retrieve('authenticationToken') || this.router.navigate(['/auth/login']);
    return of(!!this.localStorage.retrieve('authenticationToken'));
  }*/

  checkLogin(authorities: string[], url: string): Observable<boolean> {
    return this.accountService.identity().pipe(
      map(account => {
        if (account) {
          if (url === '/auth/login') {
            this.router.navigate(['']);
          }
        }
        if (!authorities || authorities.length === 0) {
          return true;
        }

        if (account) {
          // if (url === 'user-route-access-service.ts') {
          //   this.router.navigate(['']);
          // }
          const hasAnyAuthority = this.accountService.hasAnyAuthority(authorities, true);
          if (hasAnyAuthority) {
            return true;
          }
          if (isDevMode()) {
            console.error('User has not any of required authorities: ', authorities);
          }
          this.router.navigate(['accessdenied']);
          return false;
        }

        this.stateStorageService.storeUrl(url);
        this.router.navigate(['auth/login']);
        return false;
      })
    );
  }
}
