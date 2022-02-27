import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserHdfsManagementRoutingModule } from './user-hdfs-management-routing.module';
import { UserHdfsManagementComponent } from './user-hdfs-management.component';


@NgModule({
  declarations: [UserHdfsManagementComponent],
  imports: [
    CommonModule,
    UserHdfsManagementRoutingModule
  ]
})
export class UserHdfsManagementModule { }
