import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../@core/login/login.service';
import {Router} from '@angular/router';
import {NbDialogService, NbIconConfig, NbThemeService, NbToastrService} from '@nebular/theme';
import {onlyCharacterValidator} from '../../share/directive/only-characters.directive';
import {TranslateService} from '@ngx-translate/core';
import {SessionStorageService} from 'ngx-webstorage';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('pupupNote') pupupNote: TemplateRef<any>
  loginForm: FormGroup;
  authenticationError = false;
  isLoading: boolean;
  checked: boolean = false;

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              public themeService: NbThemeService,
              public sessionStorage: SessionStorageService,
              private router: Router,
              private translate: TranslateService,
              private toastrService: NbToastrService,
              public dialogService: NbDialogService,
  ) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      account: [null, [Validators.required, Validators.maxLength(20), onlyCharacterValidator(/^[a-zA-Z0-9_]{1,}$/)]],
      password: [null, [Validators.required, Validators.maxLength(20), Validators.minLength(6)]],
      rememberMe: [true],
    });
    this.loginForm.valueChanges.subscribe(value => {
      this.authenticationError = false;
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      document.getElementById('account').focus();
    }, 100);
  }

  b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16))
    }))
  }

  signIn(isSso: boolean) {
    this.isLoading = true;
    const passwordEncode = this.b64EncodeUnicode(this.loginForm.get('password')!.value);
    this.loginService
      .login({
        username: this.loginForm.get('account')!.value,
        password: passwordEncode,
        tokenDevice: 'test_1',
        deviceName: 'device_test1',
        rememberMe: this.loginForm.get('rememberMe')!.value,
        sso: isSso,
        ticket: ''
      })
      .subscribe(
        (res) => {
          console.log(res)
          this.isLoading = false;
          this.authenticationError = false;
          if (res['activated'] === false) {
            this.dialogService.open(this.pupupNote, {closeOnBackdropClick: false})
          } else {
            this.router.navigate(['/page/dashboards']);
          }
          if (res['roleGroup']) {
            localStorage.setItem('roleGroup', res['roleGroup']?.name);
          }
          localStorage.setItem('theme', 'theme-dark');
        },
        (error) => {
          if (error) {
            const iconConfig: NbIconConfig = {icon: 'alert-circle-outline', pack: 'eva'};
            this.toastrService.danger(error.error ? error.error.message : 'Có lỗi hệ thống xảy ra trong quá trình xử lý.', 'Đăng nhập không thành công', iconConfig)
            this.isLoading = false
            this.authenticationError = true
          }
        }
      );
  }

  signInSSO() {
    window.location.href = environment.sso + encodeURIComponent(environment.webportalURL);
  }

  onClose() {
    this.authenticationError = false;
  }

  toggle(checked: boolean) {
    this.loginForm.get('rememberMe').patchValue(checked);
    console.log(this.loginForm.get('rememberMe')!.value)
  }

  forgotPassword() {
    this.router.navigate(['auth/request-password']);
  }
}
