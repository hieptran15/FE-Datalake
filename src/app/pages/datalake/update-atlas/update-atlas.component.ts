import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AtlasService} from '../../../@core/mock/atlas.service';
import {PopupErrorComponent} from '../../popup-error/popup-error.component';
import {NbDialogService} from '@nebular/theme';
import {ShareDataBreadcrumbService} from '../../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-update-atlas',
  templateUrl: './update-atlas.component.html',
  styleUrls: ['./update-atlas.component.scss']
})
export class UpdateAtlasComponent implements OnInit {
  showPassword = false;
  isLoading: boolean = false;
  executeErr = '';
  executeSuc = '';
  executeForm: FormGroup;

  constructor(private fb: FormBuilder,
              private atlasService: AtlasService,
              private shareData: ShareDataBreadcrumbService,
              public dialogService: NbDialogService) {
    this.executeForm = this.fb.group({
        user: [null, [Validators.required]],
        pass: [null, [Validators.required]],
        sql: [null],
      },
    )
  }

  ngOnInit(): void {
    this.sendDataTest();
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Utility',
      titleChild: 'Update atlas',
      urlPage: '/page/update-atlas',
    })
  }

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  execute() {
    this.isLoading = true;
    this.executeSuc = '';
    this.executeErr = '';
    this.atlasService.execute(this.executeForm.value).subscribe(
      res => {
        if (res.body.responseType === 'SUCCESS') {
          this.executeSuc = 'SUCCESS';
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.executeErr = res.body.message;
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
