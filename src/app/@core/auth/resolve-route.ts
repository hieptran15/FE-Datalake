import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {AccountService} from './account.service';

@Injectable()
export class AccountResolverService implements Resolve<null> {
  constructor(private router: Router, private accountService: AccountService) {
  }

  public resolve(route: ActivatedRouteSnapshot, router) {
    this.accountService.identity().subscribe(res => {
      if (!res) {
        this.router.navigate(['auth/login'])
      } else if (res.authorities.every((authority: any) => !(route.data.role && route.data.role.includes(authority.name)))) {
        this.router.navigate(['/not-permission']);
      }
    });

    return null
    // const language = route.paramMap.get('lang');
    //
    // if(allowedLanguages.includes(language)) {
    //   return null;
    // } else {
    //   this.router.navigate(['404']);
    // }
  }
}
