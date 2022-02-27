import {Component, OnInit, ViewChild} from '@angular/core';
import {PopupErrorComponent} from '../popup-error/popup-error.component';
import {AccessManagementService} from '../../@core/mock/access-management.service';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {IpTableRuleService} from '../../services/ip-table-rule.service';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';
import {AuthoritiesConstant} from '../../authorities.constant';
import {Page} from '../../@core/model/page.model';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {NgSelectComponent} from '@ng-select/ng-select';
import {SendRequireComponent} from '../access-management/send-require/send-require.component';
import {RpAppService} from '../../services/rp-app.service';

@Component({
  selector: 'ngx-rp-app',
  templateUrl: './rp-app.component.html',
  styleUrls: ['./rp-app.component.scss'],
})
export class RpAppComponent implements OnInit {
  @ViewChild('treemenu')
  public treeContextMenu: any;
  @ViewChild(SendRequireComponent) sendRequireComponent: any;
  @ViewChild(DatatableComponent) public table: DatatableComponent;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;

  columnsTable = [
    {name: 'Index', prop: 'id', flexGrow: 0.5},
    {name: 'Name', prop: 'name', flexGrow: 0.9},
    {name: 'Server', prop: 'ip', flexGrow: 0.9},
    {name: 'Port', prop: 'port', flexGrow: 0.9},
    {name: 'Thrift', prop: 'listWpThriftEntity', flexGrow: 0.9},
    {name: 'Trạng thái ', prop: 'status', flexGrow: 0.6},
    {name: 'Action', prop: 'action', flexGrow: 0.8},
  ];

  // luu tam row data
  dataCache: any;
  dataTableCache: any;
  rowData = [];
  currentTheme: any = 'dark';
  currentAppId;
  public currentVisible: number = 0;
  checkDate: boolean = false;
  dataApp: any;
  dataDetail: any = {};
  dataTable = [];
  defaultStatus;
  dateCreate: any;
  Thrift: any;
  defaultFilterTable;
  filterTable;
  limits = [5, 10, 15, 20];
  limit = 10;
  rows = [];
  selectRowWhenEdit = {};
  browserFileButton: boolean;
  isFilerBox: boolean = false;
  UserIptableRule = [];
  ServerIptableRule = [];
  StatusIptableRule = [
    {id: 1, value: 'Active'},
    {id: 0, value: 'Lock'},
  ];
  UIDtableRule = [];

  formGroupRPApp: FormGroup = this.fb.group({
    Name: [null, [Validators.required]],
    Server: [null, [Validators.required]],
    Port: [null],
    Directory: [null, [Validators.required]],
    Thrift: [null, [Validators.required]],
    Status: [null],
    notification: [null],
  });
  formGroup: FormGroup = this.fb.group({
    accessStatus: [null],
    accessSearch: [null],
    accessCluster: [null],
  });
  public items: any[] = [{text: 'Thay đổi thông tin', icon: 'edit'}];
  listApp;
  isLoading: boolean = false;
  objectSearch;
  page = new Page();
  selected = [];
  status = [
    {name: 'All', value: '00'},
    {name: 'Server', value: '04'},
    {name: 'Port', value: '01'},
    {name: 'Thrift', value: '02'},
    {
      name: 'Status',
      value: '03',
    },
  ];
  textSearch = '';
  authority = AuthoritiesConstant;
  private contextItem: any;
  private base64File: any;
  private fileNameOld: any;

