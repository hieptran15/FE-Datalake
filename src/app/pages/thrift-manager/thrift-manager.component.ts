import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {ThriftManagerService} from '../../@core/mock/thrift-manager.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthoritiesConstant} from '../../authorities.constant';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-thrift-manager',
  templateUrl: './thrift-manager.component.html',
  styleUrls: ['./thrift-manager.component.scss']
})
export class ThriftManagerComponent implements OnInit {
  @ViewChild('createThrift') createThrift: TemplateRef<any>;

  keySearch = '';
  limits = [5, 10, 15, 20];
  limit = 10;
  dataTable = [];
  row = [];
  formThrift = this.fr.group({
    id: [null],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    host: [null, [Validators.required, Validators.pattern(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)]],
    port: [null, [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.max(65535)]],
    description: [null],
    activated: [null],
    createdAt: [null],
    updateAt: [null],
    updateBy: [null]
  });
  authority = AuthoritiesConstant;
  columns = [
    {name: 'Id', prop: 'id', flex: 0.4},
    {name: 'Thrift.column.name', prop: 'name', flex: 1},
    {name: 'Thrift.column.host', prop: 'host', flex: 0.8},
    {name: 'Thrift.column.port', prop: 'port', flex: 0.5},
    {name: 'Thrift.column.description', prop: 'description', flex: 1},
    {name: 'Thrift.column.status', prop: 'activated', flex: 0.5},
    {name: 'Thrift.column.action', prop: 'action', flex: 0.8}
  ];

  constructor(
    private fr: FormBuilder,
    private shareData: ShareDataBreadcrumbService,
    public diaglogService: NbDialogService,
    private toastrService: NbToastrService,
    private thriftManagerService: ThriftManagerService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.getListThrift();
    this.sendDataTest();
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Access manager',
      groupText: 'Thrift authorization',
      titleChild: 'Thrift manager',
      urlPage: '/page/thrift-manager',
    })
  }

  getListThrift() {
    this.thriftManagerService.getListThrift().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.row = res.body.results;
        this.dataTable = [...this.row];
      } else {
        this.toastrService.danger(this.translate.instant('error.http.errors'), this.translate.instant('success.http.notify'));
      }
    })
  }

  saveCreateThrift(ref: any) {
    this.thriftManagerService.saveThrift(this.formThrift.value, this.formThrift.value.id).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.getListThrift();
        ref.close();
        this.toastrService.success(this.translate.instant('label.createSuccess'), this.translate.instant('success.http.notify'));
      } else if (res.body.message === '01') {
        this.toastrService.danger(this.translate.instant('error.http.duplicateName'), this.translate.instant('success.http.notify'));
      } else if (res.body.message === '03') {
        this.toastrService.danger(this.translate.instant('Thrift.label.checkHost'), this.translate.instant('success.http.notify'));
      } else {
        this.toastrService.danger(this.translate.instant('label.createFail'), this.translate.instant('success.http.notify'));
      }
    })
  }

  saveUpdateThrift(ref: any) {
    this.thriftManagerService.saveThrift(this.formThrift.value, this.formThrift.value.id).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.getListThrift();
        this.toastrService.success(this.translate.instant('label.updateSuccess'), this.translate.instant('success.http.notify'));
        ref.close();
      } else if (res.body.message === '01') {
        this.toastrService.danger(this.translate.instant('error.http.duplicateName'), this.translate.instant('success.http.notify'));
      } else {
        this.toastrService.danger(this.translate.instant('label.updateFail'), this.translate.instant('success.http.notify'));
      }
    })
  }

  deleteThrift(id: number) {
    this.thriftManagerService.deleteWpThrift(id).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.getListThrift();
        this.toastrService.success(this.translate.instant('label.deleteSuccess'), this.translate.instant('success.http.notify'));
      } else {
        this.toastrService.danger(this.translate.instant('label.deleteFail'), this.translate.instant('success.http.notify'));
      }
    })
  }

  createNewThrift() {
    this.resetForm();
    this.diaglogService.open(this.createThrift, {
      context: {title: 'create'}, closeOnBackdropClick: false
    })
  }

  filter(event: any) {
    if (event.target.value !== '') {
      this.dataTable = this.row.filter(v => v.name.toLowerCase().indexOf(event.target.value.trim().toLowerCase()) !== -1 ||
        v.host.toLowerCase().indexOf(event.target.value.trim().toLowerCase()) !== -1 ||
        v.port.toLowerCase().indexOf(event.target.value.trim().toLowerCase()) !== -1)
    } else {
      this.dataTable = [...this.row]
    }
  }

  editThrift(index: number) {

    this.formThrift.get('id').patchValue(this.dataTable[index].id);
    this.formThrift.get('name').patchValue(this.dataTable[index].name);
    this.formThrift.get('host').patchValue(this.dataTable[index].host);
    this.formThrift.get('port').patchValue(this.dataTable[index].port);
    this.formThrift.get('description').patchValue(this.dataTable[index].description);
    this.formThrift.get('activated').patchValue(this.dataTable[index].activated);
    this.formThrift.get('createdAt').patchValue(this.dataTable[index].createdAt);
    this.formThrift.get('updateAt').patchValue(this.dataTable[index].updateAt);
    this.formThrift.get('updateBy').patchValue(this.dataTable[index].updateBy);
    this.diaglogService.open(this.createThrift, {
      context: {title: 'edit'}, closeOnBackdropClick: false
    })
  }

  resetForm() {
    this.formThrift.reset();
    this.formThrift.get('activated').patchValue(1);
  }
}
