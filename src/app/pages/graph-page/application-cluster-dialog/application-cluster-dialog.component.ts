import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NbDialogRef, NbDialogService, NbIconLibraries, NbToastrService} from '@nebular/theme';
import {ApplicationClustersNewComponent} from '../../application-cluster/application-clusters-new/application-clusters-new.component';
import {ConfirmDialogComponent} from '../../../share/component/confirm-dialog/confirm-dialog.component';
import {ApplicationClusterService} from '../../../services/application-cluster.service';

// @ts-ignore
@Component({
  selector: 'ngx-application-cluster-dialog',
  templateUrl: './application-cluster-dialog.component.html',
  styleUrls: ['./application-cluster-dialog.component.scss']

})
export class ApplicationClusterDialogComponent implements OnInit {
  data: any;
  applicationCluster: FormGroup = this.fb.group({
    clusterCode: null,
    clusterParent: null,
    clusterId: null,
    description: null,
  });

  constructor(private fb: FormBuilder,
              public ref: NbDialogRef<ApplicationClusterDialogComponent>, public dialogService: NbDialogService, public applicationClusterService: ApplicationClusterService, public toastrService: NbToastrService
  ) {
  }

  ngOnInit(): void {
    // if (this.data) {
    //   this.data.description = (this.data.description || '').replace(/(?:\r\n|\r|\n)/g, '<br>')
    // }
    console.log(this.data);
  }
  edit(row) {
    if (!row.id) return;
    const ref = this.dialogService.open(ApplicationClustersNewComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: (row.parentId ? 'Chỉnh sửa cụm ứng dụng' : 'Chỉnh sửa cụm server') + ` '${row.clusterName}'`,
        data: row
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.ref.close('success');
      }
    });
  }
  delete(row) {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      autoFocus: true,
      closeOnBackdropClick: false,
      context: {
        message: `Bạn có chắc chắn muốn xóa thông tin cụm '${row.clusterName}' không?`
      },
    });
    ref.onClose.subscribe(res => {
      if (res) {
        this.applicationClusterService.delete(row.id).subscribe(
          () => {
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