  constructor(
    private accessManagementService: AccessManagementService,
    public translate: TranslateService,
    public rpAppService: RpAppService,
    private fb: FormBuilder,
    public dialogService: NbDialogService,
    private toastrService: NbToastrService,
    public IptableService: IpTableRuleService,
    private shareData: ShareDataBreadcrumbService
  ) {

    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  getAllData() {
    this.isLoading = true;
    this.rpAppService.GetAll().subscribe((data) => {
      console.log('table data : ', data);

      this.dataTableCache = data.body.results;
      this.rowData = this.dataTableCache;
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.rpAppService.GetAllThriftRPApp().subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        this.ListThriftRPApp = res.body.results;
        console.log('thrift:', res.body.results);
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
    });
    this.rpAppService.GetServerSM().subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        console.log('list server : ', res);
        this.ServerRPApp = res.body.results;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    }, error => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
    });
    this.getAllData();

    this.browserFileButton = true;
    this.sendDataBreadCrumb();

    this.defaultStatus = '00';

    console.log(this.rowData);
  }

  // search data in fe
  doSearch(text: string, type: any): void {

    if (text === '') {
      this.rowData = this.dataTableCache;
      this.isLoading = false;
    } else if (type === '00') {
      const newArray = [];

      this.dataTableCache.forEach((element) => {
        if (element.name.toLowerCase().includes(text, 0)) {
          newArray.push(element);
        }
      });
      this.rowData = newArray;
      this.isLoading = false;
    } else if (type === '04') {
      this.isLoading = false;


      const newArray = [];


      this.dataTableCache.forEach((element) => {
        if (
          element.serverId.toString().toLowerCase().includes(text.toString(), 0)
        ) {
          newArray.push(element);
        }
      });
      this.rowData = newArray;
    } else if (type === '01') {

      this.isLoading = false;
      const newArray = [];


      this.dataTableCache.forEach((element) => {
        if (element.port.toString().toLowerCase().includes(text, 0)) {
          newArray.push(element);
        }
      });
      this.rowData = newArray;
    } else if (type === '03') {
      this.isLoading = false;
      const lock_value = 'lock';
      const active_value = 'active';
      if (
        lock_value.includes(text.toLowerCase()) &&
        text.length <= lock_value.length
      ) {
        this.rowData = this.dataTableCache.filter((x) => x.status === 0);
      } else if (
        active_value.includes(text.toLowerCase()) &&
        text.length <= active_value.length
      ) {
        this.rowData = this.dataTableCache.filter((x) => x.status === 1);
      } else {
        this.rowData = [];
      }
    } else if (type === '02') {
      this.isLoading = false;
      const new_datatable = [];

      let text_input = '';
      if (text.includes(',')) {
        const render_text = text.split(',');
        render_text.forEach((element) => {
          text_input += element.toLowerCase().trim() + ',';
        });
        text_input = text_input.substring(0, text_input.length - 1);
        console.log('textinput : ', text_input);
      } else if (text.includes(';')) {
        const render_text = text.split(';');
        render_text.forEach((element) => {
          text_input += element.toLowerCase().trim() + ',';
        });
        text_input = text_input.substring(0, text_input.length - 1);
        console.log('textinput : ', text_input);
      } else {
        text_input = text;
        console.log('textinput : ', text_input);
      }
      // xu li data tim dc
      this.dataTableCache.forEach((element) => {
        let new_string = '';
        element.listWpThriftEntity.forEach((item) => {
          new_string += item.name + ',';
        });
        new_string = new_string
          .substring(0, new_string.length - 1)
          .toLowerCase();
        // console.log("new_string: ", new_string.toLowerCase());
        if (new_string.includes(text_input, 0)) {
          console.log('match : ', element);
          new_datatable.push(element);
        }
      });
      this.rowData = new_datatable;
    }
  }

  sendDataBreadCrumb() {
    this.shareData.updateData({
      title: 'Access manager',
      groupText: 'LB manager',
      titleChild: 'RP App',
      urlPage: '/page/rp-app',
    });
  }

  dynamicListThriftId: any;
  currentRPAppId: any;
  currentListThriftId: any;
  currentListDataThrift: any;
  currentListDataCallApi: any = [];

  addOrEditConnection(title: string, ref: any) {
    console.log(this.selectRowWhenEdit);
    this.isLoading = true;
    if (title.toLowerCase() === 'add') {

      let thrift_selected;
      thrift_selected = this.formGroupRPApp.controls['Thrift'].value;
      console.log(thrift_selected);
      const list_thrift_add_call_api = [];

      thrift_selected.forEach(element => {
        const item = this.ListThriftRPApp.filter((x) => x.id === element)
        list_thrift_add_call_api.push(item[0]);
      })


      const data_response_object = {

        serverId: this.formGroupRPApp.controls['Server'].value,
        // port: this.formGroupRPApp.controls['Port'].value,
        directory: this.formGroupRPApp.controls['Directory'].value,
        status: 1,
        name: this.formGroupRPApp.controls['Name'].value,
        listWpThriftId: this.formGroupRPApp.controls['Thrift'].value,
        script: this.formGroupRPApp.controls['notification'].value,
        listWpThriftEntity: list_thrift_add_call_api
      };
      console.log('before call api :', data_response_object);
      this.rpAppService
        .CreateRPApp(data_response_object)

        .subscribe((res: any) => {

          if (res.body.errorKey === '00') {

            this.getAllData();
            // console.log(res)
            this.toastrService.success(
              'Success',
              this.translate.instant('toast.note')
            );

            ref.close();
            this.isLoading = false;
          }

        }, error => {
          if (error.error.errorKey === '01') {
            this.toastrService.danger('Fail ', 'Duplicate name ');
            ref.close();
            this.isLoading = false;
          } else if (error.error.errorKey === '11') {
            console.log('res : ', error);
            this.toastrService.danger(
              'Fail',
              this.translate.instant('toast.note')
            );
            ref.close();
            this.isLoading = false;
          }
        });


    } else if (title.toLowerCase() === 'edit') {
      let data_add;
      let data_remove;
      this.isLoading = true;
      const dynamic_thrift_data = this.formGroupRPApp.controls['Thrift'].value;
      console.log('update data : ', dynamic_thrift_data);
      console.log('current data :', this.dynamicListThriftId);

      if (dynamic_thrift_data.length > this.dynamicListThriftId.length) {
        data_add = dynamic_thrift_data.filter(
          (x) => !this.dynamicListThriftId.includes(x)
        );
        data_remove = this.dynamicListThriftId.filter(
          (x) => !dynamic_thrift_data.includes(x)
        );
        console.log('add   : ', data_add);
        console.log('remove : ', data_remove);
      } else if (this.dynamicListThriftId > dynamic_thrift_data) {
        data_add = dynamic_thrift_data.filter(
          (x) => !this.dynamicListThriftId.includes(x)
        );
        data_remove = this.dynamicListThriftId.filter(
          (x) => !dynamic_thrift_data.includes(x)
        );
        console.log('remove   : ', data_remove);
        console.log('add : ', data_add);
      } else {
        data_add = dynamic_thrift_data.filter(
          (x) => !this.dynamicListThriftId.includes(x)
        );
        data_remove = this.dynamicListThriftId.filter(
          (x) => !dynamic_thrift_data.includes(x)
        );
        console.log('remove  : ', data_remove);
        console.log('add   : ', data_add);
      }

      const data_response_object1 = {
        id: this.currentRPAppId,
        serverId: this.formGroupRPApp.controls['Server'].value,
        // port: this.formGroupRPApp.controls['Port'].value,
        directory: this.formGroupRPApp.controls['Directory'].value,
        status: this.formGroupRPApp.controls['Status'].value,
        name: this.formGroupRPApp.controls['Name'].value,
        listWpThriftId: data_add,
        listLbRpAppThriftDelete: data_remove,
        script: this.formGroupRPApp.controls['notification'].value,
      };
      this.rpAppService
        .UpdateRpApp(data_response_object1)
        .subscribe((res: any) => {
          if (res.body.errorCode === '00') {
            this.getAllData();
            // console.log(res)
            this.toastrService.success(
              'Success',
              this.translate.instant('toast.note')
            );

            ref.close();
            this.isLoading = false;
          } else if (res.body.errorCode === '01') {
            this.toastrService.danger('Fail ', 'Duplicate name ');
            ref.close();
            this.isLoading = false;
          } else {
            console.log('res : ', res);
            this.toastrService.danger(
              'Fail',
              this.translate.instant('toast.note')
            );
            ref.close();
            this.isLoading = false;
          }
        });
    }
  }

  getRowDataTable(row: any) {
    this.currentListDataCallApi = [];
    console.log('row:', row);
    this.formGroupRPApp.enable();
    this.formGroupRPApp.patchValue({
      Name: row.name,
      Server: row.serverId,
      Port: row.port,
      Directory: row.directory,
      notification: row.script,
    });
    this.currentListDataThrift = row.listLbRpAppThrift;
    this.currentRPAppId = row.id;
    this.dynamicListThriftId = row.listWpThriftEntity.map((o) => o.id);
    this.currentListThriftId = this.dynamicListThriftId;
    this.formGroupRPApp.controls['Status'].setValue(row.status);
  }

  filterWithID(): void {
    this.doSearch(this.textSearch, this.defaultStatus);
  }

  PortRPApp: any;

  OpenAddConect(): void {
    this.formGroupRPApp.reset();
    this.dynamicListThriftId = [];
    this.currentListDataThrift = [];
    this.currentListThriftId = [];
    this.currentListDataCallApi = [];
    this.formGroupRPApp.setValue({
      Name: null,
      Server: null,
      Port: '',
      Directory: null,
      Thrift: '',
      Status: null,
      notification: null,
    });
  }

  lockOrUnlock(ref) {
    let status;
    if (this.dataCache.status === 0) {
      status = 1;
    }
    if (this.dataCache.status === 1) {
      status = 0;
    } else {
      status = 1;
    }
    console.log('data row :', this.dataCache);

    const data_call_api = {
      id: this.dataCache.id,
      serverId: this.dataCache.serverId,
      directory: this.dataCache.directory,
      status: status,
      name: this.dataCache.name,
      listWpThriftId: [],
      script: this.dataCache.script,
      listLbRpAppThriftDelete: [],
    };
    this.rpAppService.UpdateRpApp(data_call_api).subscribe(
      (res) => {
        console.log(res);
        if (res.body.errorCode === '00') {
          this.toastrService.success(
            'Success',
            this.translate.instant('toast.note')
          );
          this.getAllData();
          ref.close();
        }
      }, error => {
        if (error.error.errorKey === '01') {
          this.toastrService.danger('Fail ', 'Duplicate name ');
          ref.close();
          this.isLoading = false;
        } else if (error.error.errorKey === '11') {
          console.log('res : ', error);
          this.toastrService.danger(
            'Fail',
            this.translate.instant('toast.note')
          );
          ref.close();
          this.isLoading = false;
        }
      }
    );
  }

  searchWithSelect(): void {
    this.doSearch(this.textSearch, this.defaultStatus);
  }

  ServerRPApp = [];
  ListThriftRPApp = [];
  StatusRpApp = [
    {id: 1, value: 'Active'},
    {id: 0, value: 'Lock'},
  ];

  getPort() {
    this.IptableService.getPort().subscribe((res) => {


      this.isLoading = false;
      if (res.body.responseType === 'SUCCESS') {
        console.log(res);
        this.PortRPApp = res.body.results[0];
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    }, error => {
      this.isLoading = false;
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error.error.detail},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
    });
  }

  OpenPopup(form: any, text: string): void {
    this.isFilerBox = false;
    this.dialogService.open(form, {
      context: {title: text},
      closeOnBackdropClick: false,
    });
  }

  getDataThriftRow(data1: any) {
    const data = data1;
    let new_string = '';
    data.forEach((element: any) => {
      new_string += element.name + ' , ';
    });
    new_string = new_string.substring(0, new_string.length - 3);
    return new_string;
  }

  // filter
  openBoxFiler() {
    this.isFilerBox = !this.isFilerBox;
  }

  closePupupFilter() {
    this.isFilerBox = false;
    this.defaultStatus = '00';
    this.doSearch(this.textSearch, this.defaultStatus);
  }

  closePupup() {
    this.isFilerBox = false;
  }
}
