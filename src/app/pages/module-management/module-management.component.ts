import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import {RoleManagementService} from '../../services/role-management.service';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {FormBuilder, Validators} from '@angular/forms';
import {ModuleManagementService} from '../../services/module-management.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthoritiesConstant} from '../../authorities.constant';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';
import {take} from 'rxjs/operators';
import {Template} from '@angular/compiler/src/render3/r3_ast';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'ngx-module-management',
  templateUrl: './module-management.component.html',
  styleUrls: ['./module-management.component.scss'],
})
export class ModuleManagementComponent implements OnInit, AfterViewInit {
  columns = [
    {name: 'Stt', prop: 'stt', flexGrow: 0.5},
    {name: 'module.column.moduleName', prop: 'moduleName', flexGrow: 1.5},
    {name: 'module.column.description', prop: 'description', flexGrow: 1.5},
    {name: 'module.column.action', prop: 'action', flexGrow: 1, center: true},
  ];
  limit = 10;
  limits = [5, 10, 15, 20];
  listModule = [];
  listPermission = [];
  listConfig = [];
  isLoading: boolean = false;
  searchText = '';
  formGroup = this.fb.group({
    id: [null],
    moduleName: ['', Validators.required],
    description: [''],
    permissions: [[]],
  });
  @ViewChildren('listModuleTemplate')
  listModuleTemplate?: QueryList<ElementRef>;
  authority = AuthoritiesConstant;
  formGroupListConfig = this.fb.group({
    nifi_host: [''],
    nifi_post: [''],
    redis_connection: [''],
    sential_master: [''],
    redis_password: [''],
    knox_authentication: [''],
    nifi_htttps: [''],
  });
  isListConfig = false;
  isLoadingFirst = '';

  constructor(
    private moduleService: ModuleManagementService,
    public dialogService: NbDialogService,
    private shareData: ShareDataBreadcrumbService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastrService: NbToastrService
  ) {
  }

