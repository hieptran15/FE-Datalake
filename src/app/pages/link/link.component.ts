import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef, NbDialogService, NbToastrService} from '@nebular/theme';
import {LinkNewComponent} from './link-new/link-new.component';
import {concat, Observable, of, Subject} from 'rxjs';
import {catchError, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {ApplicationClusterService} from '../../services/application-cluster.service';
import {IApplicationCluster} from '../../model/application-cluster.model';
import {IApplicationNode} from '../../model/application-node.model';
import {LinkService} from '../../services/link.service';
import {Page} from '../../@core/model/page.model';
import {ApplicationNodeService} from '../../services/application-node.service';
import {ApplicationRelation} from '../../model/applicationRelation.model';
import {ConfirmDialogComponent} from '../../share/component/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'ngx-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
})
export class LinkComponent implements OnInit {
  clusters$: Observable<IApplicationCluster[]>;
  clusterInput$ = new Subject<string>();
  clusterLoading = false;
  selectedCluster: IApplicationCluster;
  nodes$: Observable<IApplicationNode[]>;
  nodeInput$ = new Subject<string>();
  nodeLoading = false;
  selectedNode: IApplicationNode;
  page = new Page();
  links?: ApplicationRelation[] = new Array<ApplicationRelation>();
  @Input() title: string;
  saveSearchFrm: any = {};

  constructor(private dialogService: NbDialogService,
              private applicationClusterService: ApplicationClusterService,
              private linkService: LinkService,
              private toastrService: NbToastrService,
              private applicationNodeService: ApplicationNodeService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  columns = [
    {name: 'Từ ', prop: 'leftRelation', flexGrow: 1},
    {name: 'Đến ', prop: 'rightRelation', flexGrow: 2},
    {name: 'Tên liên kết', prop: 'label', flexGrow: 2},
    {name: 'Mô tả', prop: 'description', flexGrow: 2},
    {name: 'Hành động', prop: 'action_btn', flexGrow: 2},
  ];

  ngOnInit(): void {
    this.loadCluster();
    this.loadNode();
    this.setPage(this.page);

  }

  addLink() {
    const ref = this.dialogService.open(LinkNewComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {},
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.setPage(this.page)
      }
    });
  }

  loadCluster() {
    this.clusters$ = concat(
      of([]), // default items
      this.clusterInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.clusterLoading = true),
        switchMap(term => this.applicationClusterService.query({
          keyword: term,
          page: 0,
          size: 10,
          sort: ['treePath', 'clusterName', 'id,desc']
        }).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.clusterLoading = false),
          map(res => res.body.map(i => {
            i.treeName = i.parentName ? `${i.parentName} >> ${i.clusterName}` : i.clusterName;
            return i;
          }))
        ))
      )
    );
  }

  loadNode() {
    this.nodes$ = concat(
      of([]), // default items
      this.nodeInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.nodeLoading = true),
        switchMap(term => this.applicationNodeService.query({
          keyword: term,
          page: 0,
          size: 10,
          sort: ['treePath', 'nodeName', 'id,desc']
        }).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.nodeLoading = false),
          map(res => res.body)
        ))
      )
    );
  }

  search() {
    this.saveSearchFrm = {
      clusterIds: this.selectedCluster,
      nodeIds: this.selectedNode,
    }
    this.setPage({offset: 0});
  }

  setPage(page) {
    const pageToLoad: number = page.offset || page.pageNumber;
    this.linkService.query({
      clusterIds: this.saveSearchFrm.clusterIds,
      nodeIds: this.saveSearchFrm.nodeIds,
      size: 10,
      page: pageToLoad
    }).subscribe(res => {
      this.page.totalElements = Number(res.headers.get('X-Total-Count'));
      this.page.pageNumber = pageToLoad || 0;
      this.links = res.body || [];
    });
  }

  editLink(row) {
    const ref = this.dialogService.open(LinkNewComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        data: row
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.setPage(this.page)
      }
    });
  }

  deleteLink(row) {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      autoFocus: true,
      closeOnBackdropClick: false,
      context: {
        message: `Bạn có chắc chắn muốn xóa thông tin liên kết từ '${row.leftClusterName || row.leftNodeName}' đến '${row.rightClusterName || row.rightNodeName}' không?`
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.linkService.delete(row.id).subscribe(() => {
          if (this.page.totalElements - this.page.pageNumber * this.page.size === 1 ) {
            this.page.pageNumber = this.page.pageNumber - 1;
          }
          this.setPage(this.page);
          this.toastrService.success('Xóa thành công', 'Thông báo');
        }, (error) => {
          this.toastrService.danger(error.error.title, 'Lỗi', {icon: 'alert-triangle-outline'});
        });
      }
    });
  }
}
