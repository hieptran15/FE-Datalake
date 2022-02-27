import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../@core/login/login.service';

@Component({
  selector: 'ngx-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private loginService: LoginService,
  ) {
    this.loginService.logout();
  }

  ngOnInit() {
  }

}
