import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationClusterComponent} from '../application-cluster/application-cluster.component';
import {ApplicationNodeComponent} from '../application-node/application-node.component';

@Component({
  selector: 'ngx-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent implements OnInit {

  keyword: string;
  cluster: any;

  constructor() {
  }

  @ViewChild('applicationClusterComponent') applicationClusterComponent: ApplicationClusterComponent;
  @ViewChild('applicationNodeComponent') applicationNodeComponent: ApplicationNodeComponent;

  ngOnInit(): void {

  }

  search() {
    this.applicationClusterComponent.search();
  }

  onChangeCluster(cluster) {
    this.cluster = cluster;
  }
}
