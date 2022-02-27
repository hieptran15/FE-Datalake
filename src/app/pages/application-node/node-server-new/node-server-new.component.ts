import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef, NbDialogService, NbToastrService} from '@nebular/theme';
import {ApplicationClusterService} from '../../../services/application-cluster.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {concat, Observable, of, Subject} from 'rxjs';
import {IApplicationCluster} from '../../../model/application-cluster.model';
import {catchError, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {CustomValidators} from '../../../share/directive/custom-validator.directive';


@Component({
  selector: 'ngx-application-clusters-new',
  templateUrl: './node-server-new.component.html',
  styleUrls: ['./node-server-new.component.scss'],
})
export class ApplicationNodeServerComponent implements OnInit {

  constructor(
    public ref: NbDialogRef<ApplicationNodeServerComponent>,
    private dialogService: NbDialogService,
    private applicationClusterService: ApplicationClusterService,
    private fb: FormBuilder,
    private toastrService: NbToastrService) {
  }
  @Input() title: string;
  @Input() data: any = {};
  parentName: string;
  parents$: Observable<any[]>;
  parentsInput$ = new Subject<string>();
  parentsLoading = false;
  selectedParent: IApplicationCluster;
  isSaving = false;
  borderStyle: any;
  companies: any[] = [];
  // applicationCluster: FormGroup = this.fb.group({
  //   id: null,
  //   clusterCode: null,
  //   clusterName: [null, [Validators.required, Validators.maxLength(200)]],
  //   parentId: null,
  //   description: [null, Validators.maxLength(500)],
  //   style: null,
  //   background: ['#ffffff', CustomValidators.isValidColor()],
  //   textColor: ['#000000', CustomValidators.isValidColor()],
  //   borderStyle: 'solid',
  //   borderColor: ['#000000', CustomValidators.isValidColor()],
  //   status: null,
  //   createTime: null,
  //   tags: [],
  //   createUser: null,
  //   updateTime: null,
  //   updateUser: null
  // });
  server: FormGroup = this.fb.group({
    name: [null, [Validators.required, Validators.maxLength(200)]],
    code: null,
    description: null,
    nodeId: null,
    tags: [],
    host: [null, [Validators.required, Validators.maxLength(500)]],
    path: [null, [Validators.required, Validators.maxLength(500)]],
    status: null,
    createTime: null,
    createUser: null,
    updateTime: null,
    updateUser: null,
    id: null
  });

  ngOnInit(): void {
    this.loadParents();
    const tempData = Object.assign({} , this.data);
    if (tempData) {
      if (tempData.tags) {
          tempData.tags = tempData.tags.split(',').map(e => {
          console.log(this.data.tags)
          return {
            name: e.substr(1)
          }
        })
      }
      this.server.patchValue(tempData);
    } else {
      this.borderStyle = 'solid';
    }

  }
  config: any = {
    allowedContent: true,
    toolbarGroups : [
      { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
      { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
      { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
      { name: 'forms', groups: [ 'forms' ] },
      '/',
      { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
      { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
      { name: 'links', groups: [ 'links' ] },
      { name: 'insert', groups: [ 'insert' ] },
      '/',
      { name: 'styles', groups: [ 'styles' ] },
      { name: 'colors', groups: [ 'colors' ] },
      { name: 'tools', groups: [ 'tools' ] },
      { name: 'others', groups: [ 'others' ] },
      { name: 'about', groups: [ 'about' ] }
    ],
    removePlugins: 'elementspath',
    resize_enabled: false,
    // extraPlugins: 'font,placeholder',
    contentsCss: ['body {font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif;}'],
    autoParagraph: false,
    enterMode: 2
  };

  trimChar(fcName) {
    const val = this.server.get(fcName).value;
    this.server.get(fcName).patchValue(val ? val.trim() : val, {emitEvent: false});
  }

  loadParents() {
    this.parents$ = concat(
      of([]), // default items
      this.parentsInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.parentsLoading = true),
        switchMap(term => this.applicationClusterService.query({
          keyword: term,
          page: 0,
          size: 10,
          sort: ['treePath', 'clusterName', 'id,desc']
        }).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.parentsLoading = false),
          map(res => res.body.filter(c => !this.data || this.data.id !== c.id))
        ))
      )
    );
  }

  save() {
    if (this.server.invalid) {
      return;
    }
    const fg = this.server.value;
    if (fg.tags) {
      const data = this.server.controls.tags.value.map(e => {
        return '#' + e.name
      });
      if (data)
      fg.tags = data.join()
    }
    this.isSaving = true;
    this.ref.close(fg)
    // if (this.data) {
    //   this.isSaving = true;
    //   this.ref.close({
    //     role: 'edit',
    //     data: fg
    //   })
    // } else {
    // this.isSaving = true;
    // this.ref.close({
    //   role: 'new',
    //   data: fg
    // })
    // }
  }
  addTagFn(name) {
    return { name: name, tag: true };
  }
}
