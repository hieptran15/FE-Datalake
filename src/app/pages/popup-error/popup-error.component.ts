import { Component, OnInit } from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'ngx-popup-error',
  templateUrl: './popup-error.component.html',
  styleUrls: ['./popup-error.component.scss']
})
export class PopupErrorComponent implements OnInit {
  error = 'Chưa kết nối được với máy chủ, vui lòng liên hệ với Admin để được hỗ trợ!';
  constructor(public ref: NbDialogRef<PopupErrorComponent>) { }

  ngOnInit(): void {
  }

}
