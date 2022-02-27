import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationClusterComponent} from '../application-cluster/application-cluster.component';
import {ApplicationNodeComponent} from '../application-node/application-node.component';
import {concat, Observable, of, Subject} from 'rxjs';
import {catchError, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {ApplicationClusterService} from '../../services/application-cluster.service';

@Component({
  selector: 'ngx-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {

  clusters$: Observable<any[]>;
  clustersInput$ = new Subject<string>();
  clustersLoading = false;
  keyword: string;
  cluster: any;
  tempClick: any;

  constructor(
    private applicationClusterService: ApplicationClusterService
  ) {
  }

  @ViewChild('applicationClusterComponent') applicationClusterComponent: ApplicationClusterComponent;
  @ViewChild('applicationNodeComponent') applicationNodeComponent: ApplicationNodeComponent;

  ngOnInit(): void {
    this.clusters$ = concat(
      of([]), // default items
      this.clustersInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.clustersLoading = true),
        switchMap(term => this.applicationClusterService.query({
          keyword: (term || '').replace(/\+/gi, '%2B'),
          page: 0,
          size: 10,
          sort: ['treePath', 'clusterName', 'id,desc']
        }).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.clustersLoading = false),
          map(res => res.body.map(i => {
            i.treeName = i.parentName ? `${i.parentName} / ${i.clusterName}` : i.clusterName;
            return i;
          }))
        ))
      )
    );
  }
  search() {
    this.applicationNodeComponent.search(this.cluster);
  }

  onChangeCluster(cluster) {
    this.cluster = cluster;
  }
}
