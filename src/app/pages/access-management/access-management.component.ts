import {Component, OnInit, ViewChild} from '@angular/core';
import {Page} from '../../@core/model/page.model';
import {AccessManagementService} from '../../@core/mock/access-management.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {AddOrEditAppComponent} from './add-or-edit-app/add-or-edit-app.component';
import {SendRequireComponent} from './send-require/send-require.component';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {NgSelectComponent} from '@ng-select/ng-select';
import {AuthoritiesConstant} from '../../authorities.constant';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';
import {PopupErrorComponent} from '../popup-error/popup-error.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ngx-access-management',
  templateUrl: './access-management.component.html',
  styleUrls: ['./access-management.component.scss']
})
export class AccessManagementComponent implements OnInit {

  @ViewChild('treemenu')
  public treeContextMenu: any;
  @ViewChild(SendRequireComponent) sendRequireComponent: any;
  @ViewChild(DatatableComponent) public table: DatatableComponent;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;

  // columns = [
  //   {name: 'Mail', prop: 'userName', flexGrow: 0.8},
  //   {name: 'Ứng dụng', prop: 'rpAppName', flexGrow: 1.2},
  //   {name: 'Team', prop: 'team', flexGrow: 0.6},
  //   {name: 'Bắt đầu', prop: 'startTime', flexGrow: 1},
  //   {name: 'Kết thúc', prop: 'endTime', flexGrow: 1},
  //   {name: 'Trạng thái', prop: 'status', flexGrow: 1}
  // ];
  columnsTable = [
    {name: 'Index', prop: 'stt', flexGrow: 0.5},
    {name: 'Người dùng', prop: 'userName', flexGrow: 0.9},
    {name: 'IP', prop: 'ipAddress', flexGrow: 0.9},
    {name: 'RP_App', prop: 'rpAppName', flexGrow: 0.9},
    {name: 'Thrifts', prop: 'thriftName', flexGrow: 0.9},
    {name: 'File', prop: 'fileName', flexGrow: 0.9},
    {name: 'Trạng Thái', prop: 'status', flexGrow: 0.6},
    {name: 'Action', prop: 'action', flexGrow: 0.8}
  ];
  rowData = [];
  currentTheme: any = 'dark';
  currentAppId;
  isFilerBox: boolean = false;
  public currentVisible: number = 0;
  checkDate: boolean = false;
  isLoading: boolean = false;
  dataApp: any;
  dataDetail: any = {};
  dataTable = [];
  typeSearch;
  setStatus;
  formDataUpdate;
  base64File;
  dateCreate: any;
  dateEnd: any;
  defaultFilterTable;
  filterTable;
  fileNameOld;
  limits = [5, 10, 15, 20];
  limit = 10;
  listFilterForm: FormArray = this.fb.array([]);
  listChangeFilter = [];
  arrayFilter = [];
  listFilterSelected = [];
  formGroup: FormGroup = this.fb.group({
    accessStatus: [null],
    accessSearch: [null],
    accessCluster: [null],
  });
  formGroupLB: FormGroup = this.fb.group({
    userId: [null, [Validators.required]],
    startDate: [''],
    endDate: [''],
    rpAppId: [null, [Validators.required]],
    userIpId: [null],
    rpAppThriftId: [null],
    type: [''],
    reason: [''],
    fileName: [''],
    status: [null]
  });
  listLbRpApp = [];
  listUsers = [];
  listIp = [];
  listThriftId = [];
  public items: any[] = [{text: 'Thay đổi thông tin', icon: 'edit'}];
  listApp;
  loading: boolean;
  objectSearch;
  page = new Page();
  selected = [];
  listTypeSearch = [{name: 'All', value: '00'}, {name: 'Người dùng', value: '01'}, {
    name: 'Server',
    value: '02'
  }, {name: 'Trạng thái', value: '03'}, {
    name: 'IP',
    value: '04'
  }];
  listStatus = [{name: 'Active', value: 1}, {name: 'Lock', value: 0}]
  textSearch = '';
  authority = AuthoritiesConstant;
  private contextItem: any;
  optionDefault;
  optionChange = {
    tableAction: '',
    relationStatus: '',
    keySearch: '',
    jobStatus: '',
    size: 10,
    page: 0
  }

  constructor(
    private accessManagementService: AccessManagementService,
    private fb: FormBuilder,
    public dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private shareData: ShareDataBreadcrumbService,
    public translate: TranslateService,
  ) {
    this.singleSelectCheck = this.singleSelectCheck.bind(this);
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    this.sendDataBreadCrumb();
    this.loading = true;
    this.doSearchLbConnect('', '');
    this.getAllLbRpApp();
    this.getAllUser();
    this.typeSearch = '00';
    this.search(null, 2, null, 0);
    this.loadCluster();

    this.formGroup.get('accessStatus').valueChanges.subscribe(value => {
      if ((value && value >= 0) || value === 0) {
        this.loading = true;
        this.search(null, value, null, 0);
      }
    });

    this.formGroup.get('accessCluster').valueChanges.subscribe(value => {
      if (value) {
        // console.log('change cluster', value);
        this.loadApp();
      }
    });
    this.addRowFilter();
  }

