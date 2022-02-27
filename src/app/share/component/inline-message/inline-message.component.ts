import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'ngx-inline-message',
  templateUrl: './inline-message.component.html',
  styleUrls: ['./inline-message.component.scss']
})
export class InlineMessageComponent implements OnInit {
  @Input() formName: FormControl;
  @Input() message;
  @Input() isFile;
  constructor() { }

  ngOnInit() {
  }

}
