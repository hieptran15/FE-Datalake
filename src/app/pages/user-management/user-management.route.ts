import {ActivatedRouteSnapshot, Resolve, Router, RouterModule, Routes} from '@angular/router';
import {UserManagementComponent} from './user-management.component';
import {UserConfigComponent} from './user-config/user-config.component';
import {Injectable, NgModule} from '@angular/core';
import {EMPTY, Observable, of} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {IUser, User} from '../../@core/user/user.model';
import {UserService} from '../../@core/user/user.service';
import {UserDetailComponent} from './user-config/user-detail/user-detail.component';

@Injectable({providedIn: 'root'})
export class UserResolve implements Resolve<IUser> {
  constructor(private service: UserService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<IUser> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((res: HttpResponse<IUser>) => {
          if (res.body) {
            return of(res.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new User());
  }
}

export const userManagementRoute: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    data: {
      breadcrumb: {
        label: 'Quản lý User',
        // unitField: 'profile',
        // fieldName: 'profileName'
      },
    },
    children: [
      {
        path: 'user',
        component: UserConfigComponent,
        data: {
          breadcrumb: {
            label: 'Danh sách',
            // unitField: 'profile',
            // fieldName: 'profileName'
          },
        },
      },
      {
        path: 'user/:id',
        component: UserDetailComponent,
      },
      // {
      //   path: 'user/new',
      //   component: UserConfigUpdateComponent,
      //   resolve: {
      //     user: UserResolve
      //   },
      //   data: {
      //     breadcrumb: {
      //       label: 'Thêm mới User',
      //     },
      //   }
      // },
      // {
      //   path: 'user/:id/edit',
      //   component: UserConfigUpdateComponent,
      //   resolve: {
      //     user: UserResolve
      //   },
      //   data: {
      //     breadcrumb: {
      //       label: 'Cập nhật User',
      //     },
      //   }
      // },
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full',
      }
    ]
  }
]


@NgModule({
  imports: [RouterModule.forChild(userManagementRoute)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
