import {Component, OnInit} from '@angular/core';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {SupportRequestService} from '../../services/support-request.service';
import {PopupErrorComponent} from '../popup-error/popup-error.component';
import {NbDialogService} from '@nebular/theme';

@Component({
  selector: 'ngx-support-request',
  templateUrl: './support-request.component.html',
  styleUrls: ['./support-request.component.scss']
})
export class SupportRequestComponent implements OnInit {
  isLoading: boolean = false;
  isFilerBox: boolean = false;
  searchValue: string = '';
  limits = [5, 10, 15, 20];
  limit = 10;
  lists = [];
  arrayFilter = [];
  optionDefault;
  listFilterBy: any[] = [{name: 'Trạng thái', key: 'keyStatus'}, {name: 'Người xử lý', key: 'keyUserHandler'}, {
    name: 'Người gửi',
    key: 'keyUserSend'
  }, {
    name: 'Loại SR',
    key: 'typeSr'
  }];
  listTypeSr = [{name: 'LB connection', key: 'lb_connection'}, {
    name: 'Thrift connection',
    key: 'thrift_connection'
  }, {name: 'Iptables ', key: 'iptables'}];
  listStatusSr = [{name: 'Waiting', key: 'waiting'}, {
    name: 'Completed',
    key: 'completed'
  }, {name: 'Rejected', key: 'rejected'}, {name: 'Invalid', key: 'invalid'}, {name: 'Approved', key: 'approved'}];

  columnsTable = [
    {name: 'Index', prop: 'stt', flexGrow: 0.5},
    {name: 'Mã SR', prop: 'id', flexGrow: 0.9},
    {name: 'Loại SR', prop: 'type', flexGrow: 0.9},
    {name: 'Tiêu đề', prop: 'title', flexGrow: 0.9},
    {name: 'Người gửi', prop: 'userSendRequest', flexGrow: 0.9},
    {name: 'Người xử lý', prop: 'userHandler', flexGrow: 0.9},
    {name: 'File', prop: 'fileUrl', flexGrow: 0.9},
    {name: 'Trạng thái', prop: 'status', flexGrow: 0.6},
    {name: 'Action', prop: 'action', flexGrow: 0.8}
  ];
  rowData = [];
  listFilterSelected = [];
  listUserForm: FormArray = this.fb.array([]);
  listUser = [
    {id: 1, name: 'hiepTran'},
    {id: 2, name: 'hoangNam'},
    {id: 3, name: 'minhQuan'}
  ];
  optionChange = {
    keyStatus: '',
    keyUserHandler: '',
    keyUserSend: '',
    typeSr: '',
    keySearch: this.searchValue
  }

  constructor(private shareData: ShareDataBreadcrumbService, public supportRequestService: SupportRequestService, public translate: TranslateService, private router: Router, public fb: FormBuilder, public dialogService: NbDialogService) {
  }

  ngOnInit(): void {
    this.optionDefault = {
      keyStatus: '',
      keyUserHandler: '',
      keyUserSend: '',
      typeSr: '',
      keySearch: ''
    }
    this.sendDataBreadcrumb();
    this.getAllSupportRequestInfo(this.optionDefault);
    this.addRowUser();
  }

  sendDataBreadcrumb() {
    this.shareData.updateData({
      title: 'Utility',
      titleChild: 'Support request',
      urlPage: '/page/support-request',
    })
  }

