import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-user-management',
  template: `
      <router-outlet></router-outlet>
  `,
})
export class UserManagementComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
