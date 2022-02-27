import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ShareDataBreadcrumbService} from '../../../services/share-data-breadcrumb.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SupportRequestService} from '../../../services/support-request.service';
import {PopupErrorComponent} from '../../popup-error/popup-error.component';
import {NbDialogService} from '@nebular/theme';

@Component({
  selector: 'ngx-open-request',
  templateUrl: './open-request.component.html',
  styleUrls: ['./open-request.component.scss']
})
export class OpenRequestComponent implements OnInit, OnDestroy {
  isRequestSelected = 'CONTENT';
  isLoading: boolean = false;
  private routeSub: Subscription;
  private SRCheck: Subscription;
  private SRCallId: Subscription;
  @ViewChild('actionStepBtn') btnStep: ElementRef;
  paramId: any;
  typeRequest: any;
  dataItems: any;
  checkStartSR: boolean = false;

  constructor(private shareData: ShareDataBreadcrumbService, public router: Router, private route: ActivatedRoute, public supportRequestService: SupportRequestService, public dialogService: NbDialogService) {
    this.routeSub = this.route.params.subscribe(params => {
      this.paramId = params['id'];
    });
    this.shareData.ShareStatusSR.subscribe(res => {
      this.checkStartSR = res;
      console.log(res)
    })
    this.SRCallId = this.shareData.srById.subscribe(res => {
      this.getSupportRequestInfoById();
    })
  }


  ngOnInit(): void {
    if (this.paramId) {
      this.sendDataBreadCrumbDetails();
      this.getSupportRequestInfoById();
    } else {
      this.dataItems = {};
      this.typeRequest = localStorage.getItem('typeRequest');
      this.sendDataBreadCrumb();
    }
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.SRCheck) {
      this.SRCheck.unsubscribe();
    }
    if (this.SRCallId) {
      this.SRCallId.unsubscribe();
    }
    localStorage.removeItem('typeRequest');
  }

  getSupportRequestInfoById() {
    this.supportRequestService.getSupportRequestInfoById(this.paramId).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.dataItems = res.body.results[0];
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
        this.isLoading = false;
      }
    })
  }

  sendDataBreadCrumb() {
    this.shareData.updateData({
      title: 'Utility',
      titleChild: 'Tạo yêu cầu',
      groupText: 'Support request',
      urlParent: '/page/support-request',
      urlPage: '/page/support-request/open-request',
    })
  }

  sendDataBreadCrumbDetails() {
    this.shareData.updateData({
      title: 'Access manager',
      titleChild: 'Chi tiết yêu cầu',
      groupText: 'Support request',
      urlParent: '/page/support-request',
      urlPage: `/page/support-request/request-details/${this.paramId}`,
    })
  }

  checkRequestKey(key: string): void {
    this.isRequestSelected = key;
    // console.log('typerequest :', this.typeRequest);
  }

  navigateToRequest() {
    this.router.navigate(['/page/support-request'])
  }

  ActionStep(data: any) {
    this.shareData.StepNextThreadPerformSR(data);
  }

  actionContentSR(key: string) {
    console.log(key)
    this.shareData.sendSR(key)
  }

  checkParamId() {
    if (this.paramId === undefined) {
      return 'var(--color-button-cancel)';
    }
    return 'unset';
  }
}
