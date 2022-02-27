import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ngx-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  @Input() title?: string = this.translate.instant('success.http.notify');
  @Input() message: string;
  @Input() okTitle?: string = this.translate.instant('flow-customized.label.yes');
  @Input() cancelTitle?: string = this.translate.instant('flow-customized.label.no');
  @Input() hideCancel?;

  constructor(private translate: TranslateService,
              protected ref: NbDialogRef<ConfirmDialogComponent>,
  ) {
  }

  ngOnInit() {
  }

  close() {
    this.ref.close();
  }

  save() {
    this.ref.close('confirm');
  }
}
