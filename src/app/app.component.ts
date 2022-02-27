/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, OnInit} from '@angular/core';
import {NgSelectConfig} from '@ng-select/ng-select';
import {LanguageService} from './@core/mock/language.service';
import {NbIconConfig, NbToastrService} from '@nebular/theme';
import {LoginService} from './@core/login/login.service';


@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(
    // analytics: AnalyticsService,
    // private seoService: SeoService,
    private languageService: LanguageService,
    private ngSelectConfig: NgSelectConfig,
    private loginService: LoginService, private toastrService: NbToastrService) {
  }

  ngOnInit(): void {
    const ticket = window.location.search.split('ticket=')[1];
    console.log('ticket', ticket);
    if (ticket) {
      localStorage.setItem('ticket', ticket);
      this.loginService.loginSSO({
        ticket: ticket
      }).subscribe(res => {
        localStorage.setItem('theme', 'theme-dark');
      }, error => {
        if (error) {
          const iconConfig: NbIconConfig = {icon: 'alert-circle-outline', pack: 'eva'};
          this.toastrService.danger(error.error ? error.error.message : 'Có lỗi hệ thống xảy ra trong quá trình xử lý.', 'Đăng nhập không thành công', iconConfig)
        }
      })
    }
    // this.analytics.trackPageViews();
    // this.seoService.trackCanonicalChanges();
    this.languageService.setInitState();
    this.ngSelectConfig.notFoundText = 'Không có kết quả';
    this.ngSelectConfig.loadingText = 'Đang tìm';
    this.ngSelectConfig.clearAllText = 'Xóa';
    this.ngSelectConfig.addTagText = 'Thêm tag';
    this.ngSelectConfig.appendTo = 'body';
  }
}
