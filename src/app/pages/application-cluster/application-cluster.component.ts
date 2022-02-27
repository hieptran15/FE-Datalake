import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NbDialogService, NbIconLibraries, NbToastrService} from '@nebular/theme';
import {ApplicationClustersNewComponent} from './application-clusters-new/application-clusters-new.component';
import {Page} from '../../@core/model/page.model';
import {IApplicationCluster} from '../../model/application-cluster.model';
import {ApplicationClusterService} from '../../services/application-cluster.service';
import {ConfirmDialogComponent} from '../../share/component/confirm-dialog/confirm-dialog.component';
import {MAX_SAFE_INTEGER} from '../../share/common.constant';

@Component({
  selector: 'ngx-application-cluster',
  templateUrl: './application-cluster.component.html',
  styleUrls: ['./application-cluster.component.scss'],
})
export class ApplicationClusterComponent implements OnInit {
   baseApplicationClusters: any;

  constructor(
    private applicationClusterService: ApplicationClusterService,
    private dialogService: NbDialogService,
    private cd: ChangeDetectorRef,
    private toastrService: NbToastrService, private iconsLibrary: NbIconLibraries) {
    iconsLibrary.registerFontPack('fa', {packClass: 'fa', iconClassPrefix: 'fa'});
    iconsLibrary.registerFontPack('far', {packClass: 'far', iconClassPrefix: 'fa'});
    iconsLibrary.registerFontPack('ion', {iconClassPrefix: 'ion'});
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  @Input() page = new Page();
  @Input() title: string;
  @Input() keyword: string;
  @Output() changeCluster = new EventEmitter();
  @ViewChild('myTable') table: any;
  dataSub = new Map<unknown, unknown>()
  columns = [
    {name: '', prop: 'id', flexGrow: 1.5   },
    {name: 'Tên cụm', prop: 'clusterName', flexGrow: 3},
    {name: 'Tags', prop: 'tags', flexGrow: 2},
    {name: 'Hành động', prop: 'action_btn', flexGrow: 1.5},
  ];
  childrenColumns = [
    {name: 'STT', prop: 'id', flexGrow: 1.425   },
    {name: 'Tên cụm', prop: 'clusterName', flexGrow: 3},
    {name: 'Tags', prop: 'tags', flexGrow: 2},
    {name: 'Hành động', prop: 'action_btn', flexGrow: 1.5},
  ];
  applicationClusters: IApplicationCluster[] = new Array<IApplicationCluster>();
  expandedItems: any[] = [];

  ngOnInit(): void {
    this.setPage(this.page);
  }

  search(): void {
    this.setPage({offset: 0});
  }

  setPage(pageInfo, keepState ?: boolean) {
    const pageToLoad: number = pageInfo.offset || pageInfo.pageNumber;
    this.applicationClusterService.query({
      keyword: (this.keyword || '').replace(/\+/gi, '%2B'),
      level: 0,
      page: pageToLoad,
      size: 10,
    }).subscribe(res => {
      this.page.totalElements = Number(res.headers.get('X-Total-Count'));
      this.page.pageNumber = pageToLoad || 0;
      this.applicationClusters = Object.assign([], res.body);
      this.baseApplicationClusters = Object.assign([], res.body)
      if (this.applicationClusters.length > 0) {
        this.changeCluster.emit(this.applicationClusters[0]);
      } else {
        this.changeCluster.emit();
      }
      if (keepState && this.expandedItems.length > 0) {
        const that = this
        setTimeout(function() {
          that.toggleExpandRow()
        }, 500);
      } else {
        this.expandedItems = [];
      }
    });

  }
  getRowClass(row) {
    return {
      'selectedRow': row.treeStatus === 'expanded'
    };
  }
  getChildren(level ?: any, row ?: any, pageData?: any) {
    row.treeStatus = 'loading';
    this.cd.detectChanges();
    this.applicationClusterService.query({
      level: level || 0,
      treePath: row.treePath,
      page: pageData ? pageData.offset : 0,
      size: pageData ? pageData.limit : 5,
    }).subscribe(res => {
      row.treeStatus = 'expanded';
      const listId = this.applicationClusters.map(e => e.id)
      const dataCluster = res.body.filter(data => {
        if (listId.indexOf(data.id) === -1) {
          return data;
        }
      })
      const dataRow = {
        page: {
          pageNumber: pageData ? pageData.offset || 0 : 0,
          size: pageData ? pageData.limit || 5 : 5,
          totalElements: Number(res.headers.get('X-Total-Count'))
        },
        id: row.id,
        level: level || 0,
        treePath: row.treePath,
        data: dataCluster
      }
      this.dataSub.set(row.id , dataRow);

      this.cd.detectChanges();
    }, err => {
      console.error(err)
      this.cd.detectChanges();
    });
  }

  addApplicationCluster(parent?: any) {
    const ref = this.dialogService.open(ApplicationClustersNewComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: parent ? `Thêm mới cụm ứng dụng của cụm server '${parent.clusterName}'` : 'Thêm mới cụm server',
        parentName: parent ? parent.clusterName : '',
        data: parent ? {
          parentId: parent.id,
          parentName: parent.clusterName
        } : {}
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        if (parent && this.expandedItems.indexOf(parent.treePath) === -1) {
          this.expandedItems.push(parent.treePath);
        }
        this.page.pageNumber = 0
        this.setPage(this.page, true);
      }
    });
  }

  viewNodes(cluster) {
    this.changeCluster.emit(cluster);
  }

  edit(row) {
    if (!row.id) return;
    const ref = this.dialogService.open(ApplicationClustersNewComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: (row.parentId ? 'Chỉnh sửa cụm ứng dụng' : 'Chỉnh sửa cụm server') + ` '${row.clusterName}'`,
        data: row
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.setPage(this.page, true);
        const expandedItem = Object.assign([], this.applicationClusters).map(e => {
          if (this.expandedItems.indexOf(e.treePath) !== -1) {
            return e
          }
        })
        console.log(expandedItem)
        // this.onTreeAction(parent , true);
      }
    });
  }

  onTreeAction(event: any, toggleRow?: any) {
    const row = event
    if (!row.treeStatus || row.treeStatus === 'collapsed') {
      row.treeStatus = 'expanded';
      if (this.expandedItems.indexOf(row.treePath) === -1) {
        this.expandedItems.push(row.treePath);
      }
      const level = (row.treePath.length - row.treePath.split('/').join('').length - 1)
      this.getChildren(level, row);
    } else {
      row.treeStatus = 'collapsed';
      this.applicationClusters = [...this.applicationClusters];
      if (this.expandedItems.indexOf(row.treePath) !== -1) {
        this.expandedItems.splice(this.expandedItems.indexOf(row.treePath), 1);
      }
      this.cd.detectChanges();
    }
    if (!toggleRow)
      this.table.rowDetail.toggleExpandRow(row);
  }

  delete(row) {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      autoFocus: true,
      closeOnBackdropClick: false,
      context: {
        message: `Bạn có chắc chắn muốn xóa thông tin cụm '${row.clusterName}' không?`
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.applicationClusterService.delete(row.id).subscribe(
          () => {
            if (this.page.totalElements - this.page.pageNumber * this.page.size === 1 ) {
              this.page.pageNumber = this.page.pageNumber - 1;
            }
            this.setPage(this.page, true);

            this.toastrService.success('Xóa thành công', 'Thông báo', {icon: 'checkmark-outline'});
          },
          (error) => {
            this.toastrService.danger(error.error.title, 'Lỗi', {icon: 'alert-triangle-outline'});
          }
        );
      }
    });

  }

  toggleExpandRow() {
    console.log(this.baseApplicationClusters)
    const expandedI = this.baseApplicationClusters.filter(e => {
      if (this.expandedItems.indexOf(e.treePath) >= 0) {
        this.onTreeAction(e , false);
        return e
      }
    })
  }

  setDataSub(row: any) {
    const level = (row.treePath.length - row.treePath.split('/').join('').length - 1)
    return this.getChildren(level, row)
  }

  getDataSub(id: any) {
    return this.dataSub.get(id)
  }
}
