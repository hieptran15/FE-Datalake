import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NbDialogRef, NbToastrService} from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IApplicationRealation} from '../../../model/applicationRelation.model';
import {concat, Observable, of, Subject} from 'rxjs';
import {catchError, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {ApplicationClusterService} from '../../../services/application-cluster.service';
import {LinkService} from '../../../services/link.service';
import {ApplicationNodeService} from '../../../services/application-node.service';
import {IApplicationCluster} from '../../../model/application-cluster.model';
import {IApplicationNode} from '../../../model/application-node.model';
import {CustomValidators} from '../../../share/directive/custom-validator.directive';

@Component({
  selector: 'ngx-link-new',
  templateUrl: './link-new.component.html',
  styleUrls: ['./link-new.component.scss'],
})
export class LinkNewComponent implements OnInit, OnChanges {

  @Input() data: IApplicationRealation;
  leftClusters$: Observable<IApplicationCluster[]>;
  leftClusterInput$ = new Subject<string>();
  leftClusterLoading = false;
  leftServer$: Observable<IApplicationCluster[]>;
  leftServerInput$ = new Subject<string>();
  leftServerLoading = false;
  rightServer$: Observable<IApplicationCluster[]>;
  rightServerInput$ = new Subject<string>();
  rightServerLoading = false;
  leftNodes$: Observable<IApplicationNode[]>;
  leftNodeInput$ = new Subject<string>();
  leftNodeLoading = false;
  rightClusters$: Observable<IApplicationCluster[]>;
  rightClusterInput$ = new Subject<string>();
  rightClusterLoading = false;
  rightNodes$: Observable<IApplicationNode[]>;
  rightNodeInput$ = new Subject<string>();
  rightNodeLoading = false;
  selectedLeftNode: any = null;
  selectedLeftCluster: any = null;
  selectedRightCluster: any = null;
  selectedRightNode: any = null;
  selectedRightServer: any = null;
  selectedLeftServer: any = null;
  isSaving: boolean;
  types = [
    {label: 'Cụm server', value: 2},
    {label: 'Cụm ứng dụng', value: 0},
    {label: 'Ứng dụng', value: 1},
  ]
  leftType = 0;
  rightType = 0;

  constructor(public ref: NbDialogRef<LinkNewComponent>,
              private fb: FormBuilder,
              private applicationClusterService: ApplicationClusterService,
              private linkService: LinkService,
              private toastrService: NbToastrService,
              private applicationNodeService: ApplicationNodeService
  ) {
  }

  linkFormGroup: FormGroup = this.fb.group({
    createTime: [null],
    createUser: [null],
    description: [null, [Validators.maxLength(500)]],
    id: [null],
    label: [null, [Validators.maxLength(200)]],
    leftClusterId: [null],
    leftClusterName: [null],
    leftNodeId: [null],
    textColor: ['#000000', CustomValidators.isValidColor()],
    borderStyle: 'solid',
    borderColor: ['#000000', CustomValidators.isValidColor()],
    leftNodeName: [null],
    rightClusterId: [null],
    rightClusterName: [null],
    rightNodeId: [null],
    rightNodeName: [null],
    status: [null],
    style: [null],
    updateTime: [null],
    updateUser: [null],
  })

  ngOnInit(): void {
    this.loadLeftCluster();
    this.loadLeftNode();
    this.loadRightCluster();
    this.loadRightNode();
    this.loadLeftServer();
    this.loadRightServer();
    if (this.data) {
      if (this.data.style) {
        this.data = {...JSON.parse(this.data.style), ...this.data};
      }

      if (this.data.leftClusterId) {
        this.selectedLeftCluster = {id: this.data.leftClusterId, clusterName: this.data.leftClusterName};
        this.leftType = 0;
      }
      if (this.data.leftNodeId) {
        this.selectedLeftNode = {id: this.data.leftNodeId, nodeName: this.data.leftNodeName};
        this.leftType = 1;
      }
      if (this.data.rightClusterId) {
        this.selectedRightCluster = {id: this.data.rightClusterId, clusterName: this.data.rightClusterName};
        this.rightType = 0;
      }
      if (this.data.rightNodeId) {
        this.selectedRightNode = {id: this.data.rightNodeId, nodeName: this.data.rightNodeName};
        this.rightType = 1;
      }
      this.updateForm(this.data)
    }
    this.trimChar('label');
    this.trimChar('description');
    this.trimChar('textColor');
    this.trimChar('borderColor');
  }

  trimChar(fcName) {
    const val = this.linkFormGroup.get(fcName).value;
    this.linkFormGroup.get(fcName).patchValue(val ? val.trim() : val, {emitEvent: false});
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }

  updateForm(data: any) {
    this.linkFormGroup.patchValue({
      id: data.id,
      label: data.label,
      status: data.status,
      description: data.description,
      createTime: data.createTime,
      createUser: data.createUser,
      updateTime: data.updateTime,
      updateUser: data.updateUser,
      textColor: data.textColor || '#000000',
      borderColor: data.borderColor,
      borderStyle: data.borderStyle || 'solid'
    }, {emitEvent: false})
  }

  loadLeftCluster() {
    this.leftClusters$ = concat(
      of([]), // default items
      this.leftClusterInput$.pipe(
        // distinctUntilChanged(),
        tap(() => this.leftClusterLoading = true),
        switchMap(term => this.applicationClusterService.query({
          keyword: term,
          page: 0,
          size: 10,
          level: 1,
          treePath: this.selectedLeftServer ? this.selectedLeftServer.treePath : null,
          sort: ['treePath', 'clusterName', 'id,desc']
        }).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.leftClusterLoading = false),
          map(res => res.body.map(i => {
            return i;
          }))
        ))
      )
    );
  }
  loadLeftServer() {
    this.leftServer$ = concat(
      of([]), // default items
      this.leftServerInput$.pipe(
        // distinctUntilChanged(),
        tap(() => this.leftServerLoading = true),
        switchMap(term => this.applicationClusterService.query({
          keyword: term,
          page: 0,
          level: 0,
          size: 10,
          sort: ['treePath', 'clusterName', 'id,desc']
        }).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.leftServerLoading = false),
          map(res => res.body.map(i => {
            return i;
          }))
        ))
      )
    );
  }
  loadRightServer() {
    this.rightServer$ = concat(
      of([]), // default items
      this.rightServerInput$.pipe(
        // distinctUntilChanged(),
        tap(() => this.rightServerLoading = true),
        switchMap(term => this.applicationClusterService.query({
          keyword: term,
          page: 0,
          level: 0,
          size: 10,
          sort: ['treePath', 'clusterName', 'id,desc']
        }).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.rightServerLoading = false),
          map(res => res.body.map(i => {
            return i;
          }))
        ))
      )
    );
  }

  loadLeftNode() {
    this.leftNodes$ = concat(
      of([]), // default items
      this.leftNodeInput$.pipe(
        // distinctUntilChanged(),
        tap(() => this.leftNodeLoading = true),
        switchMap(term => this.applicationNodeService.query({
          keyword: term,
          page: 0,
          size: 10,
          treePath: this.selectedLeftCluster ? this.selectedLeftCluster.treePath : (this.selectedLeftServer ? this.selectedLeftServer.treePath : null),
          sort: ['treePath', 'nodeName', 'id,desc']
        }).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.leftNodeLoading = false),
          map(res => res.body)
        ))
      )
    );
  }

  loadRightCluster() {
    this.rightClusters$ = concat(
      of([]), // default items
      this.rightClusterInput$.pipe(
        // distinctUntilChanged(),
        tap(() => this.rightClusterLoading = true),
        switchMap(term => this.applicationClusterService.query({
          keyword: term,
          page: 0,
          treePath: this.selectedRightServer ? this.selectedRightServer.treePath : null,
          level: 1,
          size: 10,
          sort: ['treePath', 'clusterName', 'id,desc']
        }).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.rightClusterLoading = false),
          map(res => res.body.map(i => {
              return i;
          }))
        ))
      )
    );
  }

  loadRightNode() {
    this.rightNodes$ = concat(
      of([]), // default items
      this.rightNodeInput$.pipe(
        // distinctUntilChanged(),
        tap(() => this.rightNodeLoading = true),
        switchMap(term => this.applicationNodeService.query({
          keyword: term,
          page: 0,
          size: 10,
          treePath: this.selectedRightCluster ? this.selectedRightCluster.treePath : (this.selectedRightServer ? this.selectedRightServer.treePath : null),
          sort: ['treePath', 'nodeName', 'id,desc']
        }).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.rightNodeLoading = false),
          map(res => res.body)
        ))
      )
    );
  }

  save() {
    if (this.linkFormGroup.invalid) {
      return;
    }
    const fg = this.linkFormGroup.value;
    if (this.selectedLeftCluster && this.leftType === 0) {
      fg.leftClusterId = this.selectedLeftCluster.id;
      fg.leftClusterName = this.selectedLeftCluster.clusterName;
    }
    if (this.selectedLeftServer && this.leftType === 2) {
      fg.leftClusterId = this.selectedLeftServer.id;
      fg.leftClusterName = this.selectedLeftServer.clusterName;
    }
    if (this.selectedLeftNode && this.leftType === 1) {
      fg.leftNodeId = this.selectedLeftNode.id;
      fg.leftNodeName = this.selectedLeftNode.nodeName;
    }
    if (this.selectedRightCluster && this.rightType === 0) {
      fg.rightClusterId = this.selectedRightCluster.id;
      fg.rightClusterName = this.selectedRightCluster.clusterName;
    }
    if (this.selectedRightServer && this.rightType === 2) {
      fg.rightClusterId = this.selectedRightServer.id;
      fg.rightClusterName = this.selectedRightServer.clusterName;
    }
    if (this.selectedRightNode && this.rightType === 1) {
      fg.rightNodeId = this.selectedRightNode.id;
      fg.rightNodeName = this.selectedRightNode.nodeName;
    }
    let newStyle = {
      borderColor: fg.borderColor,
      textColor: fg.textColor,
      borderStyle: fg.borderStyle
    }
    if (fg.style) {
      newStyle = Object.assign(this.data && this.data.style ? JSON.parse(this.data.style) : {}, newStyle);
    }
    fg.style = JSON.stringify(newStyle);
    this.isSaving = true;
    if (fg.id) {
      this.linkService.update(fg).subscribe(res => {
        this.toastrService.success('Lưu thành công', 'Thông báo');
        this.isSaving = false;
        this.ref.close(true);
      }, err => {
        this.toastrService.danger(err.error.title, 'Thông báo');
        this.isSaving = false;
      });
    } else {
      fg.id = null;
      this.linkService.create(fg).subscribe(res => {
        this.toastrService.success('Lưu thành công', 'Thông báo');
        this.isSaving = false;
        this.ref.close(true);
      }, err => {
        this.toastrService.danger(err.error.title, 'Thông báo');
        this.isSaving = false;
      });
    }
  }
}
