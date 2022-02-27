import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'ngx-border-select',
  templateUrl: './border-select.component.html',
  styleUrls: ['./border-select.component.scss'],
})
export class BorderSelectComponent implements OnInit {

  constructor() { }
  borderLists: any = ['dotted', 'dashed' , 'solid'];
  @Input() borderStyle: any;
  @Output() borderStyleChange = new EventEmitter();
  ngOnInit(): void {
  }

  change(value) {
    this.borderStyleChange.emit(value)
  }
}
