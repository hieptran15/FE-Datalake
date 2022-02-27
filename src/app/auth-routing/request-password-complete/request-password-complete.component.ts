import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import {AuthService} from '../../shared/services/auth.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ngx-request-password-complete',
  templateUrl: './request-password-complete.component.html',
  styleUrls: ['./request-password-complete.component.scss']
})
export class RequestPasswordCompleteComponent implements OnInit {

  token: any;
  changePassFail = false;
  changePassSuccess = false;
  message: any;
  userForm: FormGroup = this.fb.group({
    key: [null, Validators.required],
    newPassword: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    confirmPassword: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]]
  }, {
    validators: this.passwordMustMatchChange('newPassword', 'confirmPassword')
  });
  constructor(private route: ActivatedRoute,
              private router: Router,
              // private authService: AuthService,
              private translate: TranslateService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
    this.userForm.get('key').patchValue(this.token);
  }

  onClose() {
    this.changePassFail = false;
  }
  onCloseSuccess() {
    this.changePassSuccess = false;
  }

  changePass() {
    // this.authService.requestResetPasswordComplete(this.userForm.value).subscribe(() => {
    //     this.message = this.translate.instant('changePass.changePassSuccess');
    //     this.changePassFail = false;
    //     this.changePassSuccess = true;
    //     this.userForm.reset();
    //   } ,
    //   error => {
    //     this.message = error.error.message;
    //     this.changePassFail = true;
    //     this.changePassSuccess = false;
    //   })
  }

  backToLogin() {
    this.router.navigate(['auth/login']);
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
