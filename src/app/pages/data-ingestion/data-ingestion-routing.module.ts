import {Injectable, NgModule} from '@angular/core';
import {Routes, RouterModule, Resolve, ActivatedRouteSnapshot, ExtraOptions} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DataIngestionComponent} from './data-ingestion.component';
import {MonitorIngestionComponent} from './monitor-ingestion/monitor-ingestion.component';
import {ConnectionManagementComponent} from './connection-management/connection-management.component';
import {UpdateThreadComponent} from './monitor-ingestion/update-thread/update-thread.component';
import {IThreadConfig} from '../../model/ithread-config.model';
import {Observable, of} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ThreadResolve implements Resolve<IThreadConfig> {
  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<IThreadConfig> | Observable<never> {
    const id = route.params['id'];
    return of(id);
  }
}

const routes: Routes = [{
  path: '',
  component: DataIngestionComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent
    },
    {
      path: 'monitor-ingestion',
      // component: MonitorIngestionComponent,
      children: [
        {
          path: '',
          component: MonitorIngestionComponent,
        },
        {
          path: 'edit/:id',
          component: UpdateThreadComponent,
          // resolve: {
          //   thread: ThreadResolve
          // }
        }
      ]
    },
    {
      path: 'connection-management',
      component: ConnectionManagementComponent
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    }
  ]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataIngestionRoutingModule {
}
