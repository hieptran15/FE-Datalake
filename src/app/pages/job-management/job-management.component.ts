import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {IJob, Job} from '../../@core/model/job.model';
import {JobService} from '../../@core/mock/job.service';
import * as fileSaver from 'file-saver';
import {NbDialogService, NbPopoverDirective, NbToastrService} from '@nebular/theme';
import {ICluster} from '../../@core/model/cluster.model';
import {AuthoritiesConstant} from '../../authorities.constant';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.scss']
})
export class JobManagementComponent implements OnInit {
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  @ViewChild('fileInput') fileInput: ElementRef;

  searchString: string;
  valueSearch: string;
  isEditing = true;
  isAdding = true;
  isLoading = false;
  isLoadingDetails = false;
  selectedCluster = '';
  jobs: IJob[];
  jobList = [];
  clusters: ICluster[];
  newJob = new Job();
  jobId: any;
  limits = [5, 10, 15, 20];
  limit = 10;
  authorities = AuthoritiesConstant;
  columnsJob = [
    {name: 'STT', prop: 'stt', flexGrow: 0.5},
    {name: 'Job name', prop: 'jobName', flexGrow: 0.8},
    {name: 'Job file', prop: 'fileURL', flexGrow: 1},
    {name: 'Images', prop: 'base64Img', flexGrow: 0.6},
    {name: 'Description', prop: 'description', flexGrow: 0.9},
    {name: 'Action', prop: 'action', flexGrow: 0.7}
  ];
  public Editor = DecoupledEditor

