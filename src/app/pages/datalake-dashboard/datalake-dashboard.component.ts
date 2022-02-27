import {
  Component,
  OnInit,
} from '@angular/core';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';
import {PopupErrorComponent} from '../popup-error/popup-error.component';
import {DatalakeDashboardService} from '../../services/datalake-dashboard.service';
import {BehaviorSubject} from 'rxjs';
import {NbDialogService} from '@nebular/theme';


@Component({
  selector: 'ngx-datalake-dashboard',
  templateUrl: './datalake-dashboard.component.html',
  styleUrls: ['./datalake-dashboard.component.scss'],
})

export class DatalakeDashboardComponent implements OnInit {
  isAdmin: any;
  Dashboard: any;
  listCmCluster = [];
  ////////
  defaultNameUse = 0;
  defaultNameTotal = 0;
  defaultVolumeUse = 0;
  defaultVolumeTotal = 0;
  defaultUse = 0;
  defaultNumber = 0;
  defaultUseBlock = 0;
  defaultTotalBlock = 0;

  // check block data number %
  checkDataNodeNumber = new BehaviorSubject(10);
  checkNameNodeNumber = new BehaviorSubject(40);
  checkDataVolumeNumber = new BehaviorSubject(50);
  checkdataBlockNumber = new BehaviorSubject(60);

  constructor(private shareData: ShareDataBreadcrumbService,
              public datalakeDashboardService: DatalakeDashboardService,
              public dialogService: NbDialogService) {
  }

  ngOnInit() {
    this.sendDataBreadCrumb()
    this.isAdmin = localStorage.getItem('roleGroup');
    // this.listCmCluster = [{
    //   clusterName: '11', value: 11
    // }, {
    //   clusterName: '11', value: 11
    // }, {
    //   clusterName: '11', value: 11
    // }];
    // this.Dashboard = '11';
    this.getClusterApp();
  }

  getClusterApp() {
    this.datalakeDashboardService.getCmCluster().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.listCmCluster = res.body.results;
        this.Dashboard = this.listCmCluster[0].clusterName
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    });
  }

  checkDashboard()
    :
    void {
    if (this.Dashboard
    ) {
      this.checkDataBlock(this.Dashboard);
      this.checkDataNode(this.Dashboard);
      this.checkDataVolume(this.Dashboard);
      this.checkNameNode(this.Dashboard);
    }
  }

  checkNameNode(data ?: any) {
    this.datalakeDashboardService.checkNameNode(data).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {

        this.defaultNameUse = res.body.results[0].use;
        this.defaultNameTotal = res.body.results[0].total;
        this.checkNameNodeNumber.next(Number.parseInt(res.body.results[0].result, 10));
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    })
    // this.defaultNameUse = 12000000000000000000;
    // this.defaultNameTotal = 120000000000000000;
  }

  checkDataVolume(data ?: any) {
    this.datalakeDashboardService.checkDataVolume(data).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {

        this.defaultVolumeUse = res.body.results[0].use;
        this.defaultVolumeTotal = res.body.results[0].total;
        this.checkDataVolumeNumber.next(Number.parseInt(res.body.results[0].result, 10));
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    })
    // this.defaultVolumeUse = 13000000000000000000;
    // this.defaultVolumeTotal = 130000000000000000;
  }

  checkDataNode(data ?: any) {
    this.datalakeDashboardService.checkDataNode(data).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {

        // this.dataUseNumber.next(res.body.result[0].use);
        // this.dataDetailNumber.next(res.body.result[0].detail);
        this.defaultUse = res.body.results[0].use;
        this.defaultNumber = res.body.results[0].total;

        this.checkDataNodeNumber.next(Number.parseInt(res.body.results[0].result, 10));
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    })
    // this.defaultUse = 1000000000000000000;
    // this.defaultNumber = 10000000000000000;
  }

  checkDataBlock(data ?: any) {
    this.datalakeDashboardService.checkDataBlock(data).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.defaultUseBlock = res.body.results[0].use;
        this.defaultTotalBlock = res.body.results[0].total;
        this.checkdataBlockNumber.next(Number.parseInt(res.body.results[0].result, 10));
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    })
    // this.defaultUseBlock = 14000000000000000000;
    // this.defaultTotalBlock = 140000000000000000;
  }

  sendDataBreadCrumb() {
    this.shareData.updateData({
      title: 'Dashboard',
      // titleChild: '',
      urlPage: '/page/dashboards',
    });
  }
}
