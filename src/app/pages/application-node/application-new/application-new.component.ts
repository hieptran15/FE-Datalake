import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {NbDialogRef, NbDialogService, NbToastrService} from '@nebular/theme';
import {InputType, MAX_SAFE_INTEGER} from '../../../share/common.constant';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {concat, Observable, of, Subject} from 'rxjs';
import {IApplicationCluster} from '../../../model/application-cluster.model';
import {CatItemService} from '../../../services/cat-item.service';
import {catchError, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {ApplicationClusterService} from '../../../services/application-cluster.service';
import {NodeTypeInputService} from '../../../services/node-type-input.service';
import {ApplicationNodeService} from '../../../services/application-node.service';
import {environment} from '../../../../environments/environment';
import {CustomValidators} from '../../../share/directive/custom-validator.directive';
import {Page} from '../../../@core/model/page.model';
import {ApplicationNodeServerComponent} from '../node-server-new/node-server-new.component';
import {ConfirmDialogComponent} from '../../../share/component/confirm-dialog/confirm-dialog.component';
import {NodeUrlComponent} from '../node-url/node-url.component';

@Component({
  selector: 'ngx-application-new',
  templateUrl: './application-new.component.html',
  styleUrls: ['./application-new.component.scss'],
})
export class ApplicationNewComponent implements OnInit, AfterViewChecked {
  title: any;
  objects: any;
  InputType = InputType;
  icon: any;
  columns = [
    {name: 'Tên', prop: 'name', flewGrow: 0.5},
    {name: 'Host', prop: 'host', flewGrow: 1.3},
    {name: 'Đường dẫn', prop: 'path', flewGrow: 3},
    {name: 'Thẻ', prop: 'tags', flewGrow: 1.3},
    {name: 'Hành động', prop: 'action_btn', flewGrow: 2.3}
  ];
  columnUrl = [
    {name: 'Url', prop: 'url', flewGrow: 0.5},
    {name: 'Nhãn', prop: 'label', flewGrow: 0.5},
    {name: 'Hành động', prop: 'action_btn', flewGrow: 0.5},
  ]
  imageDatas: any[] = [];
  servers: any[] = [];
  urls: any[] = [];
  tags: any[] = [];
  @Input() page = new Page();
  @Input() data: any;
  cluster: any;
  applicationNodes: any[] = new Array<any>();
  iconUrl: any;
  node: FormGroup = this.fb.group({
    id: [''],
    nodeName: ['', [Validators.required, Validators.maxLength(200)]],
    nodeType: ['', Validators.required],
    clusterId: [null],
    url: ['', Validators.maxLength(250)],
    style: [''],
    treePath: [''],
    description: [''],
    status: [''],
    createTime: [null],
    createUser: [null],
    updateTime: [null],
    updateUser: [null],
    background: ['#ffffff', CustomValidators.isValidColor()],
    textColor: ['#000000', CustomValidators.isValidColor()],
    borderColor: ['#000000', CustomValidators.isValidColor()],
    borderStyle: ['solid'],
    iconId: [],
    tags: [],
    imageIds: [],
    imageDatas: [],
    servers: []
  });
  cpBackground = false;
  cpTextColor = false;
  cpBorderColor = false;
  clusters$: Observable<IApplicationCluster[]>;
  clustersInput$ = new Subject<string>();
  clustersLoading = false;
  isSaving = false;
  borderStyle: any;
  nodeTypes: any[] = [];
  nodeInfoFg: FormGroup = this.fb.group({});
  env;
  @ViewChild('imageInput') imageInput: ElementRef;
  nodeType = 'SERVER';
  baseNumber: any;
  clusterData: any
  constructor(
    public ref: NbDialogRef<ApplicationNewComponent>,
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private catItemService: CatItemService,
    private applicationClusterService: ApplicationClusterService,
    private nodeTypeInputService: NodeTypeInputService,
    private toastrService: NbToastrService,
    private changeDetector: ChangeDetectorRef,
    private applicationNodeService: ApplicationNodeService) {
    this.env = environment;
  }
  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }
  ngOnInit(): void {
    this.catItemService.query({
      categoryCodes: ['NODE_TYPE'],
      size: MAX_SAFE_INTEGER,
      page: 0,
      sort: ['itemName', 'id,desc']
    }).subscribe(res => {
      if (res) {
        this.nodeTypes = res.body || [];
        if (!this.data) {
          if (this.nodeTypes && this.nodeTypes.length > 0)
            this.node.get('nodeType').patchValue(this.nodeTypes[0].itemValue);
        } else {
          this.node.get('nodeType').patchValue(this.data.nodeType);
        }
      }
    });
    if (this.data) {
      this.applicationNodeService.getNodeService(this.data.id).subscribe(res => {
        if (res.body) {
          this.data = res.body;
          if (this.data) {
            if (this.data.style) {
              this.data = {...JSON.parse(this.data.style), ...this.data};
            }

            if (this.data.tags) {
              this.data.tags = this.data.tags.split(',').map(e => {
                return {
                  name: e.substr(1)
                }
              })
            }
            this.data.background = this.data.background || '#ffffff';
            this.data.textColor = this.data.textColor || '#000000';
            this.data.borderColor = this.data.borderColor || '#000000';
            this.borderStyle = this.data.borderStyle || 'solid';

            this.node.patchValue(this.data);
            this.imageDatas = this.data.imageDatas || [];
            if (this.imageDatas) {
              this.imageDatas.sort((a, b) => {
                if (a.priority == null && b.priority == null) return 0;
                if (a.priority != null && b.priority == null) return 1;
                if (a.priority == null && b.priority != null) return -1;
                return a.priority > b.priority ? 1 : -1;
              })
            }
            this.servers = this.data.servers || [];
            if (this.data && this.data.servers)
              this.baseNumber = this.data.servers.length
            this.urls = this.data.urls || [];
            this.cluster = {id: this.data.clusterId, treeName: this.data.treeName ? this.data.treeName.replace(' / ' + this.data.nodeName, '') : ''};
          } else {
            this.borderStyle = 'solid';
          }
        }
      })
    }
    this.loadCluster();

    this.node.get('nodeType').valueChanges.subscribe(value => {
      this.nodeTypeInputService.query({
        nodeType: value,
        size: MAX_SAFE_INTEGER,
        page: 0,
        sort: ['priority,asc']
      }).subscribe(res => {
        if (res) {
          this.objects = res.body || [];
          this.nodeInfoFg = this.fb.group({});
          this.objects = this.objects.map(i => {
            i.source = JSON.parse(i.source);
            if (i.isRequired) {
              this.nodeInfoFg.addControl(i.fieldName, new FormControl(null, Validators.required));
            } else {
              this.nodeInfoFg.addControl(i.fieldName, new FormControl(null));
            }
            if (i.defaultValue || i.defaultValue === 0) {
              this.nodeInfoFg.get(i.fieldName).patchValue(i.defaultValue);
            }
            return i;
          })
        }
      });
    });
    this.trimChar('nodeName');
    this.trimChar('description');
    this.trimChar('background');
    this.trimChar('textColor');
    this.trimChar('borderColor');
  }

  trimChar(fcName) {
    const val = this.node.get(fcName).value;
    this.node.get(fcName).patchValue(val ? val.trim() : val, {emitEvent: false});
  }

  preview(srcs, addImage?: boolean) {
    const files = Object.assign([], srcs);
    if (files.length === 0)
      return;

    for (let i = 0; i < files.length; i++) {
      const mimeType = files[i].type;
      if (mimeType.match(/image\/*/) == null) {
        this.toastrService.danger('Ảnh không đúng định dạng', 'Thông báo', {icon: 'alert-triangle-outline'})
        return;
      }
      if (files[i].size > 500 * 1024) {
        this.toastrService.danger('Ảnh không được vượt quá 500KB', 'Thông báo', {icon: 'alert-triangle-outline'})
        return;
      }
    }

    for (let index = 0; index < files.length; index++) {
      const reader = new FileReader();
      reader.onloadend = (_event) => {
        if (addImage) {
          if (!this.imageDatas) this.imageDatas = [];
          this.imageDatas = [...this.imageDatas, {
            id: null,
            imageName: files[index].name,
            previewData: reader.result,
            file: files[index]
          }];
        } else {
          this.icon = files[index];
          this.iconUrl = reader.result;
        }
      };
      reader.onerror = () => {
        this.toastrService.warning('Quá trình đọc ảnh xảy ra lỗi. Vui lòng chọn ảnh khác', 'Thông báo', {icon: 'alert-triangle-outline'});
        if (this.imageInput) {
          this.imageInput.nativeElement.value = '';
        }
      }
      reader.readAsDataURL(files[index]);
    }
    if (this.imageInput) {
      this.imageInput.nativeElement.value = '';
    }
  }

  loadCluster() {
    this.clusters$ = concat(
      of([]), // default items
      this.clustersInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.clustersLoading = true),
        switchMap(term => this.applicationClusterService.query({
          keyword: term,
          page: 0,
          size: 10,
          sort: ['treePath', 'clusterName', 'id,desc']
        }).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.clustersLoading = false),
          map(res => res.body.filter(c => !this.data || this.data.id !== c.id).map(i => {
            i.treeName = i.parentName ? `${i.parentName} / ${i.clusterName}` : i.clusterName;
            return i;
          }))
        ))
      )
    );
  }

  save() {
    if (this.node.invalid || this.nodeInfoFg.invalid) {
      console.log(this.node.value);
      // console.log(this.clusters$);
      return;
    }
    const fd = new FormData();
    fd.append('nodeName', this.node.value.nodeName || '');
    fd.append('description', this.node.value.description || '');
    fd.append('url', this.node.value.url || '');
    if (this.node.controls.tags.value) {
      const tagsData = this.node.controls.tags.value.map(e => {
        return '#' + e.name
      })
      fd.append('tags', tagsData.join() || '');
    }
    if (this.node.controls.clusterId.value) {
      // fd.append('clusterId', this.cluster.id);
    }
    fd.append('clusterId', this.cluster.id);
    fd.append('nodeType', this.node.value.nodeType || '');

    if (this.icon) {
      const blob = new Blob([this.icon])
      fd.append('icon', blob, this.icon.name);
    }
    if (this.imageDatas && this.imageDatas.length > 0) {
      for (let i = 0; i < this.imageDatas.length; i++) {
        if (this.imageDatas[i].file) {
          const blob = new Blob([this.imageDatas[i].file])
          fd.append(`imageDatas[${i}].file`, blob, this.imageDatas[i].imageName);
        }
        if (this.imageDatas[i].id) {
          fd.append(`imageDatas[${i}].id`, this.imageDatas[i].id);
        }
        fd.append(`imageDatas[${i}].priority`, i + '');
      }
    }
    if (this.servers && this.servers.length > 0) {
      for (let i = 0; i < this.servers.length; i++) {
        if (this.servers[i].id)
          fd.append(`servers[${i}].id`, this.servers[i].id);
        fd.append(`servers[${i}].name`, this.servers[i].name);
        fd.append(`servers[${i}].tags`, this.servers[i].tags);
        fd.append(`servers[${i}].description`, this.servers[i].description);
        fd.append(`servers[${i}].host`, this.servers[i].host);
        fd.append(`servers[${i}].path`, this.servers[i].path);
      }
    }
    if (this.urls && this.urls.length > 0) {
      for (let i = 0; i < this.urls.length; i++) {
        if (this.urls[i].id)
          fd.append(`urls[${i}].id`, this.urls[i].id);
        fd.append(`urls[${i}].url`, this.urls[i].url);
        fd.append(`urls[${i}].label`, this.urls[i].label);
        fd.append(`urls[${i}].description`, this.urls[i].description);

      }
    }
    let newStyle = {
      borderColor: this.node.value.borderColor,
      textColor: this.node.value.textColor,
      background: this.node.value.background,
      borderStyle: this.borderStyle
    }
    if (this.data) {
      fd.append('id', this.data.id);
      if (this.data.treePath)
        fd.append('treePath', this.data.treePath);
      if (this.data.iconId)
        fd.append('iconId', this.data.iconId);
      if (this.data.style) {
        newStyle = Object.assign(JSON.parse(this.data.style), newStyle);
      }
    }
    fd.append('style', JSON.stringify(newStyle));
    if (this.nodeInfoFg.value) {
      fd.append('nodeInfo', JSON.stringify(this.nodeInfoFg.value));
    }
    this.isSaving = true;
    if (this.data && this.data.id) {
      this.applicationNodeService.update(fd).subscribe(res => {
        this.toastrService.success('Lưu thành công', 'Thông báo');
        this.isSaving = false;
        this.ref.close(true);
      }, err => {
        this.toastrService.danger(err.error.title, 'Thông báo', {icon: 'alert-triangle-outline'});
        this.isSaving = false;
      });
    } else {
      this.applicationNodeService.create(fd).subscribe(res => {
        this.toastrService.success('Lưu thành công', 'Thông báo');
        this.isSaving = false;
        this.ref.close(true);
      }, err => {
        this.toastrService.danger(err.error.title, 'Thông báo', {icon: 'alert-triangle-outline'});
        this.isSaving = false;
      });
    }
  }

  removeImage(rowIndex) {
    this.imageDatas.splice(rowIndex, 1);
    this.imageDatas = [...this.imageDatas];
  }

  moveUpImage(rowIndex) {
    if (rowIndex === 0) return
    const b = this.imageDatas[rowIndex];
    this.imageDatas[rowIndex] = this.imageDatas[rowIndex - 1];
    this.imageDatas[rowIndex - 1] = b;
    this.imageDatas = [...this.imageDatas]
  }
  moveDownImage(rowIndex) {
    if (rowIndex === this.imageDatas.length - 1) return
    const b = this.imageDatas[rowIndex];
    this.imageDatas[rowIndex] = this.imageDatas[rowIndex + 1];
    this.imageDatas[rowIndex + 1] = b;
    this.imageDatas = [...this.imageDatas]
  }

  loanDataServiceTable() {

  }

  edit(row: any, rowindex?: any) {
    const ref = this.dialogService.open(ApplicationNodeServerComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: `Sửa thông tin ứng dụng Spark server`,
        data: row,
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.servers[rowindex] = res;
        this.servers = [...this.servers]
        this.setPage(this.page);
      }
    });
  }
  editUrl(row: any, rowindex?: any) {
    const ref = this.dialogService.open(NodeUrlComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: `Sửa thông tin url`,
        data: row,
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.urls[rowindex] = res;
        this.urls = [...this.urls]
        this.setPage(this.page);
      }
    });
  }

  removeIcon() {
    if (this.data && this.data.iconId)
      this.data.iconId = null;
    if (this.icon)
      this.icon = null;
    if (this.iconUrl)
      this.iconUrl = null;
  }

  addTagFn(name) {
    return {name: name};
  }

  openDialog() {
    const ref = this.dialogService.open(ApplicationNodeServerComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: `Thông tin ứng dụng Spark server`
      },
    });
    ref.onClose.subscribe(res => {
      console.log(res)
      if (res) {
        this.servers.push(res);
        // load lại server
        this.servers = [...this.servers]
      }
    });
  }
  openDialogUrl() {
    const ref = this.dialogService.open(NodeUrlComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: `Thông tin url`
      },
    });
    ref.onClose.subscribe(res => {
      console.log(res)
      if (res) {
        this.urls.push(res);
        // load lại url
        this.urls = [...this.urls]
      }
    });
  }

  setPage(pageInfo?) {
    const pageToLoad: number = pageInfo.offset || pageInfo.pageNumber;
    if (!this.cluster) {
      this.page.totalElements = 0;
      this.page.pageNumber = 0;
      this.applicationNodes = [];
      return;
    }
    this.applicationNodeService.query({
      clusterIds: [this.cluster.id],
      page: pageToLoad,
      size: 10,
    }).subscribe(res => {
      this.page.totalElements = Number(res.headers.get('X-Total-Count'));
      this.page.pageNumber = pageToLoad || 0;
      this.applicationNodes = res.body || [];
    });
  }

  delete(row, rowIndex) {
    this.servers.splice(rowIndex, 1);
    this.servers = [...this.servers];
  }
  deleteUrl(row, rowIndex) {
    this.urls.splice(rowIndex, 1);
    this.urls = [...this.urls];
  }
}