  getAllSupportRequestInfo(options: any) {
    this.isLoading = true;
    this.supportRequestService.getAllSupportRequestInfo(options).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.rowData = res.body.results;
        this.isLoading = false;
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

  navigateToOpenRequest(type: string) {
    this.router.navigate(['/page/support-request/open-request']);
    localStorage.setItem('typeRequest', type)
  }

  navigateToRequestDetails(row: any) {
    this.router.navigate([`/page/support-request/request-details/${row.id}`])
  }

  openBoxFiler() {
    this.isFilerBox = !this.isFilerBox
  }

  clearFilter() {
    this.listUserForm = this.fb.array([]);
    this.listUserForm.push(this.fb.group({
      selectedFilter: [null, Validators.required],
      selectedType: ['', Validators.required],
    }));
    this.listFilterSelected = [];
    this.arrayFilter = [];
    this.optionChange = {
      keyStatus: '',
      keyUserHandler: '',
      keyUserSend: '',
      typeSr: '',
      keySearch: this.searchValue
    }
    this.getAllSupportRequestInfo(this.optionChange);
    this.isFilerBox = false;
  }

  addRowUser() {
    if (this.listUserForm.value.length <= 3) {
      this.listUserForm.push(this.fb.group({
        selectedFilter: [null, Validators.required],
        selectedType: ['', Validators.required],
      }));
      this.lists.push([]);
    }
  }

  addRowFilterSelected() {
    if (this.listFilterSelected.length <= 3) {
      console.log(this.listUserForm.value[0])
      this.arrayFilter.push(this.listUserForm.value[0]);
      const options = {
        selectedFilter: this.listFilterBy.filter(v => v.key === this.listUserForm.value[0].selectedFilter)[0]?.name,
        selectedType: this.lists[0].filter(v => v.key === this.listUserForm.value[0].selectedType)[0]?.name
      }
      const checkSameItem = this.listFilterSelected.some((item, index) => {
        return options?.selectedFilter === item?.selectedFilter;
      });
      if (checkSameItem !== true) {
        this.listFilterSelected.push(options);
      }
      this.listUserForm.at(0).patchValue({
        selectedFilter: null,
        selectedType: null
      });
    }
  }

  deleteRowUser(row: any) {
    const index = this.listUserForm.value.findIndex(e => e.selectedFilter === row.value.selectedFilter);
    this.listUserForm.removeAt(index);
    this.lists.splice(index, 1);
  }

  onSetValueGroup(row: any, index: number) {
    console.log(row.value.selectedFilter);
    if (row.value.selectedFilter === null) {
      this.lists[index] = [];
      this.listUserForm.at(index).patchValue({
        selectedType: null,
      });
    } else {
      if (row.value.selectedFilter === 'typeSr') {
        this.lists[index] = this.listTypeSr;
        this.listUserForm.at(index).patchValue({
          selectedType: null,
        });
      } else if (row.value.selectedFilter === 'keyStatus') {
        this.lists[index] = this.listStatusSr;
        this.listUserForm.at(index).patchValue({
          selectedType: null,
        });
      } else if (row.value.selectedFilter === 'keyUserHandler') {
        const resoleArray = [];
        this.supportRequestService.getAllUser().subscribe(res => {
          res.body.results.map((value) => {
            resoleArray.push({name: value.login, key: value.login});
            this.lists[index] = resoleArray
          });
        });
        this.listUserForm.at(index).patchValue({
          selectedType: null,
        });
      } else {
        const resoleArrays = [];
        this.supportRequestService.getAllUser().subscribe(res => {
          res.body.results.map((value) => {
            resoleArrays.push({name: value.login, key: value.login});
            this.lists[index] = resoleArrays;
          });
        });
        this.listUserForm.at(index).patchValue({
          selectedType: null,
        });
      }
    }
  }

  deleteFilterSelected(index: number) {
    this.listFilterSelected = [...this.listFilterSelected].filter((e, indexs) => indexs !== index);
    this.arrayFilter = [...this.arrayFilter].filter((e, indexs) => indexs !== index);
    if (this.listFilterSelected.length === 0) {
      this.getAllSupportRequestInfo(this.optionDefault);
    }
  }

  filterInfoSR() {
    this.arrayFilter.map(value => {
      this.optionChange[`${value.selectedFilter}`] = value.selectedType
    });
    console.log({...this.optionChange, keySearch: this.searchValue});
    this.getAllSupportRequestInfo(this.optionChange);
    // this.isFilerBox = false;
  }
  closePupup() {
    this.isFilerBox = false;
  }
}
