import {Component, OnInit} from '@angular/core';
import {EncodeToolService} from '../../../@core/mock/encode-tool.service';
import {PopupErrorComponent} from '../../popup-error/popup-error.component';
import {NbDialogService} from '@nebular/theme';
import {AuthoritiesConstant} from '../../../authorities.constant';
import {ShareDataBreadcrumbService} from '../../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-encode-tool',
  templateUrl: './encode-tool.component.html',
  styleUrls: ['./encode-tool.component.scss']
})
export class EncodeToolComponent implements OnInit {
  isLoading: boolean = false;
  isAuth: boolean = false;
  inputEncode = '';
  outputEncode = '';
  inEncryption = '';
  outEncryption = '';
  authorities = AuthoritiesConstant;

  constructor(private encodeToolService: EncodeToolService,
              private shareData: ShareDataBreadcrumbService,
              public dialogService: NbDialogService) {
  }

  ngOnInit(): void {
    this.sendDataTest();
    // this.checkAuth();
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Utility',
      titleChild: 'Encrypt tools',
      urlPage: '/page/encode-tool',
    })
  }

  encodeTool() {
    this.isLoading = true;
    if (!this.inputEncode) {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: 'Input không được để trống'},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
      this.isLoading = false;
      return;
    }
    this.encodeToolService.encodeTool(this.inputEncode).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.outputEncode = res.body.results[0];
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.body.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
        }
      }, error => {
        this.isLoading = false;
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error.error.detail},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    )
  }

  decodeTool() {
    this.isLoading = true;
    if (!this.inputEncode) {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: 'Input không được để trống'},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
      this.isLoading = false;
      return;
    }
    this.encodeToolService.decodeTool(this.inputEncode).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.outputEncode = res.body.results[0];
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.body.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
        }
      }, error => {
        this.isLoading = false;
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error.error.detail},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    )
  }

  encryptSensitiveData() {
    this.isLoading = true;
    if (!this.inEncryption) {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: 'Input không được để trống'},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
      this.isLoading = false;
      return;
    }
    this.encodeToolService.encryptSensitiveData(this.inEncryption).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.outEncryption = res.body.results[0];
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.body.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
        }
      }, error => {
        this.isLoading = false;
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error.error.detail},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    )
  }

  decryptSensitiveData() {
    this.isLoading = true;
    if (!this.inEncryption) {
      this.dialogService.open(PopupErrorComponent, {
        context: {error: 'Input không được để trống'},
        closeOnEsc: false,
        closeOnBackdropClick: false
      })
      this.isLoading = false;
      return;
    }
    this.encodeToolService.decryptSensitiveData(this.inEncryption).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.outEncryption = res.body.results[0];
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.body.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
        }
      }, error => {
        this.isLoading = false;
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error.error.detail},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    )
  }

  checkAuth() {
    this.isLoading = true;
    this.encodeToolService.checkAuth().subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          res.body.results[0] === 'ADMIN' ? this.isAuth = true : this.isAuth = false;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.body.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
        }
      }, error => {
        this.isLoading = false;
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error.error.detail},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      }
    )
  }
}
