import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NbDialogRef, NbDialogService, NbToastrService} from '@nebular/theme';
import {environment} from '../../../../environments/environment';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {ApplicationNodeService} from '../../../services/application-node.service';
import {ApplicationNewComponent} from '../../application-node/application-new/application-new.component';
import {ConfirmDialogComponent} from '../../../share/component/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'ngx-application-node-dialog',
  templateUrl: './application-node-dialog.component.html',
  styleUrls: ['./application-node-dialog.component.scss']
})
export class ApplicationNodeDialogComponent implements OnInit {
  data: any;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    margin: 10,
    lazyLoad: true,

    autoWidth: true,
    autoHeight: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    // center: true,
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false,
  }
  env = environment;
  servers: any[] = []
  keywordSever: any;
  baseServerData: any;
  urls: any[] = []


  constructor(private fb: FormBuilder,
              public ref: NbDialogRef<ApplicationNodeDialogComponent>,
              private applicationNodeService: ApplicationNodeService,
              public dialogService: NbDialogService,
              private toastrService: NbToastrService
  ) {
  }

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.applicationNodeService.find(this.data.id).subscribe(res => {
        if (res) {
          this.data = res.body;
          this.data.description = (this.data.description || '').replace('href="' , 'target="_blank" href="');
        }
      })
    }
    this.applicationNodeService.getNodeService(this.data.id).subscribe(res => {
      if (res) {
        this.servers = res.body.servers;
        this.urls = res.body.urls;
        this.baseServerData = res.body.servers
      }
    })
  }

  loadServer() {
    if (!this.keywordSever) {
      this.servers = Object.assign([], this.baseServerData)
    } else {
      this.servers = this.baseServerData.filter(e => {
        if (e.name.indexOf(this.keywordSever) >= 0) {
          return e;
        }
      })
    }
  }
  edit(row: any) {
    const ref = this.dialogService.open(ApplicationNewComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: `Chỉnh sửa ứng dụng ${row.nodeName}`,
        data: row
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        // this.setPage(this.page);
        this.ref.close('success');
      }
    });
  }

  delete(row) {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      autoFocus: true,
      closeOnBackdropClick: false,
      context: {
        message: `Bạn có chắc chắn muốn xóa thông tin ứng dụng '${row.nodeName}' không?`
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.applicationNodeService.delete(row.id).subscribe(
          () => {
            // if (this.page.totalElements - this.page.pageNumber * this.page.size === 1 ) {
            //   this.page.pageNumber = this.page.pageNumber - 1;
            // }
            // this.setPage(this.page);
            this.toastrService.success('Xóa thành công', 'Thông báo', {icon: 'checkmark-outline'});
            this.ref.close('success');
          },
          (error) => {
            this.toastrService.danger(error.error.title, 'Lỗi', {icon: 'alert-triangle-outline'});
          }
        );
      }
    });
  }
}
