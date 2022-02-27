import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {UploadFileService} from '../../../@core/mock/uploadFile.service';
import {PopupErrorComponent} from '../../popup-error/popup-error.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as fileSaver from 'file-saver';
import {AuthoritiesConstant} from '../../../authorities.constant';
import {ShareDataBreadcrumbService} from '../../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  @ViewChild('serverEmpty') serverEmpty: TemplateRef<any>
  isLoading: boolean = false;
  isCheck = 'download';
  uploadForm: FormGroup;
  downloadForm: FormGroup;
  servers = [];
  pathFolders = [];
  pathFolderDownload = [];
  fileNames = [];
  columns = [{name: 'Log', prop: 'log', flex: 1}];
  rows = [];
  log = '';
  checkHierarchyString = '';
  authoritiesConstant = AuthoritiesConstant;
  backupValue = true

  constructor(
    public dialogService: NbDialogService,
    public uploadFileService: UploadFileService,
    private shareData: ShareDataBreadcrumbService,
    public toastrService: NbToastrService,
    public fb: FormBuilder
  ) {
    this.uploadForm = this.fb.group({
      listServer: [null, [Validators.required]],
      file: [null, [Validators.required]],
      fileName: [null, [Validators.required]],
      path: [null, [Validators.required]],
      backUp: [true],
      islog: [false],
    })
    this.downloadForm = this.fb.group({
      folderDownload: [null, [Validators.required]],
      serverDownload: [null, [Validators.required]],
      fileName: [null, [Validators.required]],
      pathAccept: [null],
      pathFolder: [null]
    })
  }

  ngOnInit(): void {
    this.sendDataTest();
    this.getListServer();
    // this.checkHierarchy();
    this.getLog(false);
    this.cleanFile();
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Utility',
      titleChild: 'Download/Upload file',
      urlPage: '/page/upload-file',
    })
  }

  onFileChange(e) {
    this.uploadForm.get('fileName').patchValue(e.target['files'][0].name);
    this.uploadForm.get('file').patchValue(e.target['files'][0]);
  }

  getListServer() {
    this.isLoading = true;
    this.uploadFileService.getListServer().subscribe(res => {
        this.isLoading = false;
        if (res.body.responseType === 'SUCCESS') {
          if (res.body.results.length !== 0) {
            if (this.isCheck === 'download') {
              this.downloadForm.get('serverDownload').patchValue(res.body.results[0]);
              this.getPathFolder(res.body.results[0])
            } else {
              this.uploadForm.get('listServer').patchValue([res.body.results[0]]);
              this.getPathFolder([res.body.results[0]])
            }
          } else {
            this.dialogService.open(this.serverEmpty, {closeOnBackdropClick: false})
          }
          this.servers = res.body.results;
        } else {
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

  // String pathFolder;
  // String fileName;
  // boolean zipFile;
  // String clusterSelected;
  // boolean checkFike;

  getPathFolder(e) {
    this.isLoading = true;
    if (typeof e === 'string') {
      if (!e) {
        this.pathFolderDownload = []
        this.isLoading = false;
        this.downloadForm.get('pathAccept').patchValue([])
        this.downloadForm.get('pathFolder').patchValue([])
      }
      this.pathFolderDownload = []
      this.uploadFileService.getPathFolders(e).subscribe(res => {
        this.isLoading = false;
        if (res.body.responseType === 'SUCCESS') {
          this.pathFolderDownload = res.body.results;
          this.downloadForm.get('pathAccept').patchValue(res.body.results[0])
          this.getFileName();
        } else {
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
      })
    } else {
      this.pathFolders = []
      if (e.length > 0) {
        e.forEach(server => {
            this.uploadFileService.getPathFolders(server).subscribe(res => {
              this.isLoading = false;
              if (res.body.responseType === 'SUCCESS') {
                this.pathFolders = [...this.pathFolders, ...res.body.results];
                this.uploadForm.get('path').patchValue(this.pathFolders[0])
              } else {
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
            })
          }
        )
      } else {
        this.isLoading = false;
      }
    }
  }

  uploadFile() {
    this.isLoading = true;
    const form = new FormData();
    form.append('listServer', this.uploadForm.value.listServer);
    form.append('file', this.uploadForm.value.file);
    form.append('path', this.uploadForm.value.path);
    // @ts-ignore
    form.append('backUp', this.backupValue);
    this.uploadFileService.uploadFile(form).subscribe(res => {
        this.isLoading = false;
        if (res.body.responseType === 'SUCCESS') {
          this.uploadForm.get('backUp').patchValue(true);
          this.getLog(false, true);
          this.uploadForm.get('islog').patchValue(false)
          this.uploadForm.reset();
          this.toastrService.success('Upload file success', 'Notify')
        } else {
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

  getLog(islog?: boolean, logFalse?) {
    if (logFalse) this.uploadForm.get('islog').patchValue(false);
    this.uploadFileService.getLog(islog).subscribe(
      res => {
        this.isLoading = false;
        if (res.body.responseType === 'SUCCESS') {
          this.rows = res.body.results.map(result => {
            return {log: result}
          });
        } else {
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
      })
  }

  reset() {
    this.rows = [];
    this.cleanFile();
  }

  cleanFile() {
    this.uploadFileService.reset().subscribe(
      res => {
        this.isLoading = false;
        if (res.body.responseType === 'SUCCESS') {
          this.uploadForm.reset();
          this.uploadForm.get('backUp').patchValue(true);
        } else {
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
      })
  }

  checkHierarchy() {
    this.uploadFileService.checkHierarchy().subscribe(
      res => {
        this.isLoading = false;
        if (res.body.responseType === 'SUCCESS') {
          this.checkHierarchyString = res.body.results[0];
        } else {
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
      })
  }

  getFileName(isPath?) {
    this.isLoading = true;
    const form = new FormData();
    form.append('serverDownload', this.downloadForm.value.serverDownload)
    if (this.checkHierarchyString === 'ROLE' && isPath) {
      this.fileNames = []
      form.append('folderDownload', this.downloadForm.value.pathFolder)
      this.downloadForm.get('fileName').patchValue(null)
    } else {
      this.fileNames = []
      this.downloadForm.get('fileName').patchValue(null)
      this.downloadForm.get('pathFolder').patchValue(this.downloadForm.value.pathAccept)
      form.append('folderDownload', this.downloadForm.value.pathAccept)
    }
    this.uploadFileService.getFileName(form).subscribe(
      res => {
        this.isLoading = false;
        if (res.body.responseType === 'SUCCESS') {
          this.fileNames = res.body.results;
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
      })
  }

  checkFormDownload() {
    if (this.checkHierarchyString === 'ROLE') {
      this.downloadForm = this.fb.group({
        folderDownload: [null],
        serverDownload: [null, [Validators.required]],
        fileName: [null, [Validators.required]],
        pathAccept: [null],
        pathFolder: [null, [Validators.required]]
      })
    } else {
      this.downloadForm = this.fb.group({
        folderDownload: [null],
        serverDownload: [null, [Validators.required]],
        fileName: [null, [Validators.required]],
        pathAccept: [null, [Validators.required]],
        pathFolder: [null]
      })
    }
  }

  downloadFile() {
    const form = new FormData();
    form.append('serverDownload', this.downloadForm.value.serverDownload)
    form.append('fileName', this.downloadForm.value.fileName)
    if (this.checkHierarchyString === 'ROLE') {
      form.append('folderDownload', this.downloadForm.value.pathFolder)
    } else {
      form.append('folderDownload', this.downloadForm.value.pathAccept)
    }
    this.uploadFileService.downloadFile(form).subscribe(
      res => {
        console.log(res)
        const blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        fileSaver.saveAs(blob, this.downloadForm.value.fileName);
      }, error => {
        this.isLoading = false;
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error.error.detail},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
      })
  }

  checkLog(e) {
    console.log(e)
    this.getLog(e)
  }

  checkRadio(key: string) {
    this.isCheck = key;
    this.getListServer();
    this.getLog(true);
  }
}