  constructor(
    private jobService: JobService,
    private toastrService: NbToastrService,
    private shareData: ShareDataBreadcrumbService,
    public dialogService: NbDialogService,
  ) {
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  ngOnInit(): void {
    this.sendDataTest();
    this.getJobs();
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Utility',
      groupText: 'ETL Tools',
      titleChild: 'ETL job lib',
      urlPage: '/page/job-management',
    })
  }

  getJobs() {
    this.isLoading = true;
    this.jobService.getJobs().subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.isLoading = false;
        this.jobList = res.body.results;
        this.jobs = [...this.jobList];
        if (this.jobs.length > 0) {
          this.getJobDetail(this.jobs[0]['jobId']);
        } else {
          this.getAssetImage();
        }
      }
    });
  }

  getJobDetail(id: any) {
    this.isLoadingDetails = true;
    this.isAdding = false;
    this.jobService.getJobDetail(id).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.newJob = res.body.results[0];
        this.newJob.description = this.newJob.description === 'undefined' ? '' : this.newJob.description;
        this.isEditing = false;
        this.isLoadingDetails = false;
      } else {
        this.isLoading = false;
        this.isLoadingDetails = false;
      }
    }, (error) => {
      this.isLoading = false;
      this.isLoadingDetails = false;
    });
  }

  addOrEdit(ref) {
    this.isEditing ? this.dialogService.open(ref, {context: 'save'}) : this.isEditing = true
  }

  addNew() {
    this.isLoading = false;
    this.isEditing = true;
    this.isAdding = true;
    // this.fileInput.nativeElement.value = '';
    this.newJob = new Job();
    this.getAssetImage();
  }

  getAssetImage() {
    this.jobService.getAssetImage().subscribe(res => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.newJob.base64Img = reader.result.toString();
      }
      reader.readAsDataURL(res);
    });
  }

  save(ref, action) {
    this.isLoading = true;
    ref.close();
    if (action === 'add') {
      this.jobService.create(this.newJob).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.newJob = res.body.results;
          this.getJobs();
          this.isAdding = false;
          this.toastrService.show('Action successfully', 'Notification', {status: 'success'});
        } else if (res.body.message === '1') {
          this.toastrService.show('Job name is existed in system', 'Notification', {status: 'danger'});
        } else if (res.body.message === '2') {
          this.toastrService.show('File is existed in system', 'Notification', {status: 'danger'});
        } else if (res.body.message === '3') {
          this.toastrService.show('Invalid file format', 'Notification', {status: 'danger'});
        } else if (res.body.message === '4') {
          this.toastrService.show('Invalid image format', 'Notification', {status: 'danger'});
        } else {
          this.toastrService.show('Action failed', 'Notification', {status: 'danger'});
        }
        this.isLoading = false;
      }, error => {
        this.toastrService.show(error.error.message, 'Notification', {status: 'danger'});
        this.isLoading = false;
      });
    } else {
      if (!this.newJob.base64File) {
        this.newJob.base64File = '';
      }
      this.jobService.update(this.newJob).subscribe(res => {
        if (res.body.responseType === 'SUCCESS') {
          this.getJobs();
          this.newJob = res.body.results[0];
          this.isEditing = false;
          this.toastrService.show('Action successfully', 'Notification', {status: 'success'});
        } else if (res.body.message === '1') {
          this.toastrService.show('Job name is existed in system', 'Notification', {status: 'danger'});
        } else if (res.body.message === '2') {
          this.toastrService.show('File is existed in system', 'Notification', {status: 'danger'});
        } else if (res.body.message === '3') {
          this.toastrService.show('Invalid file format', 'Notification', {status: 'danger'});
        } else if (res.body.message === '4') {
          this.toastrService.show('Invalid image format', 'Notification', {status: 'danger'});
        } else {
          this.toastrService.show('Action failed', 'Notification', {status: 'danger'});
        }
        this.isLoading = false;
      }, error => {
        this.toastrService.show(error.error.message, 'Notification', {status: 'danger'});
        this.isLoading = false;
      });
    }
  }

  delete(ref?, jobId?: number) {
    this.isLoading = true;
    this.jobService.delete(jobId ? jobId : this.newJob.jobId).subscribe(res => {
      if (res.body.responseType === 'SUCCESS') {
        this.getJobs();
        this.newJob = new Job();
        ref.close();
        this.toastrService.show('Action successfully', 'Notification', {status: 'success'});
      } else {
        this.toastrService.show('Action failed', 'Notification', {status: 'danger'});
      }
      this.isLoading = false;
    }, error => {
      this.toastrService.show(error.error.message, 'Notification', {status: 'danger'});
    });
  }

  download(row): any {
    this.isLoading = true;
    return this.jobService.download(row?.fileURL).subscribe(res => {
      const blob: any = new Blob([res.body], {type: 'text/json; charset=utf-8'});
      fileSaver.saveAs(blob, row?.fileURL);
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
    });
  }

  preview(files) {
    const validateImg = files[0].name;
    if (validateImg.endsWith('.jpg') || validateImg.endsWith('.jpeg') || validateImg.endsWith('.png') || validateImg.endsWith('.gif')) {
      if (files.length === 0) return;

      const mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) return;

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.newJob.base64Img = reader.result.toString();
      }

    } else {
      this.toastrService.show('Invalid image format', 'Notification', {status: 'danger'});
      return;
    }
  }

  onFileChange(event: Event) {
    let file;
    file = event.target['files'][0];
    this.newJob.fileURL = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.newJob.base64File = reader.result.toString();
    };
  }

  filterJob() {
    if (this.valueSearch !== '') {
      this.jobs = this.jobList.filter(v => v.jobName.toLowerCase().indexOf(this.valueSearch.toLowerCase().trim()) !== -1)
    } else {
      this.jobs = [...this.jobList];
    }
  }

  showActions(index: number) {
    Array.from(document.getElementsByClassName('actions')).forEach(element => {
      element.classList.remove('show-actions')
    });
    Array.from(document.getElementsByClassName('actions'))[index].classList.add('show-actions');
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    if (Array.from(event.target.classList).indexOf('actions') === -1) {
      Array.from(document.getElementsByClassName('actions')).forEach(element => {
        element.classList.remove('show-actions')
      });
    }
  }
}
