import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule, NbDatepickerModule, NbDialogModule, NbFormFieldModule,
  NbIconModule,
  NbInputModule, NbLayoutModule, NbListModule, NbRadioModule,
  NbSelectModule, NbSpinnerModule, NbTabsetModule, NbToastrModule, NbToggleModule, NbTooltipModule
} from '@nebular/theme';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChartsModule} from '../charts/charts.module';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {UserManagementComponent} from './user-management.component';
import {UserRoutingModule} from './user-management.route';
import {UserConfigComponent} from './user-config/user-config.component';
import { UserConfigUpdateComponent } from './user-config-update/user-config-update.component';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {TranslateModule} from '@ngx-translate/core';
import {ConfirmDialogComponent} from '../../share/component/confirm-dialog/confirm-dialog.component';
import {ShareModule} from '../../share/share.module';
import {ThemeModule} from '../../@theme/theme.module';
import {DialogModule} from 'primeng/dialog';
import {ChipsModule} from 'primeng/chips';
import { UserDetailComponent } from './user-config/user-detail/user-detail.component';

@NgModule({
  declarations: [UserManagementComponent, UserConfigComponent, UserConfigUpdateComponent, UserDetailComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbCheckboxModule,
    NbInputModule,
    NbSelectModule,
    NbTabsetModule,
    NbLayoutModule,
    NbListModule,
    NgSelectModule,
    NbToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    ChartsModule,
    Ng2SmartTableModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    NbDialogModule.forChild(),
    NbDatepickerModule,
    NgxTrimDirectiveModule,
    TranslateModule,
    ShareModule,
    NbFormFieldModule,
    NbSpinnerModule,
    ThemeModule,
    DialogModule,
    NbRadioModule,
    ChipsModule,
    NbTooltipModule,
  ],
  exports: [
  ],
  entryComponents: [
    ConfirmDialogComponent,
    UserConfigUpdateComponent
  ]
})
export class UserManagementModule {}
