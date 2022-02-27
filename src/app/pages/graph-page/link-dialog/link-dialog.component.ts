import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'ngx-link-dialog',
  templateUrl: './link-dialog.component.html',
  styleUrls: ['./link-dialog.component.scss']
})
export class LinkDialogComponent implements OnInit {

  constructor(
    public ref: NbDialogRef<LinkDialogComponent>,
  ) { }
  @Input() data: any
  ngOnInit(): void {
    if (this.data) {
      this.data.description = (this.data.description || '').replace(/(?:\r\n|\r|\n)/g, '<br>')
    }
  }

}
