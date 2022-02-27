import {AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {WebSocketUtil} from '../../../utils/web-socket-util';

@Component({
  selector: 'ngx-confirm-dialog',
  templateUrl: './viewlog-dialog.component.html',
  styleUrls: ['./viewlog-dialog.component.scss']
})
export class ViewLogDialogComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContent') private myScrollContainer: ElementRef;
  @Input() title?: string = 'View Log';
  @Input() data: string;
  @Input() closeTitle?: string = 'Close';
  @Input() hideCancel?;
  textCode = '';
  logData: any = {message: ''};
  isLoading: boolean = false;
  logWebSocket: WebSocketUtil;
  intervalCall;

  constructor(protected ref: NbDialogRef<ViewLogDialogComponent>) {
    this.logWebSocket = new WebSocketUtil();
  }

  ngOnInit() {
    this.isLoading = true;
    this.logWebSocket.connect();
    this.intervalCall = setInterval(() => {
      this.logWebSocket.send(this.data);
      console.log(this.logData?.message);
      this.textCode = this.logData?.message;
      this.isLoading = false;
    }, 2000);
    this.logWebSocket.connectStatus.subscribe(status => {
      if (status) {
        this.logWebSocket.subscribeTopic(this.logData);
      }
    });
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  close() {
    clearInterval(this.intervalCall);
    this.logWebSocket.disconnect();
    this.ref.close();
  }

  save() {
    this.ref.close('confirm');
  }

  scrollToBottom(): void {
    this.myScrollContainer?.nativeElement.scroll({
      top: this.myScrollContainer?.nativeElement.scrollHeight,
      left: 0
    });
  }
}
