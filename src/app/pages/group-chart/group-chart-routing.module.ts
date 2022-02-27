import {Injectable, NgModule} from '@angular/core';
import {Routes, RouterModule, Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import {GroupChartComponent} from './group-chart.component';
import {GroupChartDetailComponent} from './components/group-chart-detail/group-chart-detail.component';
import {EMPTY, Observable, of} from 'rxjs';
import {GroupChartService} from '../../services/group-chart.service';
import {flatMap} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class GroupChartDetailResolve implements Resolve<any> {
  constructor(private router: Router, private groupChartService: GroupChartService) {
  }

  public resolve(route: ActivatedRouteSnapshot, router): Observable<any> {
    const id = this.router.getCurrentNavigation().extras.state && this.router.getCurrentNavigation().extras.state.id;
    const typeOfViewDetail = this.router.getCurrentNavigation().extras.state && this.router.getCurrentNavigation().extras.state.typeOfViewDetail;
    if (id && typeOfViewDetail) {
      if (+typeOfViewDetail === 2) { // search for process
        return this.groupChartService.findJobForProcess({chartCode: id}).pipe(
          flatMap((res: HttpResponse<any>) => {
            if (res.body) {
              return of({results: res.body.results, chartCode: id, typeOfViewDetail: typeOfViewDetail});
            } else {
              this.router.navigate(['pages/group-chart']);
              return EMPTY;
            }
          })
        );
      } else if (+typeOfViewDetail === 3) { // search for job
        return this.groupChartService.searchForJob({chartCode: id}).pipe(
          flatMap((res: HttpResponse<any>) => {
            if (res.body) {
              return of({results: res.body.results, chartCode: id, typeOfViewDetail: typeOfViewDetail});
            } else {
              this.router.navigate(['pages/group-chart']);
              return EMPTY;
            }
          })
        );
      } else {
        return this.groupChartService.searchForErrorsList({alertCode: id}).pipe(
          flatMap((res: HttpResponse<any>) => {
            if (res.body) {
              return of({results: res.body.results, chartCode: id, typeOfViewDetail: typeOfViewDetail});
            } else {
              this.router.navigate(['pages/group-chart']);
              return EMPTY;
            }
          })
        );
      }
    }
    this.router.navigate(['pages/group-chart']);
    return EMPTY;
  }
}
const routes: Routes = [
  {
    path: '',
    component: GroupChartComponent
  },
  {
    path: 'group-chart-detail',
    component: GroupChartDetailComponent,
    resolve: {
      data: GroupChartDetailResolve
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupChartRoutingModule {
}
