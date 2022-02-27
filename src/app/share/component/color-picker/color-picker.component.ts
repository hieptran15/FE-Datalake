import {AfterContentInit, Component, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'ng-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit, AfterContentInit {
  color: any;

  constructor(protected ref: NbDialogRef<ColorPickerComponent>) {
  }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    const cardElm = document.getElementById('colorPickerContainer');
    if (cardElm)
      setTimeout(function () {
        cardElm.click();
      });
  }

  cancel() {
    this.ref.close(null);
  }

  save() {
    this.ref.close(this.color);
  }
}
