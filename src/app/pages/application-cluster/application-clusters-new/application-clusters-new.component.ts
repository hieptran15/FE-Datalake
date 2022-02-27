import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef, NbDialogService, NbToastrService} from '@nebular/theme';
import {ApplicationClusterService} from '../../../services/application-cluster.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {concat, Observable, of, Subject} from 'rxjs';
import {IApplicationCluster} from '../../../model/application-cluster.model';
import {catchError, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {CustomValidators} from '../../../share/directive/custom-validator.directive';
import any = jasmine.any;

@Component({
  selector: 'ngx-application-clusters-new',
  templateUrl: './application-clusters-new.component.html',
  styleUrls: ['./application-clusters-new.component.scss'],
})
export class ApplicationClustersNewComponent implements OnInit {

  constructor(
    public ref: NbDialogRef<ApplicationClustersNewComponent>,
    private dialogService: NbDialogService,
    private applicationClusterService: ApplicationClusterService,
    private fb: FormBuilder,
    private toastrService: NbToastrService) {
  }

  @Input() title: string;
  @Input() data: any = {};
  parentName: string;
  parents$: Observable<IApplicationCluster[]>;
  parentsInput$ = new Subject<string>();
  parentsLoading = false;
  selectedParent: IApplicationCluster;
  isSaving = false;
  borderStyle: any;
  companies: any[] = [];
  tags: any[] = [];
  applicationCluster: FormGroup = this.fb.group({
    id: null,
    clusterCode: null,
    clusterName: [null, [Validators.required, Validators.maxLength(200)]],
    parentId: null,
    description: null,
    style: null,
    background: ['#ffffff', CustomValidators.isValidColor()],
    textColor: ['#000000', CustomValidators.isValidColor()],
    borderStyle: 'solid',
    borderColor: ['#000000', CustomValidators.isValidColor()],
    status: null,
    createTime: null,
    tags: [],
    createUser: null,
    updateTime: null,
    updateUser: null
  });

  ngOnInit(): void {
    this.loadParents();
    if (this.data) {
      if (this.data.style) {
        this.data = {...JSON.parse(this.data.style), ...this.data};
      }
      this.borderStyle = this.data.borderStyle || 'solid';
      this.data.background = this.data.background || '#ffffff';
      this.data.textColor = this.data.textColor || '#000000';
      this.data.borderColor = this.data.borderColor || '#000000';
      if (this.data.parentId) {
        this.selectedParent = {id: this.data.parentId, clusterName: this.data.parentName};
      }
      if (this.data.tags) {
        this.data.tags = this.data.tags.split(',').map(e => {
          return {
            name: e.substr(1)
          }
        })
      }
      this.applicationCluster.patchValue(this.data);
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
    const val = this.applicationCluster.get(fcName).value;
    this.applicationCluster.get(fcName).patchValue(val ? val.trim() : val, {emitEvent: false});
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
    if (this.applicationCluster.invalid) {
      return;
    }
    const fg = this.applicationCluster.value;
    if (this.selectedParent) {
      fg.parentId = this.selectedParent.id;
    }
    let newStyle = {
      borderColor: fg.borderColor,
      textColor: fg.textColor,
      background: fg.background,
      borderStyle: this.borderStyle
    }
    if (this.data && this.data.style) {
      newStyle = Object.assign(JSON.parse(this.data.style), newStyle);
    }
    if (this.applicationCluster.controls.tags.value) {
      const tagsData = this.applicationCluster.controls.tags.value.map(e => {
        return '#' + e.name
      })
      fg.tags = tagsData.join();
    }
    fg.style = JSON.stringify(newStyle);
    this.isSaving = true;
    if (this.data.id) {
      this.applicationClusterService.update(fg).subscribe(res => {
        this.toastrService.success('Lưu thành công', 'Thông báo');
        this.isSaving = false;
        this.ref.close(true);
      }, err => {
        this.toastrService.danger(err.error.title, 'Thông báo');
        this.isSaving = false;
      });
    } else {
      this.applicationClusterService.create(fg).subscribe(res => {
        this.toastrService.success('Lưu thành công', 'Thông báo');
        this.isSaving = false;
        this.ref.close(res);
      }, err => {
        this.toastrService.danger(err.error.title, 'Thông báo');
        this.isSaving = false;
      });
    }
  }
  addTagFn(name) {
    return { name: name, tag: true };
  }

}