  ngOnInit(): void {

    this.sendDataTest();
    this.getAllListConfig();
    this.query();
    this.getListRole();
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Setting',
      titleChild: 'Module management',
      urlPage: '/page/module-management',
    });
  }

  query(): void {
    this.isLoading = true;
    const params = this.searchText ? {moduleName: this.searchText} : null;
    console.log(this.searchText);
    this.moduleService.query(params).subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        // this.isLoadingFirst.next(true);
        this.isLoading = false;
        this.listModule = res.body.results.map((module) => {
          module.permissionText = module.permissions
            .map((permission) => permission.code)
            .join(', ');
          module.permissionsIds = module.permissions.map(
            (permission) => permission.id
          );
          return module;
        });
        this.detailModule(this.listModule[0]);
        this.isLoadingFirst = this.listModule[0].moduleName;
      }
    });
  }

  getListRole(): void {
    this.moduleService.getListPermission().subscribe((res) => {
      this.listPermission = res.body.results;
    });
  }

  openAddorEditDialog(ref: any, data?: any, action?: string): void {
    this.formGroup.reset();
    data && this.formGroup.patchValue({
      id: data.moduleId,
      moduleName: data.moduleName,
      description: data.description,
      permissions: data.permissions.map(
        (p) => p.code.split('_').reverse()[0]
      ),
    });
    this.dialogService
      .open(ref, {
        context: {data, action: action},
        closeOnBackdropClick: false,
      })
      .onClose.subscribe((_) => {
      this.formGroup.reset();
    });
  }

  save(ref): void {
    console.log(this.formGroup);
    if (
      this.formGroup.value.permissions &&
      this.formGroup.value.permissions.length
    ) {
      const listPermission = [];
      this.listPermission.forEach((permission) => {
        this.formGroup.value.permissions.forEach((p) => {
          if (p === permission.code) {
            listPermission.push(permission);
          }
        });
      });
      this.formGroup.value.id
        ? this.moduleService
          .update({
            ...this.formGroup.value,
            permissions: listPermission,
          })
          .subscribe((res) => {
            if (res.body.responseType === 'SUCCESS') {
              this.toastrService.success(
                this.translate.instant('success.http.updateModuleSuccess'),
                this.translate.instant('success.http.notify')
              );
              this.query();
              ref.close();
            } else {
              this.toastrService.danger(
                this.translate.instant('success.http.updateModuleFail'),
                this.translate.instant('success.http.notify')
              );
              ref.close();
            }
          })
        : this.moduleService
          .create({...this.formGroup.value, permissions: listPermission})
          .subscribe((res) => {
            if (res.body.responseType === 'SUCCESS') {
              this.toastrService.success(
                this.translate.instant('success.http.addModuleSuccess'),
                this.translate.instant('success.http.notify')
              );
              this.query();
              ref.close();
            } else {
              this.toastrService.danger(
                this.translate.instant('success.http.addModuleFail'),
                this.translate.instant('success.http.notify')
              );
              ref.close();
            }
          });
    }
  }

  delete(id): void {
    this.moduleService.delete(id).subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        this.toastrService.success(
          this.translate.instant('success.http.deleteModuleSuccess'),
          this.translate.instant('success.http.notify')
        );
        this.query();
      } else {
        this.toastrService.danger(
          this.translate.instant('success.http.deleteModuleFail'),
          this.translate.instant('success.http.notify')
        );
      }
    });
  }

  // update with list config

  detailModule(data: any) {
    // console.log('event : ', event.target.outerHTML);
    this.isLoadingFirst = '';
    console.log(data);
    data &&
    this.formGroupDetail.patchValue({
      id: data.moduleId,
      moduleName: data.moduleName,
      description: data.description,
      permissions: data.permissions.map(
        (p) => p.code.split('_').reverse()[0]
      ),
    });
    if (data.moduleName.toString().toUpperCase() === 'INGESTION_MONITOR') {
      this.isListConfig = true;
    } else {
      this.isListConfig = false;
    }
  }

  openFormConfirm(popup?: any) {
    this.dialogService.open(popup, {
      context: {
        body: 'bạn có chắc chắn thêm mới hoặc cập nhật list config ? ',
        title: 'Xác nhận',
        type: 'cancel',
      },
    });
  }

  actionForm(ref: any) {
    console.log(this.formGroupListConfig.value);
    // NifiHost: ['', Validators.required],
    //   NifiPost: ['', Validators.required],
    //   Redis: ['', Validators.required],
    //   Master: ['', Validators.required],
    //   RedisPassword: ['', Validators.required],
    //   KnoxAuth: ['', Validators.required],
    //   NifiHttps: [null],
    // const data = {
    //   'nifiHost': this.formGroupListConfig.controls['NifiHost'].value,
    //   'nifiPort': this.formGroupListConfig.controls['NifiPost'].value,
    //   'redis_connection': this.formGroupListConfig.controls['Redis'].value,
    //   'sential_master': this.formGroupListConfig.controls['Master'].value,
    //   'redis_password': this.formGroupListConfig.controls['RedisPassword'].value,
    //   'knox_authentication': this.formGroupListConfig.controls['KnoxAuth'].value,
    //   'nifi_htttps': this.formGroupListConfig.controls['NifiHttps'].value
    // }
    // this.moduleService.createListConfig(data).subscribe(res => {
    //   if (res.body.responseType === 'SUCCESS') {
    //     this.toastrService.success('Sucess', 'Thêm mới thành công  ');
    //     // this.getAllRoleGroup()
    //     ref.close();
    //   } else {
    //     this.toastrService.danger('fail', 'thêm mới thất bại ');
    //     ref.close();
    //     // this.nameGroup = ''
    //   }
    // })
    const data_key = this.formGroupListConfig.value;
    // console.log('data key:', Object.values(data_key));
    // console.log(Object.keys(data_key));
    // console.log(Object.)
    const form_present = Object.entries(data_key);
    const length = form_present.length;
    // const object_api = [];
    // const object_form = [];
    // const new_Object_api = [];
    // for (const [key, value] of form_present) {
    //   console.log('key : ', key);
    //   console.log('value:', value);
    // }
    console.log('list config api : ', this.listConfig);
    console.log('list config form : ', form_present);
    this.compareObject(this.listConfig, form_present);
    ref.close();
  }

  getAllListConfig() {
    this.moduleService.getAllListConfig().subscribe(
      (res) => {
        // console.log("res",res);
        this.listConfig = res.body.results;
        console.log('res: ', this.listConfig);

        this.formGroupListConfig.setValue({
          nifi_host: this.listConfig.find((x) => x.key === 'nifi_host').value
            ? this.listConfig.find((x) => x.key === 'nifi_host').value
            : '',
          nifi_post: this.listConfig.find((x) => x.key === 'nifi_post').value
            ? this.listConfig.find((x) => x.key === 'nifi_post').value
            : '',
          redis_connection: this.listConfig.find(
            (x) => x.key === 'redis_connection'
          ).value
            ? this.listConfig.find((x) => x.key === 'redis_connection').value
            : '',
          sential_master: this.listConfig.find(
            (x) => x.key === 'sential_master'
          ).value
            ? this.listConfig.find((x) => x.key === 'sential_master').value
            : '',
          redis_password: this.listConfig.find(
            (x) => x.key === 'redis_password'
          ).value
            ? this.listConfig.find((x) => x.key === 'redis_password').value
            : '',
          knox_authentication: this.listConfig.find(
            (x) => x.key === 'knox_authentication'
          ).value
            ? this.listConfig.find((x) => x.key === 'knox_authentication').value
            : '',
          nifi_htttps: this.listConfig.find((x) => x.key === 'nifi_htttps')
            .value
            ? this.listConfig.find((x) => x.key === 'nifi_htttps').value
            : '',
        });
      },
      (error) => {
        console.log('error : ', error);
      }
    );
  }

  createListConfig(data?: any) {
    this.isLoading = true;
    this.moduleService.createListConfig(data).subscribe(
      (res) => {
        this.toastrService.success('Sucess', this.translate.instant('Thêm mới thành công '));
        console.log(res);
        this.isLoading = false;
      },
      (error) => {
        this.toastrService.danger('Fail', this.translate.instant('Thêm mới thất bại  '));
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  updateListConfig(data?: any) {
    this.isLoading = true;
    this.moduleService.updateListConfig(data).subscribe(
      (res) => {
        console.log(res);
        this.toastrService.success('Sucess', this.translate.instant('Cập nhật list config thành công '));
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.toastrService.danger('Fail', this.translate.instant('Cập nhật thất bại '));
        this.isLoading = false;
      }
    );
  }

  ngAfterViewInit() {
  }

  //
  // getFocusStyle(i?: number) {
  //   if (i === 0) {
  //     console.log('done');
  //     this.detailModule(this.listModule[0]);
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  LoadingFirst() {
    this.moduleService
      .query()
      .pipe(take(1))
      .subscribe((res) => {
        if (res.body.responseType === 'SUCCESS') {
          this.isLoading = false;
          this.listModule = res.body.results.map((module) => {
            module.permissionText = module.permissions
              .map((permission) => permission.code)
              .join(', ');
            module.permissionsIds = module.permissions.map(
              (permission) => permission.id
            );
            return module;
          });
          console.log(this.listModule[0]);

          // for (const item of this.listModuleTemplate) {
          //   console.log('item', item);
          // }
        }
      });
  }

  // create object update and add new
  createObjectUpdate(object_api, object_form) {
    const object_update = {};
    for (let i = 0; i < object_form.length; i++) {
      // console.log(object_form[i][1]);
      for (let j = 0; j < object_api.length; j++) {
        // console.log(object_api[j].value);
        if (
          object_form[i][0] === object_api[j].key &&
          object_form[i][1] !== object_api[j].value
        ) {
          // create object update api
          switch (object_api[j].key) {
            case 'nifi_host': {
              object_update['idNifiHost'] = object_api[j].id;
              object_update['nifiHost'] = object_form[i][1];
              break;
            }
            case 'nifi_post': {
              object_update['idNifiPort'] = object_api[j].id;
              object_update['NifiPort'] = object_form[i][1];
              break;
            }
            case 'redis_connection': {
              object_update['idRedisConnection'] = object_api[j].id;
              object_update['redisConnection'] = object_form[i][1];
              break;
            }
            case 'sential_master': {
              object_update['idSentialMaster'] = object_api[j].id;
              object_update['sentialMaster'] = object_form[i][1];
              break;
            }
            case 'redis_password': {
              object_update['idRedisPassword'] = object_api[j].id;
              object_update['redisPassword'] = object_form[i][1];
              break;
            }
            case 'knox_authentication': {
              object_update['idKnoxAuthentication'] = object_api[j].id;
              object_update['knoxAuthentication'] = object_form[i][1];
              break;
            }
            case 'nifi_htttps': {
              object_update['idNifiHttps'] = object_api[j].id;
              object_update['nifiHttps'] = object_form[i][1];
              break;
            }

            default: {
              // statements;
              break;
            }
          }
          // console.log(object_api[j].key);
        }
      }
    }
    // console.log(object_update);
    return object_update;
  }

  compareObject(object_default, object_form) {
    const array_left = [];
    const array_right = [];
    for (const item1 of object_default) {
      array_left.push(item1.key);
    }
    for (const [key, value] of object_form) {
      array_right.push(key);
    }

    console.log('left : ', array_left);
    console.log('right  :', array_right);
    if (array_right.length > array_left.length) {
      console.log('case true');
      const data_output = array_right.filter((x) => !array_left.includes(x));

      console.log(data_output);
      // loc ra phan tu duoc add
      const data_filter = [];
      data_output.forEach((element) => {
        for (const [key, value] of object_form) {
          if (element === key) {
            // data_filter.push([key, value]);
            console.log(key);

            switch (key) {
              case 'nifi_host': {
                data_filter['nifiHost'] = value;

                break;
              }
              case 'nifi_post': {
                data_filter['NifiPort'] = value;
                break;
              }
              case 'redis_connection': {
                data_filter['redisConnection'] = value;
                break;
              }
              case 'sential_master': {
                data_filter['sentialMaster'] = value;
                break;
              }
              case 'redis_password': {
                data_filter['redisPassword'] = value;
                break;
              }
              case 'knox_authentication': {
                data_filter['knoxAuthentication'] = value;
                break;
              }
              case 'nifi_htttps': {
                data_filter['nifiHttps'] = value;
                break;
              }

              default: {
                // statements;
                break;
              }
            }
          }
        }
      });
      console.log('data add : ', data_filter);

      // loc ra phan tu duoc update
      const data_duplicate = array_right.filter((x) => array_left.includes(x));

      const data_can_update = [];
      data_duplicate.forEach((element) => {
        for (const [key, value] of object_form) {
          if (element === key) {
            data_can_update.push([key, value]);
          }
        }
      });
      console.log('data duplicate :', data_can_update);
      // console.log(object_form);
      const object_update = this.createObjectUpdate(
        object_default,
        object_form
      );
      console.log('update : ', object_update);

      if (data_filter !== []) {
        this.createListConfig(data_filter);
        if (object_update !== []) {
          this.updateListConfig(object_update);
        }
      }
    } else {
      // case them moi
      console.log('case false;');

      const object_update = this.createObjectUpdate(
        object_default,
        object_form
      );
      console.log('update : ', object_update);
      if (object_update !== []) {
        this.updateListConfig(object_update);
      }
    }
  }

  // update with api moi
  formGroupDetail = this.fb.group({
    id: [null],
    moduleName: ['', Validators.required],
    description: [''],
    permissions: [[]],
  });

  UpdateListConfig2(ref: any) {
    console.log(this.formGroupListConfig.value);
    // console.log('value :', this.formGroupListConfig.value);
    const object_api = {
      nifiHost: this.formGroupListConfig.controls['nifi_host'].value,
      nifiPort: this.formGroupListConfig.controls['nifi_post'].value,
      redisConnection: this.formGroupListConfig.controls['redis_connection'].value,
      sentialMaster: this.formGroupListConfig.controls['sential_master'].value,
      redisPassword: this.formGroupListConfig.controls['redis_password'].value,
      knoxAuthentication: this.formGroupListConfig.controls['knox_authentication'].value,
      nifiHttps: this.formGroupListConfig.controls['nifi_htttps'].value
    }
    this.updateListConfig(object_api);
    ref.close();
  }

  UpdateDetail() {
    if (
      this.formGroupDetail.value.permissions &&
      this.formGroupDetail.value.permissions.length
    ) {
      const listPermission = [];
      this.listPermission.forEach((permission) => {
        this.formGroupDetail.value.permissions.forEach((p) => {
          if (p === permission.code) {
            listPermission.push(permission);
          }
        });
      });
      this.formGroupDetail.value.id
        ? this.moduleService
          .update({
            ...this.formGroupDetail.value,
            permissions: listPermission,
          })
          .subscribe((res) => {
            if (res.body.responseType === 'SUCCESS') {
              this.toastrService.success(
                this.translate.instant('success.http.updateModuleSuccess'),
                this.translate.instant('success.http.notify')
              );
              this.query();

            } else {
              this.toastrService.danger(
                this.translate.instant('success.http.updateModuleFail'),
                this.translate.instant('success.http.notify')
              );

            }
          })
        : this.moduleService
          .create({...this.formGroupDetail.value, permissions: listPermission})
          .subscribe((res) => {
            if (res.body.responseType === 'SUCCESS') {
              this.toastrService.success(
                this.translate.instant('success.http.addModuleSuccess'),
                this.translate.instant('success.http.notify')
              );
              this.query();

            } else {
              this.toastrService.danger(
                this.translate.instant('success.http.addModuleFail'),
                this.translate.instant('success.http.notify')
              );

            }
          });
    }
  }
}
