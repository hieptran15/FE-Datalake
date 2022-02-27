import {ActivatedRoute, Router} from '@angular/router';
import * as fileSaver from 'file-saver';

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {ShareDataBreadcrumbService} from '../../../../services/share-data-breadcrumb.service';
import {AsyncSubject, BehaviorSubject, Subscription} from 'rxjs';
import {SupportRequestService} from '../../../../services/support-request.service';

@Component({
  selector: 'ngx-perform-sr',
  templateUrl: './perform-sr.component.html',
  styleUrls: ['./perform-sr.component.scss'],
})
export class PerformSRComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  linearMode = true;
  StepNumber: number = 0;
  @ViewChild('stepper') stepperComponent: any;
  @Input() typeRequest: any;
  @Input() paramId;
  @Input() dataItems: any;

  // @Input() listThrift:any;
  // @Input() listRpApp:any;
  // @Input() listServer:any;

  ipServer?: any;
  listThrift?: any;
  rpApp?: any;

  isCanActiveSR = new BehaviorSubject(false);

  @Output() ActionStepSr = new EventEmitter<any>();
  @ViewChild('StepAction') viewActionPopup: any;
  LabelPerformsr?: string;
  styleLabel: any;
  stepLock?: number;
  labelStep1Iptable?: TemplateRef<any>;

  isLoadingProgress1 = true;
  LoadingProgressNumber1 = 0;
  isCompletedStep1 = false;

  isLoadingProgress2 = true;
  LoadingProgressNumber2 = 0;
  isCompletedStep2 = false;

  isLoadingProgress3 = true;
  LoadingProgressNumber3 = 0;
  isCompletedStep3 = false;

  isLoadingProgress4 = true;
  LoadingProgressNumber4 = 0;
  isCompletedStep4 = false;

  isLoadingProgress5 = true;
  LoadingProgressNumber5 = 0;
  isCompletedStep5 = false;

  isLoadingProgress6 = true;
  LoadingProgressNumber6 = 0;
  isCompletedStep6 = false;

  fileDownload: any;

  // bien luu data loi
  dataError = new BehaviorSubject('');

  // bien luu number step
  StepNumberSR?: any;

  // biến lưu case trả về lỗi
  isCompleteProgres6 = false;
  isCompleteProgres5 = false;
  isCompleteProgres4 = false;
  isCompleteProgres3 = false;
  isCompleteProgres2 = false;
  isCompleteProgres1 = false;

  // biến chạy action call api
  isResetProgres1 = false;
  isResetProgres2 = false;
  isResetProgres3 = false;
  isResetProgres4 = false;
  isResetProgres5 = false;
  isResetProgres6 = false;

  // biến lưu lại các step trong stepper
  stepperIndex = 0;
  // biến mở popup
  LoadingThreadPopup?: Subscription;

  constructor(
    public dialogService: NbDialogService,
    public shareData: ShareDataBreadcrumbService,
    public router: Router,
    public toastrService: NbToastrService,
    public supportRequestService: SupportRequestService
  ) {
    this.getListServer();
    this.getAllLbRpApp();
    this.getListWpThrift();
  }

  LoadingMathSR() {
    this.supportRequestService
      .LoadingMathSR(this.dataItems.id)
      .subscribe((res) => {
        console.log(res);
        // console.log("number step : ", res.body.results);
        const number_cache = res.body.results;
        if (!isNaN(number_cache)) {
          this.StepNumberSR = number_cache;
        } else {
          this.StepNumberSR = undefined;
        }
        // if(res.body.results !== )
      });
  }

  getListServer() {
    this.supportRequestService.getListServer().subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        this.ipServer = res.body.results;
        if (this.typeRequest === 'iptables') {
          const data_find = JSON.parse(this.dataItems.info).serverId;
          // this.ipServer = res.body.results.filter(x => x.id === data_find)
          // console.log('data server ', this.ipServer[0]);
        }
      } else {
        // this.dialogService.open(PopupErrorComponent, {
        //   context: {error: res.body.message},
        //   closeOnEsc: false,
        //   closeOnBackdropClick: false
        // })\
      }
    });
  }

  getListWpThrift() {
    // const options = {
    //   rpAppId: id
    // }

    this.supportRequestService.getListWpThrift().subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        // this.listThrift = res.body.results;

        if (this.typeRequest === 'thrift_connection') {
          const data_find = JSON.parse(this.dataItems.info).thrift;
          this.listThrift = res.body.results;
          console.log('rp_app:', this.listThrift);
          console.log(data_find);
        }
      } else {
        // this.dialogService.open(PopupErrorComponent, {
        //   context: {error: res.body.message},
        //   closeOnEsc: false,
        //   closeOnBackdropClick: false
        // })
      }
    });
  }

  getAllLbRpApp() {
    this.supportRequestService.getAllLbRpApp().subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        // this.rpApp = res.body.results;

        if (this.typeRequest === 'lb_connection') {
          const data_find = JSON.parse(this.dataItems.info).rpapp;
          this.rpApp = res.body.results.filter((x) => x.name === data_find);
          console.log('rp_app:', this.rpApp);
        }
      } else {
        // this.dialogService.open(PopupErrorComponent, {
        //   context: {error: res.body.message},
        //   closeOnEsc: false,
        //   closeOnBackdropClick: false
        // })
      }
    });
  }

  checkCanActionSR(): void {
    this.supportRequestService.checkCanActionSR(this.dataItems.id).subscribe(
      (res) => {
        if (res.body.errorKey === '00') {
          this.ControlStepper();
          this.shareData.updateShareStatusSRValue(false);
        } else {
          this.toastrService.danger('Fail ', 'Yêu cầu mở kết nối chưa được chấp thuận ');
          this.shareData.updateShareStatusSRValue(true);
        }
      },
      (error) => {
        this.toastrService.danger('Fail ', 'Yêu cầu mở kết nối chưa được chấp thuận ');
        this.shareData.updateShareStatusSRValue(true);

      }
    );
    // console.log(this.dataItems);
  }

  ngOnChanges() {
    console.log('param id ', this.paramId);
    console.log('data:', this.dataItems);
    if (this.typeRequest === null || this.typeRequest === undefined) {
      this.typeRequest = this.dataItems.type;
      console.log(this.typeRequest);
    }
    // this.typeRequest = this.dataItems.type;
    const data_info = JSON.parse(this.dataItems.info);
    console.log('data_info ', data_info);

    this.isLoadingProgress1 = true;
    this.isLoadingProgress2 = true;
    this.isLoadingProgress3 = true;
    this.isLoadingProgress4 = true;
    this.isLoadingProgress5 = true;
    this.isLoadingProgress6 = true;

    this.isCompleteProgres1 = false;
    this.isCompleteProgres2 = false;
    this.isCompleteProgres3 = false;
    this.isCompleteProgres4 = false;
    this.isCompleteProgres5 = false;
    this.isCompleteProgres6 = false;

    this.fileDownload = 'test123456.html';
    if (this.typeRequest === 'iptables') {
      this.LabelPerformsr = 'Iptables';
      this.styleLabel = {
        // 'height': 200 + 'px',
        color: '#0F70F5',
      };
      this.stepLock = 5;
    } else if (this.typeRequest === 'thrift_connection') {
      this.styleLabel = {
        // 'height': 200 + 'px',
        color: '#FFC300',
      };
      this.stepLock = 6;
      this.LabelPerformsr = 'Thrift';
    } else if (this.typeRequest === 'lb_connection') {
      this.styleLabel = {
        // 'height': 200 + 'px',
        color: '#02BF51',
      };
      this.stepLock = 6;
      this.LabelPerformsr = 'LB connection';
    }

    // if (this.typeRequest === 'iptables') {
    //
    // } else if (this.typeRequest === 'thrift_connection') {
    //
    // } else if (this.typeRequest === 'lb_connection') {
    //
    // }

    this.LoadingThreadPopup = this.shareData.ThreadPerformSR.subscribe(
      (res: any) => {
        if (res === 'action') {
          this.checkCanActionSR();
          console.log('res:', res);
        } else if (res === 'cancel') {
          this.OpenCancelActionPopup();
          console.log(res);
        }
      }
    );
  }

  ngOnInit(): void {
    // this.checkCanActionSR();
  }

  ngAfterViewInit() {
    this.stepperComponent.reset();
    this.stepperComponent.selectedIndex = 0;
    this.isCompletedStep1 = false;
  }

  toggleLinearMode() {
    this.linearMode = !this.linearMode;
  }

  ControlStepper() {
    this.stepperComponent.reset();
    this.dialogService.open(this.viewActionPopup, {
      context: {
        body: 'Bạn có chắc chắn muốn kiểm tra Support Request',
        title: 'Kiểm tra SR',
        type: 'action',
      },
    });
    // }
  }

  resetLoadingProgress1(isSucessStep?: string) {
    let isBug500 = false;

    this.stepperIndex = 0;
    this.isLoadingProgress1 = true;
    console.log(this.stepperIndex);
    this.isCompleteProgres1 = true;

    this.LoadingProgressNumber1 = 0;

    // chay call api;
    let checkdataapi = false;

    let datastep1;
    if (this.typeRequest === 'iptables') {
      try {
        // const serverIp =
        console.log('list ip : ', JSON.parse(this.dataItems.info).serverId);
        let data_find = JSON.parse(this.dataItems.info).serverId;
        data_find = this.ipServer.filter((x) => x.id === data_find);
        // console.log('server ip :', this.ipServer);
        datastep1 = {
          type: 'iptables',
          serverIp: data_find[0].ip,
          rpApp: '',
          listThriftIp: [],
        };
      } catch (e) {
        isBug500 = true;
      }
    } else if (this.typeRequest === 'thrift_connection') {
      // console.log('data find : ', this.dataItems.info.thriftId);
      // console.log('find data : ', this.listThrift)
      try {
        const data_fake = this.listThrift.filter(
          (x) => x.id === JSON.parse(this.dataItems.info).thriftId
        )[0].host;
        const thrift_call_api = [];
        thrift_call_api.push(data_fake);
        console.log('match : ', thrift_call_api);
        console.log('thrift ip : ', JSON.parse(this.dataItems.info).thriftId);
        datastep1 = {
          type: 'thrift_connection',
          serverIp: '',
          rpApp: '',
          listThriftIp: thrift_call_api,
        };
      } catch (e) {
        isBug500 = true;
      }
    } else if (this.typeRequest === 'lb_connection') {
      try {
        console.log('list rp-app ', JSON.parse(this.dataItems.info).rpapp);
        const rpappids = JSON.parse(this.dataItems.info)
        datastep1 = {
          type: 'lb_connection',
          serverIp: '',
          rpApp: rpappids?.rpapp,
          listThriftIp: [],
        };
      } catch (e) {
        isBug500 = true;
      }
    }

    // console.log('datastep1',datastep1);
    this.supportRequestService.checkServer(datastep1).subscribe(
      (res) => {
        // console.log(res);
        if (res.body.errorKey === '00') {
          checkdataapi = true;
          return checkdataapi;
        }
      },
      (error) => {
        if (isBug500 === true) {
          this.dataError.next('Thiếu dữ liệu cần thiết ');
        } else {
          // this.dataError.next(error.error.message);
          // return this.dataError;
          if (error.error.errorKey === '02') {
            this.dataError.next('Tài khoản hoặc mật khẩu k chính xác');
            return this.dataError;
          }
        }
      }
    );
    const Loading = setInterval(() => {
      if (this.LoadingProgressNumber1 < 100) {
        this.LoadingProgressNumber1++;
        this.isCompletedStep1 = false;
        // this.isLoadingProgress1=false;
      } else {
        clearInterval(Loading);
        this.isCompleteProgres1 = false;
        if (isSucessStep === 'true') {
          if (checkdataapi === true) {
            this.stepperComponent.next();
            this.resetLoadingProgress2('true');
          } else {
            this.isLoadingProgress1 = false;
            // this.stepperComponent.next();
            // this.resetLoadingProgress2("true");
          }
        } else {
          if (checkdataapi === true) {
            this.stepperComponent.next();
            this.resetLoadingProgress2('true');
          } else {
            this.isLoadingProgress1 = false;
          }
        }
      }
    }, 130);
    // }


    // this.stepperComponent.next();
    // this.resetLoadingProgress2('true');
  }

  resetLoadingProgress2(isSucessStep?: string) {
    this.stepperIndex = 1;
    this.isLoadingProgress2 = true;
    console.log(this.stepperIndex);
    this.isCompleteProgres2 = true;

    this.LoadingProgressNumber2 = 0;
    const Loading = setInterval(() => {
      if (this.LoadingProgressNumber2 < 100) {
        this.LoadingProgressNumber2++;
        this.isCompletedStep2 = false;
        // this.isLoadingProgress1=false;
      } else {
        clearInterval(Loading);
        this.isCompleteProgres2 = false;
        if (isSucessStep === 'true') {
          this.stepperComponent.next();
          this.resetLoadingProgress3('true');
        } else {
          this.stepperComponent.next();
          this.resetLoadingProgress3('true');
        }
      }
    }, 30);
    // }

    // this.stepperComponent.next();
    // this.resetLoadingProgress3('true');
  }

  resetLoadingProgress3(isSucessStep?: string) {
    console.log('isSucessStep', isSucessStep);
    this.stepperIndex = 2;
    console.log(this.stepperIndex);
    this.isLoadingProgress3 = true;
    this.isCompleteProgres3 = true;

    this.LoadingProgressNumber3 = 0;
    const check = false;
    console.log('data:', this.dataItems);
    const user_id = this.dataItems.id;
    // chay call api;
    let checkdataapi = false;
    this.supportRequestService.checkUserAndIp(user_id).subscribe(
      (res) => {
        console.log(res);
        if (res.body.errorKey === '00') {
          checkdataapi = true;

          if (res.body.results[0]) {
            this.fileDownload = res.body.results[0];
          }
          this.isCompleteProgres3 = false;
          this.stepperComponent.next();
          this.resetLoadingProgress4('true');
          return checkdataapi;
        }
      },
      (error) => {
        this.isLoadingProgress3 = false;
        if (error.error.errorKey === '05') {
          this.dataError.next('user và ip chưa được kích hoạt!');
          return this.dataError;
        }
      }
    );

    // const Loading = setInterval(() => {
    //   if (this.LoadingProgressNumber3 < 100) {
    //     this.LoadingProgressNumber3++;
    //     this.isCompletedStep3 = false;
    //     // this.isLoadingProgress1=false;
    //   } else {
    //     clearInterval(Loading);
    //     this.isCompleteProgres3 = false;
    //     if (isSucessStep === 'true') {
    //       // if (this.typeRequest === 'iptables') { // check truong hop tra ve sucess
    //       //   this.stepperComponent.next();
    //       //   this.resetLoadingProgress4('true');
    //       // } else if (this.typeRequest === 'thrift_connection') { // check truong hop tra ve fail
    //       //   // this.stepperComponent.next();
    //       //   // this.isLoadingProgress3 = false;
    //       //   // this.resetLoadingProgress4('true');
    //       // }
    //       // console.log('check value : ',)
    //       if (checkdataapi === true) {
    //         if (this.fileDownload) {
    //           this.isOpenDownloadFile = true;
    //         }
    //         this.stepperComponent.next();
    //         // this.isLoadingProgress3 = false;
    //         this.resetLoadingProgress4('true');
    //       } else {
    //         this.isLoadingProgress3 = false;
    //
    //         // this.stepperComponent.next();
    //         // // this.isLoadingProgress3 = false;
    //         // this.resetLoadingProgress4("true");
    //       }
    //     } else {
    //       if (checkdataapi === true) {
    //         this.stepperComponent.next();
    //         // this.isLoadingProgress3 = false;
    //         this.resetLoadingProgress4('true');
    //       } else {
    //         this.isLoadingProgress3 = false;
    //       }
    //     }
    //   }
    // }, 130);

    // this.stepperComponent.next();
    // this.resetLoadingProgress4('true');
  }

  resetLoadingProgress4(isSucessStep?: string) {
    console.log('isSucessStep', isSucessStep);
    this.stepperIndex = 3;
    console.log(this.stepperIndex);
    this.isLoadingProgress4 = true;
    this.isCompleteProgres4 = true;

    this.LoadingProgressNumber4 = 0;

    const user_id = this.dataItems.id;
    // console.log('data_id ', user_id);
    // console.log('data: ', JSON.parse(this.dataItems.info.toString()));
    let thrift_array;
    let string_thrift;
    try {
      if (this.typeRequest === 'lb_connection') {
        thrift_array = JSON.parse(this.dataItems.info.toString());
        // string_thrift = thrift_array.thrift.map((x) => x.thriftId)[0];
        string_thrift = thrift_array?.wpThriftId;
      } else if (this.typeRequest === 'thrift_connection') {
        thrift_array = JSON.parse(this.dataItems.info.toString());
        string_thrift = thrift_array?.thriftId;
      } else {
        thrift_array = null;
        string_thrift = null;
      }
    } catch {
      thrift_array = null;
      string_thrift = null;
    }

    // thrift_array.forEach((element: any) => {
    //   console.log('item : ', element);
    // })
    console.log('data:', string_thrift);
    const checkdataapi = new BehaviorSubject(false);
    if (this.typeRequest !== 'iptables') {
      this.supportRequestService.checkThrift(string_thrift).subscribe(
        (res) => {
          if (res.body.errorKey === '00') {
            checkdataapi.next(true);
          } else {
          }
        },
        (error) => {
          if (error.error.errorKey === '05') {
            this.dataError.next('Thrift ko được kích hoạt!');
            return this.dataError;
          }
        }
      );
      const Loading = setInterval(() => {
        if (this.LoadingProgressNumber4 < 100) {
          this.LoadingProgressNumber4++;
          this.isCompletedStep4 = false;
          // this.isLoadingProgress1=false;
        } else {
          clearInterval(Loading);
          this.isCompleteProgres4 = false;
          if (isSucessStep === 'true') {
            if (checkdataapi.value === true) {
              this.stepperComponent.next();
              // this.isLoadingProgress3 = false;
              this.resetLoadingProgress5('true');
            } else {
              this.isLoadingProgress4 = false;

              // this.stepperComponent.next();
              // // this.isLoadingProgress3 = false;
              // this.resetLoadingProgress5("true");
            }
          } else {
            // debugger;
            // if (checkdataapi.value === true) {
            //   // this.stepperComponent.next();
            //   this.isLoadingProgress4 = false;
            //   // this.resetLoadingProgress5('true');
            // } else {
            //   this.isLoadingProgress4 = false;
            // }
          }
        }
      }, 130);
    } else {
      const formdata = new FormData();
      formdata.append('id', this.dataItems.id);
      formdata.append('createBy', this.dataItems.createBy);
      formdata.append('title', this.dataItems.title);
      formdata.append('type', this.dataItems.type);
      formdata.append('status', this.dataItems.status);
      formdata.append('info', this.dataItems.info);
      formdata.append('description', this.dataItems.description);
      if (this.dataItems?.fileUrl !== null) {
        formdata.append('fileUrl', this.dataItems.fileUrl);
      }
      // formdata.append('listUserMapping', '[{"srId":1,"userName":"hoandx","ipAddress":"128.199.239.168","groupName":"TEST1"},{"srId":1,"userName":"admin","ipAddress":"103.229.249.167","groupName":"KAFKA1"}]');
      // this.LoadingMathSR();
      this.supportRequestService.RunActionSR(formdata).subscribe(
        (res) => {
          this.isCompleteProgres4 = false;
          console.log(res);
          checkdataapi.next(true);
          this.stepperComponent.next();
          this.resetLoadingProgress5('true');
        },
        (error) => {
          this.isCompleteProgres4 = false;
          this.isLoadingProgress4 = false;
          console.log(error);
          checkdataapi.next(false);
          if (error.error.errorKey === '06') {
            this.dataError.next('thực hiện ssh không thành công')
          } else if (error.error.errorKey === '07') {
            this.dataError.next('Connect server thất bại')
          } else if (error.error.errorKey === '08')
            this.dataError.next('Thông tin chưa chính xác');
          else {
            this.dataError.next('Lỗi thực hiện, thông tin sr chưa chính xác ');
          }
        }
      );

      // if (this.StepNumberSR !== undefined) {
      //   const Loading = setInterval(() => {
      //     if (this.LoadingProgressNumber4 < this.StepNumberSR) {
      //       this.LoadingProgressNumber4++;
      //       this.isCompletedStep4 = false;
      //       // this.isLoadingProgress1=false;
      //     } else if ((this.LoadingProgressNumber4 = this.StepNumberSR)) {
      //       clearInterval(Loading);
      //       this.isCompleteProgres4 = false;
      //       if (isSucessStep === 'true') {
      //         // if (this.typeRequest === 'iptables') {
      //         //   this.stepperComponent.next();
      //         //   this.resetLoadingProgress5('true');
      //         // } else if (this.typeRequest === 'thrift_connection') {
      //         //   this.stepperComponent.next();
      //         //   this.resetLoadingProgress5('true');
      //         // }
      //         if (checkdataapi.value === true) {
      //           this.stepperComponent.next();
      //           // this.isLoadingProgress3 = false;
      //           this.resetLoadingProgress5('true');
      //         } else {
      //           this.isLoadingProgress4 = false;
      //         }
      //       } else {
      //         // if (checkdataapi.value === true) {
      //         //   this.stepperComponent.next();
      //         //   // this.isLoadingProgress3 = false;
      //         //   this.resetLoadingProgress5('true');
      //         // } else {
      //         //   this.isLoadingProgress4 = false;
      //         // }
      //       }
      //     }
      //   }, 130);
      // } else {
      //   const Loading = setInterval(() => {
      //     if (this.LoadingProgressNumber4 < 100) {
      //       this.LoadingProgressNumber4++;
      //       this.isCompletedStep4 = false;
      //     } else {
      //       clearInterval(Loading);
      //       this.isCompleteProgres4 = false;
      //       if (isSucessStep === 'true') {
      //         // if (this.typeRequest === 'iptables') {
      //         //   this.stepperComponent.next();
      //         //   this.resetLoadingProgress5('true');
      //         // } else if (this.typeRequest === 'thrift_connection') {
      //         //   this.stepperComponent.next();
      //         //   this.resetLoadingProgress5('true');
      //         // }
      //         if (checkdataapi.value === true) {
      //           this.stepperComponent.next();
      //           // this.isLoadingProgress3 = false;
      //           this.resetLoadingProgress5('true');
      //         } else {
      //           this.isLoadingProgress4 = false;
      //         }
      //       } else {
      //         // if (checkdataapi.value === true) {
      //         //   this.stepperComponent.next();
      //         //   // this.isLoadingProgress3 = false;
      //         //   this.resetLoadingProgress5('true');
      //         // } else {
      //         //   this.isLoadingProgress4 = false;
      //         // }
      //       }
      //     }
      //   }, 130);
      // }
    }


    // // }
    // this.stepperComponent.next();
    // this.resetLoadingProgress5('true');
  }

  resetLoadingProgress5(isSucessStep?: string) {
    this.stepperIndex = 4;
    console.log('ss5:', this.stepperIndex);
    this.isCompletedStep6 = false;
    this.isCompletedStep5 = false;
    this.stepperComponent.selectedIndex = 4;


    this.isLoadingProgress5 = true;
    this.isCompleteProgres5 = true;
    let checkdataapi = false;
    this.LoadingProgressNumber5 = 0;
    if (this.typeRequest !== 'iptables') {
      const formdata = new FormData();
      formdata.append('id', this.dataItems.id);
      formdata.append('createBy', this.dataItems.createBy);
      formdata.append('title', this.dataItems.title);
      formdata.append('type', this.dataItems.type);
      formdata.append('status', this.dataItems.status);
      formdata.append('info', this.dataItems.info);
      formdata.append('description', this.dataItems.description);
      if (this.dataItems?.fileUrl !== null) {
        formdata.append('fileUrl', this.dataItems.fileUrl);
      }
      // formdata.append('listUserMapping', '[{"srId":1,"userName":"hoandx","ipAddress":"128.199.239.168","groupName":"TEST1"},{"srId":1,"userName":"admin","ipAddress":"103.229.249.167","groupName":"KAFKA1"}]');
      // this.LoadingMathSR();
      this.supportRequestService.RunActionSR(formdata).subscribe(
        (res) => {
          this.isCompleteProgres5 = false;
          console.log(res);
          checkdataapi = true;
          this.stepperComponent.next();
          this.resetLoadingProgress6('true');
          // this.LoadingMathSR();
        },
        (error) => {
          console.log(error);
          checkdataapi = false;
          this.isCompleteProgres5 = false;
          this.isLoadingProgress5 = false;

          if (error.error.errorKey === '06') {
            this.dataError.next('thực hiện ssh không thành công')
          } else if (error.error.errorKey === '07') {
            this.dataError.next('Connect server thất bại')
          } else if (error.error.errorKey === '08')
            this.dataError.next('Thông tin chưa chính xác');
          else {
            this.dataError.next('Lỗi thực hiện, thông tin sr chưa chính xác ');
          }
        }
      );


      // if (this.StepNumberSR !== undefined) {
      //
      //   this.LoadingProgressNumber5 = 0;
      //   const Loading = setInterval(() => {
      //     if (this.LoadingProgressNumber5 < this.StepNumberSR) {
      //       console.log(this.LoadingProgressNumber5);
      //       this.LoadingProgressNumber5++;
      //       this.isCompletedStep5 = false;
      //       // this.isLoadingProgress1=false;
      //     } else if ((this.LoadingProgressNumber5 = this.StepNumberSR)) {
      //       // debugger;
      //       clearInterval(Loading);
      //       this.isCompleteProgres5 = false;
      //       if (isSucessStep === 'true') {
      //         // if (this.typeRequest === 'iptables') {
      //         //   this.stepperComponent.next();
      //         //   this.resetLoadingProgress5('true');
      //         // } else if (this.typeRequest === 'thrift_connection') {
      //         //   this.stepperComponent.next();
      //         //   this.resetLoadingProgress5('true');
      //         // }
      //         if (checkdataapi === true) {
      //           this.stepperComponent.next();
      //           this.isLoadingProgress3 = false;
      //           this.resetLoadingProgress6('true');
      //         } else {
      //           this.isLoadingProgress5 = false;
      //         }
      //       } else {
      //         // if (checkdataapi === true) {
      //         //   this.stepperComponent.next();
      //         //   // this.isLoadingProgress3 = false;
      //         //   this.resetLoadingProgress6('true');
      //         // } else {
      //         //   this.isLoadingProgress5 = false;
      //         // }
      //       }
      //     }
      //   }, 130);
      // } else {
      //   this.LoadingProgressNumber5 = 0;
      //   const Loading = setInterval(() => {
      //     if (this.LoadingProgressNumber5 < 100) {
      //       this.LoadingProgressNumber5++;
      //       this.isCompletedStep5 = false;
      //       console.log(this.LoadingProgressNumber5);
      //     } else {
      //       clearInterval(Loading);
      //       this.isCompleteProgres5 = false;
      //       if (isSucessStep === 'true') {
      //         // if (this.typeRequest === 'iptables') {
      //         //   this.stepperComponent.next();
      //         //   this.resetLoadingProgress5('true');
      //         // } else if (this.typeRequest === 'thrift_connection') {
      //         //   this.stepperComponent.next();
      //         //   this.resetLoadingProgress5('true');
      //         // }
      //         console.log(this.stepperComponent.selectedIndex);
      //         if (checkdataapi === true) {
      //           this.stepperComponent.next();
      //           // this.isLoadingProgress3 = false;
      //           this.resetLoadingProgress6('true');
      //         } else {
      //           this.isLoadingProgress5 = false;
      //         }
      //       } else {
      //         // if (checkdataapi === true) {
      //         //   this.stepperComponent.next();
      //         //   // this.isLoadingProgress3 = false;
      //         //   this.resetLoadingProgress6('true');
      //         // } else {
      //         //   this.isLoadingProgress5 = false;
      //         // }
      //       }
      //     }
      //   }, 130);
      // }
    } else {
      // let checkdataapi;
      const data1 = {status: 'completed', id: this.dataItems.id};
      this.supportRequestService.ActionCompleteSR(data1).subscribe(
        (res) => {
          console.log(res);
          checkdataapi = true;
        },
        (error) => {
          console.log(error);
          checkdataapi = false;
          if (error.error.errorKey !== '00') {
            this.dataError.next(error.error.message);
            return this.dataError;
          }
        }
      );

      const Loading = setInterval(() => {
        if (this.LoadingProgressNumber5 < 100) {
          this.LoadingProgressNumber5++;
          this.isCompletedStep5 = false;
        } else {
          clearInterval(Loading);
          this.isCompleteProgres5 = false;
          this.stepperComponent.next();

          if (isSucessStep === 'true') {
            if (this.typeRequest !== 'iptables') {
              if (checkdataapi === true) {
              } else {
                this.isLoadingProgress5 = false;
              }
            }
          } else {
          }
        }
      }, 130);
    }

    // this.stepperComponent.next()
    // this.resetLoadingProgress6('true');
  }

  resetLoadingProgress6(isSucessStep?: string) {
    this.stepperIndex = 5;
    console.log(this.stepperIndex);
    this.isLoadingProgress6 = true;
    this.isCompleteProgres6 = true;

    this.LoadingProgressNumber6 = 0;

    let checkdataapi;
    const data1 = {status: 'completed', id: this.dataItems.id};
    this.supportRequestService.ActionCompleteSR(data1).subscribe(
      (res) => {
        console.log(res);
        checkdataapi = true;
      },
      (error) => {
        console.log(error);
        checkdataapi = false;

      }
    );

    const Loading = setInterval(() => {
      if (this.LoadingProgressNumber6 < 100) {
        this.LoadingProgressNumber6++;
        this.isCompletedStep6 = false;
      } else {
        clearInterval(Loading);
        this.isCompleteProgres6 = false;
        this.stepperComponent.next();

        if (isSucessStep === 'true') {
          if (this.typeRequest !== 'iptables') {
            if (checkdataapi === true) {
            } else {
              this.isLoadingProgress6 = false;
            }
          }
        } else {
        }
      }
    }, 130);
    // }
  }

  // function get loading number step

  OpenErrorPopup(element?: TemplateRef<any>, step_title?: string) {

    this.dialogService.open(element, {
      context: {body: this.dataError.value, title: step_title},
    });
  }

  RunStep(element: any, type: any) {
    if (type === 'action') {
      element.close();
      this.RunTotalSR();
    } else if (type === 'cancel') {
      element.close();
      this.router.navigate(['/page/support-request']);
    }
  }

  downloadFile() {
    this.supportRequestService.downloadFile(this.fileDownload).subscribe(res => {
      console.log(res);
      const blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
      fileSaver.saveAs(blob, this.fileDownload);
    }, error => {
      console.log(error);
    });
  }

  ActionWithStepPopup() {
    console.log('stepper component:', this.stepperComponent);
    console.log('index : ', this.stepperComponent.selectedIndex);
    const index_stepper = this.stepperComponent.selectedIndex;
    if (index_stepper === 0) {
    }
  }

  // action chay tu dau toi cuoi
  isOpenDownloadFile = false;

  RunTotalSR() {
    console.log('stepper component:', this.stepperComponent);
    console.log('index : ', this.stepperComponent.selectedIndex);
    const index_stepper = this.stepperComponent.selectedIndex;

    if (index_stepper === 0) {
      this.resetLoadingProgress1('true');
    } else {
      console.log('cannot run request ! ');
    }
  }

  OpenCancelActionPopup() {
    this.dialogService.open(this.viewActionPopup, {
      context: {
        body: 'Bạn có chắc chắn muốn hủy thao tác này ? ',
        title: 'Xác nhận',
        type: 'cancel',
      },
    });
  }

  ngOnDestroy(): void {
    // this.shareData.ThreadPerformSR.isStopped;
    if (this.LoadingThreadPopup) {
      this.LoadingThreadPopup.unsubscribe();
    }
  }
}
