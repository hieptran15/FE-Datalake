import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {ApplicationClusterService} from '../../../services/application-cluster.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'ngx-node-url',
  templateUrl: './node-url.component.html',
  styleUrls: ['./node-url.component.scss']
})
export class NodeUrlComponent implements OnInit {

  constructor(
    public ref: NbDialogRef<NodeUrlComponent>,
    private dialogService: NbDialogService,
    private applicationClusterService: ApplicationClusterService,
    private fb: FormBuilder) {
  }
  @Input() title: string;
  @Input() data: any = {};
  parentName: string;
  isSaving = false;
  borderStyle: any;

  url: FormGroup = this.fb.group({
    id: null,
    nodeId: null,
    label: [null, [Validators.maxLength(500), Validators.required]],
    url: [null, [Validators.maxLength(500), Validators.required]],
    description: null,
    status: null,
    createTime: null,
    createUser: null,
    updateTime: null,
    updateUser: null,
  })
  ngOnInit(): void {
    // this.loadParents();
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
      this.url.patchValue(tempData);
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
    contentsCss: ['body {font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif;}'],
    autoParagraph: false,
    enterMode: 2
  };

  trimChar(fcName) {
    const val = this.url.get(fcName).value;
    this.url.get(fcName).patchValue(val ? val.trim() : val, {emitEvent: false});
  }

  save() {
    if (this.url.invalid) {
      return;
    }
    const fg = this.url.value;
    this.isSaving = true;
    this.ref.close(fg);
    return { name: name, tag: true };
  }

}