  sendDataBreadCrumb() {
    this.shareData.updateData({
      title: 'Access manager',
      groupText: 'LB manager',
      titleChild: 'LB connection',
      urlPage: '/page/access-management',
    })
  }

  filterSearchTable() {
    this.doSearchLbConnect(this.textSearch, this.typeSearch)
  }

  doSearchLbConnect(keySearch, typeSearch) {
    this.isLoading = true;
    this.accessManagementService.doSearchLbConnect(keySearch, typeSearch).subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        this.rowData = res.body.results[0];
        this.isLoading = false;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
        this.isLoading = false;
      }
    }, (error) => {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: error},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
      this.isLoading = false;
    })
  }

  getAllLbRpApp() {
    this.accessManagementService.getAllLbRpApp().subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        this.listLbRpApp = res.body.results;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    })
  }

  getAllUser() {
    this.accessManagementService.getAllUser().subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        this.listUsers = res.body.results;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    })
  }

  wpUserIp(id: any) {
    this.accessManagementService.wpUserIp(id).subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        this.listIp = res.body.results;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    })
  }

  getRpAppThriftId(id: any) {
    this.accessManagementService.getRpAppThriftId({appId: id}).subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        this.listThriftId = res.body.results;
      } else {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: res.body.message},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    })
  }

  changeUser(event) {
    this.wpUserIp(event)
    // this.formGroupLB.get('user').valueChanges.subscribe(value => {
    //   console.log(value)
    // });
  }

  singleSelectCheck(row: any) {
    this.dataDetail = row;
    return this.selected.indexOf(row) === -1;
  }

  loadCluster() {
    this.accessManagementService.getListCluster().subscribe(res => {
      if (res) {
        this.filterTable = res.results;
        if (this.filterTable && this.filterTable.length > 0) {
          this.defaultFilterTable = this.filterTable[0].id;
        }
      }
    });
  }

  loadApp() {
    const obj = {ClusterId: this.defaultFilterTable};
    this.accessManagementService.gitListApp(obj).subscribe(res => {
      this.dataApp = this.generateTreeApp(res.body.results, null);
      this.listApp = res.body.results;
      this.sendRequireComponent.setListAppParent(this.listApp);
    });
  }

  generateTreeApp(data, parent) {
    const nestedTreeStruct = [];
    const length = data.length;
    for (let i = 0; i < length; i++) {
      const model = data[i];
      if (parent) {
        if (+model['rpAppId'] === +parent) {
          const children = this.generateTreeApp(data, model['appId']);
          if (children.length > 0) {
            model.children = children;
          }
          nestedTreeStruct.push(model);
        }
      } else {
        if (!model['rpAppId']) {
          const children = this.generateTreeApp(data, model['appId']);
          if (children.length > 0) {
            model.children = children;
          }
          nestedTreeStruct.push(model);
        }
      }
    }
    return nestedTreeStruct;
  }

  search(id, status, textSearch, offset) {
    this.objectSearch = {
      id: id,
      status: status,
      textSearch: textSearch,
    };
    const obj = {
      appId: id ? id : '',
      status: status || status === 0 ? status : '',
      textSearch: textSearch ? textSearch : '',
    };
    this.accessManagementService.getListAuthConnection(obj).subscribe(res => {
      // this.dataTable = res.body.results;
      // filter duplicate data
      // this.dataTable = res.body.results.filter((value, index, array) => {
      //   return index === array.findIndex(t => t.userId === value.userId && t.rpAppId === value.rpAppId && t.team === value.team && t.startTime === value.startTime);
      // })
      this.currentVisible = Math.ceil(this.dataTable.length / 10);
      if (this.dataTable && this.dataTable.length > 0) {
        this.table.offset = offset;
        this.selected.push(this.dataTable[0]);
        this.dataDetail = this.dataTable[0];
      }
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  onFileChange(event: Event) {
    let file
    file = event.target['files'][0];
    this.base64File = file;
    this.formGroupLB.get('fileName').patchValue(file.name);
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = (_event) => {
    //   this.base64File = reader.result.toString();
    // };
  }

  clearFileName() {
    this.formGroupLB.get('fileName').patchValue('');
  }

  // changeDetails(event) {
  //   this.currentAppId = event.dataItem.rpAppId ? event.dataItem.rpAppId : event.dataItem.appId;
  //   console.log('event', this.currentAppId);
  //   this.loading = true;
  //   this.search(this.currentAppId, null, null, 0);
  // }

  // openDialog() {
  //   this.dialogService.open(AddOrEditAppComponent,
  //     {
  //       context: {
  //         listApp: this.listApp,
  //         listCluster: this.filterTable,
  //       },
  //       closeOnBackdropClick: false
  //     }).onClose.subscribe(value => {
  //     if (value) {
  //       this.loadApp();
  //     }
  //   });
  // }

  // public onNodeClick(e: any): void {
  //   if (e.type === 'contextmenu') {
  //     const originalEvent = e.originalEvent;
  //
  //     originalEvent.preventDefault();
  //
  //     this.contextItem = e.item.dataItem;
  //
  //     this.treeContextMenu.show({left: originalEvent.pageX, top: originalEvent.pageY});
  //   }
  // }

  updateDialog(template, row, status) {
    const value = {
      acId: row.acId,
      status: status
    }
    this.dialogService.open(template, {context: {...row, status: status}});
  }

  updateAuthConnection(data, ref) {
    this.loading = true;
    this.accessManagementService.updateAuthConnection(data).subscribe(res => {
      this.loading = false;
      this.toastrService.success('Cập nhật bản ghi thành công', 'Thông báo');
      ref.close();
      this.search(this.objectSearch.id, this.objectSearch.status, this.objectSearch.textSearch, this.table.offset);
    }, error => {
      this.loading = false;
      this.toastrService.danger('Cập nhật thất bại', 'Thông báo');
      ref.close();
    });
  }

  onSelect(event) {
    console.log('right click', event, this.contextItem);
    this.dialogService.open(AddOrEditAppComponent,
      {
        context: {
          appData: this.contextItem,
          isEddit: true,
          listApp: this.listApp,
          listCluster: this.filterTable,
          app: this.contextItem.rpAppId ? false : true,
        }
      }).onClose.subscribe(res => {
      if (res) {
        this.loadApp();
      }
    });
  }

  reloadAuthen() {
    this.search(null, 2, null, 0);
  }

  getTotalPage(rowCount, pageSize) {
    return Math.ceil(rowCount / pageSize);
  }

  formatDateCheck(date) {
    if (date) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;

      return [year, month, day].join('-');
    } else {
      return ''
    }
  }

  addOrEditConnection(title: string, ref, id: any) {
    this.isLoading = true;
    // const today = new Date();
    // if (this.formGroupLB.value.startDate > this.formGroupLB.value.endDate || this.formatDateCheck(this.formGroupLB.value.startDate) < this.formatDateCheck(today)) {
    //   this.checkDate = true;
    // } else {
    //   this.checkDate = false;
    // }

    if (title === 'add') {
      const formData = new FormData();
      formData.append('userId', this.formGroupLB.value.userId);
      formData.append('userIpId', this.formGroupLB.value.userIpId);
      formData.append('rpAppId', this.formGroupLB.value.rpAppId);
      formData.append('rpAppThriftId', this.formGroupLB.value.rpAppThriftId);
      formData.append('reason', this.formGroupLB.value.reason);
      formData.append('multipartFile', this.base64File);
      formData.append('status', '1');
      formData.append('endTime', this.dateFormat(this.formGroupLB.value.endDate));
      this.accessManagementService.createLbConnection(formData).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.toastrService.success('Open connection Success', this.translate.instant('toast.note'));
          this.doSearchLbConnect(this.textSearch, this.typeSearch);
          ref.close();
        } else {
          this.toastrService.danger('Fail', this.translate.instant('toast.note'));
          ref.close();
        }
      }, (err) => {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: err},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
        this.isLoading = false;
      })
    } else {
      this.formDataUpdate = new FormData();
      this.formDataUpdate.append('userId', this.formGroupLB.value.userId);
      this.formDataUpdate.append('userIpId', this.formGroupLB.value.userIpId);
      this.formDataUpdate.append('rpAppId', this.formGroupLB.value.rpAppId);
      this.formDataUpdate.append('rpAppThriftId', this.formGroupLB.value.rpAppThriftId);
      this.formDataUpdate.append('reason', this.formGroupLB.value.reason);
      this.formDataUpdate.append('endTime', this.dateFormat(this.formGroupLB.value.endDate));
      this.formDataUpdate.append('fileName', this.formGroupLB.value.fileName);
      this.formDataUpdate.append('status', this.formGroupLB.value.status);
      if (this.fileNameOld !== this.formGroupLB.value.fileName) {
        this.formDataUpdate.append('multipartFile', this.base64File);
      }
      this.accessManagementService.updateLbConnection(this.formDataUpdate, id).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.toastrService.success('Update Success', this.translate.instant('toast.note'));
          this.doSearchLbConnect(this.textSearch, this.typeSearch);
          ref.close();
        } else {
          this.toastrService.danger('Fail', this.translate.instant('toast.note'));
          ref.close();
        }
      }, (err) => {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: err},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
        this.isLoading = false;
      })
    }
  }

  setValueForm() {
    this.checkDate = false;
    this.isFilerBox = false;
    this.formGroupLB.reset();
    this.formGroupLB.get('userId').patchValue(null);
    this.formGroupLB.get('rpAppId').patchValue(null);
    this.formGroupLB.get('userIpId').patchValue(null);
    this.formGroupLB.get('rpAppThriftId').patchValue(null);
    this.formGroupLB.get('reason').patchValue('');
    this.formGroupLB.get('fileName').patchValue('')
    this.listIp = [];
    this.listThriftId = [];
  }

  editItems(row: any) {
    this.formGroupLB.get('startDate').patchValue(this.dateFormat(row?.beginAt));
    this.formGroupLB.get('userId').patchValue(row?.userId);
    this.formGroupLB.get('rpAppId').patchValue(row?.rpAppId);
    this.formGroupLB.get('userIpId').patchValue(row?.userIpId);
    this.formGroupLB.get('rpAppThriftId').patchValue(row?.rpAppThriftId);
    this.formGroupLB.get('reason').patchValue(row?.reason);
    this.formGroupLB.get('status').patchValue(row?.status);
    this.formGroupLB.get('fileName').patchValue(row?.fileName);
    this.formGroupLB.get('endDate').patchValue(this.dateFormat(row?.endAt));
    this.base64File = row?.multipartFile;
    this.fileNameOld = row?.fileName;
    this.changeRPApp(row?.rpAppId);
    this.changeUser(row?.userId);
  }

  dateFormat(date) {
    const dateInput = new Date(date);
    const dateStringOutPut = dateInput.getFullYear() + '-' +
      ('0' + (dateInput.getMonth() + 1)).slice(-2) + '-' +
      ('0' + dateInput.getDate()).slice(-2) + ' ' +
      ('0' + dateInput.getHours()).slice(-2) + ':' +
      ('0' + dateInput.getMinutes()).slice(-2) + ':' +
      ('0' + dateInput.getSeconds()).slice(-2)
    return dateStringOutPut
  }

  lockOrUnlock(ref, item, title) {
    if (title === 'lock') {
      this.setStatus = 0;
    } else {
      this.setStatus = 1;
    }
    this.accessManagementService.updateStatusLbConnection({status: this.setStatus, id: item?.id}).subscribe((res) => {
      console.log(res);
      if (res.responseType === 'SUCCESS') {
        this.toastrService.success('Success', this.translate.instant('toast.note'));
        this.doSearchLbConnect(this.textSearch, this.typeSearch);
        ref.close();
      } else {
        this.toastrService.danger('Fail', this.translate.instant('toast.note'));
        ref.close();
      }
    })
  }

  changeRPApp(event: any) {
    this.getRpAppThriftId(event);
  }

  // filter
  openBoxFiler() {
    this.isFilerBox = !this.isFilerBox;
  }

  addRowFilter() {
    if (this.listFilterForm.value.length <= 3) {
      this.listFilterForm.push(this.fb.group({
        typeFilter: [null, Validators.required],
        keyFilter: ['', Validators.required],
      }));
    }
    this.listChangeFilter = [];
  }

  addRowFilterSelected(i) {
    if (this.listFilterSelected.length <= 3) {
      this.listFilterForm.at(0).patchValue({
        typeFilter: null,
        keyFilter: null
      });
    }
    this.listChangeFilter = [];
  }

  filterChange(row, index: number) {
    if (row.value.selectedFilter === null) {
      this.listChangeFilter[index] = [];
      this.listFilterForm.at(index).patchValue({
        typeFilter: null,
      });
      this.listChangeFilter = [];
    } else {
    }
  }

  closePupupFilter() {
    this.isFilerBox = false;
    this.typeSearch = '00';
    this.doSearchLbConnect(this.textSearch, this.typeSearch);
  }

  filterWithValue() {
    this.arrayFilter.map(value => {
      this.optionChange[`${value.typeFilter}`] = value.keyFilter
    });
    console.log(this.optionChange)
  }

  deleteFilterSelected(index: number) {
    this.listFilterSelected = [...this.listFilterSelected].filter((e, indexs) => indexs !== index);
    this.arrayFilter = [...this.arrayFilter].filter((e, indexs) => indexs !== index);
    if (this.listFilterSelected.length === 0) {
    }
  }
  closePupup() {
    this.isFilerBox = false;
  }
}
