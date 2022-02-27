import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef, NbToastrService} from '@nebular/theme';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AccessManagementService} from '../../../@core/mock/access-management.service';

@Component({
  selector: 'ngx-add-or-edit-app',
  templateUrl: './add-or-edit-app.component.html',
  styleUrls: ['./add-or-edit-app.component.scss']
})
export class AddOrEditAppComponent implements OnInit {

  @Input() app: boolean = true;
  @Input() appData: any;
  @Input() isEddit: boolean;
  @Input() listApp;
  @Input() listCluster;

  appForm: FormGroup = this.fb.group({
    appName: [null, [Validators.required]],
    ip: [null, [Validators.required]],
    port: [null, [Validators.required]],
    cluster: [null, [Validators.required]],
    app: [[]],
  });
  listParentApp = [];
  listChildrenApp = [];
  loading: boolean;

  constructor(
    private fb: FormBuilder,
    public ref: NbDialogRef<AddOrEditAppComponent>,
    private accessManagementService: AccessManagementService,
    private toastrService: NbToastrService,
  ) {
  }

  ngOnInit(): void {
    if (this.listApp.length > 0) {
      this.listParentApp = this.listApp.filter(item => !item.rpAppId);
      // this.listChildrenApp = this.listApp.filter(item => item.rpAppId);
      const appIds = [];
      this.listApp.forEach(item => {
        if (item.rpAppId && appIds.indexOf(item.appId) === -1) {
          appIds.push(item.appId);
          this.listChildrenApp.push(item);
        }
      });
    }
    if (this.appData) {
      this.accessManagementService.getListAppParentOrChildren(this.appData).subscribe((res: any) => {
        if (res) {
          this.appForm.patchValue({
            appName: this.appData.appName,
            ip: this.appData.appIp,
            port: this.appData.port,
            cluster: this.appData.clusterId,
            app: res.body.results.length ? res.body.results.map(item => this.app ? item.appId : item.rpAppId) : null,
          });
        }
      });
    } else {
      this.appForm.patchValue({
        app: []
      });
    }
  }

  save() {
    this.loading = true;
    console.log('form group', this.appForm);
    if (this.isEddit) {
      const obj = {
        appId: this.appData.appId,
        appName: this.appForm.value.appName,
        appIp: this.appForm.value.ip,
        port: this.appForm.value.port,
        clusterId: this.appForm.value.cluster,
        rpAppId: this.appData.rpAppId,
        appChildrenOrParent: this.appForm.value.app,
      };
      this.accessManagementService.updateApp(obj).subscribe(res => {
        this.loading = false;
        if (res && res.body.message === 'NAME_APP_IS_ALREADY') {
          this.toastrService.danger('Tên APP đã tồn tại trong DB', 'Thông báo');
        } else {
          this.toastrService.success('Cập nhật APP thành công', 'Thông báo');
        }
        this.ref.close('close');
      }, error => {
        this.loading = false;
        this.toastrService.danger('Có lỗi xảy ra', 'Thông báo');
      });
    } else {
      const obj = {
        appName: this.appForm.value.appName,
        appIp: this.appForm.value.ip,
        port: this.appForm.value.port,
        clusterId: this.appForm.value.cluster,
        appChildrenOrParent: this.appForm.value.app,
      };
      this.accessManagementService.addApp(obj).subscribe(res => {
        this.loading = false;
        if (res && res.body.message === 'NAME_APP_IS_ALREADY') {
          this.toastrService.danger('Tên APP đã tồn tại trong DB', 'Thông báo');
        } else {
          this.toastrService.success('Thêm mới APP thành công', 'Thông báo');
        }
        this.ref.close('close');
      }, error => {
        this.loading = false;
        this.toastrService.danger('Có lỗi xảy ra', 'Thông báo');
      });
    }
  }
}
