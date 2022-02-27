import {Component, OnChanges} from '@angular/core';
import {MENU_ITEMS} from './pages-menu';
import {AccountService} from '../@core/auth/account.service';
import {Router} from '@angular/router';
import {LoginService} from '../@core/login/login.service';
import {NbIconConfig, NbToastrService} from '@nebular/theme';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnChanges {
  menu = MENU_ITEMS;
  statusMode: any;

  constructor(private accountService: AccountService, public router: Router, private loginService: LoginService, private toastrService: NbToastrService) {
    this.accountService.identity().subscribe(res => {
      console.log(res);
      // if (res?.login === 'admin') {
      //   setTimeout(() => {
      //     this.router.navigate(['auth/logout']);
      //   }, 10000);
      // }
    }, (error => {
      console.log('error', error)
    }));
    // const ticket = window.location.search.split('ticket=')[1];
    // console.log('ticket', ticket);
    // if (ticket) {
    //   this.loginService.login({
    //     username: '',
    //     password: '',
    //     tokenDevice: 'test_1',
    //     deviceName: 'device_test1',
    //     rememberMe: false,
    //     sso: true,
    //     ticket: ticket
    //   }).subscribe(res => {
    //     localStorage.setItem('theme', 'theme-dark');
    //   }, error => {
    //     if (error) {
    //       const iconConfig: NbIconConfig = {icon: 'alert-circle-outline', pack: 'eva'};
    //       this.toastrService.danger(error.error ? error.error.message : 'Có lỗi hệ thống xảy ra trong quá trình xử lý.', 'Đăng nhập không thành công', iconConfig)
    //     }
    //   })
    // }
  }

  ngOnChanges() {

  }
}
