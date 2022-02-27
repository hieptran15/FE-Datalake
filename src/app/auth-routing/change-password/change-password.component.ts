import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../@core/login/login.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../services/auth.service';
import {NbDialogRef, NbIconConfig, NbToastrService} from '@nebular/theme';

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  userForm: FormGroup;
  changePassFail = false;
  changePassSuccess = false;
  message: any;
  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private authService: AuthService,
              private translate: TranslateService,
              public ref: NbDialogRef<ChangePasswordComponent>,
              private toastrService: NbToastrService,
              private router: Router) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      currentPassword: [null, Validators.required],
      newPassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: [null, [Validators.required]],
    }, {
      validators: this.passwordMustMatchChange('newPassword', 'confirmPassword')
    });
  }
  changePass() {
    this.authService.changePass(this.userForm.value).subscribe(() => {
        this.message = this.translate.instant('changePass.changePassSuccess');
        this.changePassFail = false;
        this.changePassSuccess = true;
        this.toastrService.success(this.message, 'Thông báo');
        this.userForm.reset();
        this.ref.close();
      } ,
      error => {
        const iconConfig: NbIconConfig = {icon: 'alert-circle-outline', pack: 'eva'};
        this.toastrService.danger(this.translate.instant(error.error.message), ' Thông báo', iconConfig)
        this.changePassFail = true;
        this.changePassSuccess = false;
      })
  }
  onClose() {
    this.changePassFail = false;
  }
  onCloseSuccess() {
    this.changePassSuccess = false;
  }

  passwordMustMatchChange(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (control && matchingControl) {
        if (matchingControl.errors && !matchingControl.errors.passwordMustMatchChange) {
          // return if another validator has already found an error on the matchingControl
          return;
        }
        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({passwordMustMatchChange: true});
        } else {
          matchingControl.setErrors(null);
        }
      }
    }
  }

}
