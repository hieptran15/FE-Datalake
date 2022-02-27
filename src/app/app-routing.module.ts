import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {NbAuthComponent, NbRegisterComponent} from '@nebular/auth';
import {LoginComponent} from './auth-routing/login/login.component';
import {RequestPasswordComponent} from './auth-routing/request-password/request-password.component';
import {LogoutComponent} from './auth-routing/logout/logout.component';
import {UserRouteAccessService} from './@core/auth/user-route-access-service';
import {ChangePasswordComponent} from './auth-routing/change-password/change-password.component';

export const routes: Routes = [
  {
    path: 'page',
    data: {
      // authorities: ['ROLE_ADMIN', 'ROLE_USER'],
      breadcrumb: {label: 'Trang chủ'}
    },
    // canActivate: [UserRouteAccessService],
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    // canActivate: [UserRouteAccessService],
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
        // canActivate: [UserRouteAccessService],
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: 'request-password',
        component: RequestPasswordComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
    ],
  },
  { path: '', redirectTo: 'page', pathMatch: 'full' },
  {
    path: '**',
   redirectTo: 'page/not-found', pathMatch: 'full'
  },
];

const config: ExtraOptions = {
  useHash: false,
  onSameUrlNavigation: 'reload',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
