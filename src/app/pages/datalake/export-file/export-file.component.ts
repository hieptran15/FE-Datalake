import {Component, OnInit} from '@angular/core';
import {HdfsFileService} from '../../../@core/mock/hdfsFile.service';
import {PopupErrorComponent} from '../../popup-error/popup-error.component';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExportFileModel} from '../../../@core/model/exportFile.model';
import * as fileSaver from 'file-saver';
import {AuthoritiesConstant} from '../../../authorities.constant';
import {ShareDataBreadcrumbService} from '../../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-export-file',
  templateUrl: './export-file.component.html',
  styleUrls: ['./export-file.component.scss']
})
export class ExportFileComponent implements OnInit {
  isLoading: boolean = false;
  isDownload: boolean = true;
  isExport: boolean = true;
  isValidate: boolean = false;
  uploadForm: FormGroup;
  exportFile: ExportFileModel = {};
  file = '';
  pathServer = '';
  filePut: File;
  authorities = AuthoritiesConstant;
  option1?: string;
  option2?: any;

  constructor(private hdfsFileService: HdfsFileService,
              private shareData: ShareDataBreadcrumbService,
              private dialogService: NbDialogService,
              private toastrService: NbToastrService,
              public fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      pathServer: ['', [Validators.required]],
      fileName: ['', [Validators.required]]
    })
  }


  optionsCluster = [
    {value: 'HOT_CLUSTER', label: 'vBIClusterHot'},
    {value: 'ANALYTIC_CLUSTER', label: 'Analytic'},
    {value: 'TAYLAKE_CLUSTER', label: 'Taylake'},
  ]

  optionsFilePath = [
    {value: true, label: 'gz'},
    {value: false, label: 'tar'},
  ]
  isFirstPath?: boolean;
  isFirstValue?: string;

  ngOnInit(): void {
    this.sendDataTest();
    this.resetMode();
    this.isFirstValue = 'HOT_CLUSTER'
    this.isFirstPath = true;
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Utility',
      groupText: 'HDFS Tools',
      titleChild: 'Export/Import HDFS',
      urlPage: '/page/export-file',
    })
  }

  resetMode() {
    this.exportFile = {};
    this.filePut = null;
    this.uploadForm.reset();
    this.isLoading = true;
    this.hdfsFileService.resetMode().subscribe(
      res => {
        if (res.responseType === 'SUCCESS') {
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.message},
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


  checkDownload() {

    if (this.exportFile.fileName && this.exportFile.fileName.includes('/')) {
      this.toastrService.danger(`File name must not contain "/"`, 'Error');
    } else {
      this.isLoading = true;
      this.hdfsFileService.getDataFromServer(this.exportFile).subscribe(
        res => {
          this.isLoading = false;
          if (res.body.responseType === 'SUCCESS') {
            this.file = res.body.results[0];
            this.isDownload = false;
            this.toastrService.success(`Export file success`, 'Success');
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

  }

  /*  download(data: Response) {
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    }*/
  ExportAndDownloadFunction(cluster: any, PathExport: any, FileName: any, render: any) {

    if (cluster === null || cluster === undefined) {
      cluster = 'HOT_CLUSTER';
    }
    if (render === null || render === undefined) {
      render = false;
    }
    this.exportFile.zipFile = render;
    this.exportFile.clusterSelected = cluster.toString();
    console.log('exportfile : ', this.exportFile);
    // debugger; // eslint-disable-line no-debugger
    if (this.exportFile.fileName && this.exportFile.fileName.includes('/')) {
      this.toastrService.danger(`File name must not contain "/"`, 'Error');
    } else {
      this.isLoading = false;
      this.exportFile.checkFike = true;
      this.hdfsFileService.getDataFromServer(this.exportFile).subscribe(
        res => {
          this.isLoading = false;
          if (res.body.responseType === 'SUCCESS') {
            this.toastrService.success(`Export file success`, 'Success');
            this.file = res.body.results[0];
            this.isDownload = false;
            this.downloadFile(this.file);

          } else {
            this.dialogService.open(PopupErrorComponent, {
              context: {error: res.body.message},
              // console.log("cluster:", cluster);
              // console.log('path export ',PathExport);
              // console.log('FileName ',FileName);
              // console.log('render',render);
              closeOnEsc: false,
              closeOnBackdropClick: false

            });
            console.log('bug  export 1:');
          }
          // console.log('data :', res.data);
        }, error => {
          this.isLoading = false;
          this.dialogService.open(PopupErrorComponent, {
            context: {error: error.error.detail},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
          console.log('bug  export :', error);
        }
      )
    }
    // console.log('tai file ? ');
  }

  downloadFile(files) {
    // this.checkDownload();

    return this.hdfsFileService.downloadFile(files).subscribe(
      res => {
        const blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        fileSaver.saveAs(blob, this.file);
        // console.log(this.option1);
        // console.log(this.option2);
        this.toastrService.success(' download file sucess ', 'SUCESS');

      }, error => {
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error.error.detail},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
        // this.toastrService.danger('Thao tác thất bại !', 'Fail');
      }
    )

  }

  onFileChange(e) {
    this.filePut = e.target['files'][0];
    this.uploadForm.get('fileName').patchValue(this.filePut.name);
  }

  putFile(cluster: any) {
    if (cluster === null || cluster === undefined) {
      cluster = 'HOT_CLUSTER';
    }
    this.exportFile.clusterSelected = cluster.toString();
    this.isLoading = true;
    const form = new FormData();
    form.append('cluster', this.exportFile.clusterSelected);
    form.append('pathServer', this.uploadForm.value.pathServer);
    form.append('multipartFile', this.filePut);
    console.log('cluster:', form.getAll('cluster'));
    // console.log("cluster:",form.getAll("pathServer"));
    // console.log("cluster:",form.getAll("multipartFile"));
    this.hdfsFileService.writeFile(form).subscribe(
      res => {
        this.isLoading = false;
        if (res.body.responseType === 'SUCCESS') {
          this.toastrService.success(`import file thành công !`, 'Sucess');
          this.isDownload = false;
          this.uploadForm.reset();
        } else {
          this.dialogService.open(PopupErrorComponent, {
            context: {error: res.body.message},
            closeOnEsc: false,
            closeOnBackdropClick: false
          })
          console.log(res.body);

          // this.toastrService.danger(' Có lỗi xảy ra  !: ', 'ERROR ');
        }
      }, error => {
        this.isLoading = false;
        this.dialogService.open(PopupErrorComponent, {
          context: {error: error.error.detail},
          closeOnEsc: false,
          closeOnBackdropClick: false
        })
        console.log(error.error);
        // this.toastrService.danger(' thao tác thất bại', 'Error');
      }
    );
  }

  // putFile1(Cluster: any)
  // {
  //   console.log('Cluster:',Cluster);
  //   // console.log('PathImport:',PathImport);
  //   // console.log('FileImport ',FileImport);
  //   console.log('form group : ',this.uploadForm);
  // }
}




