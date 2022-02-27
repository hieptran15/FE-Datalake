import {NgModule} from '@angular/core';
import {
  NbAccordionModule, NbAlertModule,
  NbButtonModule, NbCalendarModule,
  NbCardModule,
  NbCheckboxModule, NbDatepickerModule, NbFormFieldModule,
  NbIconModule,
  NbInputModule, NbLayoutModule, NbListModule,
  NbMenuModule, NbPopoverModule, NbRadioModule,
  NbSelectModule, NbSidebarModule, NbSpinnerModule, NbTabsetModule, NbToggleModule, NbTooltipModule
} from '@nebular/theme';

import {ThemeModule} from '../@theme/theme.module';
import {PagesComponent} from './pages.component';
import {DashboardModule} from './dashboard/dashboard.module';
import {ECommerceModule} from './e-commerce/e-commerce.module';
import {PagesRoutingModule} from './pages-routing.module';
import {MiscellaneousModule} from './miscellaneous/miscellaneous.module';
import {GojsAngularModule} from 'gojs-angular';
import {GraphPageComponent} from './graph-page/graph-page.component';
import {ApplicationNodeComponent} from './application-node/application-node.component';
import {ApplicationClusterComponent} from './application-cluster/application-cluster.component';
import {ApplicationNewComponent} from './application-node/application-new/application-new.component';
import {ApplicationDetailComponent} from './application-node/application-detail/application-detail.component';
import {ApplicationClustersNewComponent} from './application-cluster/application-clusters-new/application-clusters-new.component';
import {ApplicationComponent} from './application/application.component';
import {LinkComponent} from './link/link.component';
import {LinkNewComponent} from './link/link-new/link-new.component';
import {LinkTableComponent} from './link/link-table/link-table.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ShareModule} from '../share/share.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ColorPickerModule} from 'ngx-color-picker';
import {NodeTypeInputComponent} from './node-type-input/node-type-input.component';
import {NodeTypeInputNewComponent} from './node-type-input/new/node-type-input-new.component';
import {ApplicationClusterDialogComponent} from './graph-page/application-cluster-dialog/application-cluster-dialog.component';
import {ApplicationNodeDialogComponent} from './graph-page/application-node-dialog/application-node-dialog.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {LinkDialogComponent} from './graph-page/link-dialog/link-dialog.component';
import {ApplicationNodeServerComponent} from './application-node/node-server-new/node-server-new.component';
import {ChangePasswordComponent} from '../auth-routing/change-password/change-password.component';
import {RequestPasswordComponent} from '../auth-routing/request-password/request-password.component';
import {RequestPasswordCompleteComponent} from '../auth-routing/request-password-complete/request-password-complete.component';
import {NodeComponent} from './node/node.component';
import {NodeUrlComponent} from './application-node/node-url/node-url.component';
import {HdfsBrowserComponent} from './hdfs-browser/hdfs-browser.component';
import {JobManagementComponent} from './job-management/job-management.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ListFilterPipe} from '../share/pipe/list-filter.pipe';
import {TreeViewModule} from '@progress/kendo-angular-treeview';
import {DropDownsModule} from '@progress/kendo-angular-dropdowns';
import {ConfigMakeFileDbComponent} from './config-make-file-db/config-make-file-db.component';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {TooltipModule} from '@swimlane/ngx-charts';
import {AccessManagementComponent} from './access-management/access-management.component';
import {SendRequireComponent} from './access-management/send-require/send-require.component';
import {TextMaskModule} from 'angular2-text-mask';
import {AddOrEditAppComponent} from './access-management/add-or-edit-app/add-or-edit-app.component';
import {ContextMenuModule} from '@progress/kendo-angular-menu';
import {PopupErrorComponent} from './popup-error/popup-error.component';
import {SmsAlertConfigComponent} from './sms-alert-config/sms-alert-config.component';
import {UpdateAtlasComponent} from './datalake/update-atlas/update-atlas.component';
import {ExportFileComponent} from './datalake/export-file/export-file.component';
import {EncodeToolComponent} from './datalake/encode-tool/encode-tool.component';
import {AlertGroupComponent} from './sms-alert-config/alert-group/alert-group.component';
import {AlertIsdnComponent} from './sms-alert-config/alert-isdn/alert-isdn.component';
import {RoleManagementComponent} from './role-management/role-management.component';
import {ModuleManagementComponent} from './module-management/module-management.component';
import {UploadFileComponent} from './datalake/upload-file/upload-file.component';
import {DataIngestionComponent} from './data-ingestion/data-ingestion.component';
import {TutorialIngestionComponent} from './tutorial-ingestion/tutorial-ingestion.component';
import {FlowsComponent} from './flows/flows.component';
import {RoleManagerComponent} from './role-manager/role-manager.component';
import {CheckboxModule} from 'primeng/checkbox';
import {DialogModule} from 'primeng/dialog';
import {ServerIpTableManageComponent} from './server-ip-table-manage/server-ip-table-manage.component';
import {EditIptableComponent} from './edit-iptable/edit-iptable.component';
import {TableModule} from 'primeng/table';
import {DatatablePipe} from '../share/pipe/datatable.pipe';
import {AccessAuthorizationComponent} from './access-authorization/access-authorization.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {AccessLogComponent} from './access-log/access-log.component';
import {CalendarModule} from 'primeng/calendar';
import {UserThriftComponent} from './user-thrift/user-thrift.component';
import {ThriftManagerComponent} from './thrift-manager/thrift-manager.component';
import {LookupTableComponent} from './lookup-table/lookup-table.component';
import {DbOracleManagerComponent} from './db-oracle-manager/db-oracle-manager.component';
import {DbInfoComponent} from './db-oracle-manager/db-info/db-info.component';
import {DbManagerTableSpaceComponent} from './db-oracle-manager/db-manager-table-space/db-manager-table-space.component';
import {DbManagerUserComponent} from './db-oracle-manager/db-manager-user/db-manager-user.component';
import {ServerInfoComponent} from './server-info/server-info.component';
import {IptableRuleComponent} from './iptable-rule/iptable-rule.component';
import {RpAppComponent} from './rp-app/rp-app.component';
import {DatalakeDashboardComponent} from './datalake-dashboard/datalake-dashboard.component';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {HighchartsChartModule} from 'highcharts-angular';
import {ApplicationManagementComponent} from './application-management/application-management.component';
import {DatalakeDashboardUserComponent} from './datalake-dashboard/datalake-dashboard-user/datalake-dashboard-user.component';
import {DatalakeDashboardAdminComponent} from './datalake-dashboard/datalake-dashboard-admin/datalake-dashboard-admin.component';
import {GroupChartModule} from "./group-chart/group-chart.module";

@NgModule({
    imports: [
        PagesRoutingModule,
        ThemeModule,
        NbMenuModule,
        DashboardModule,
        ECommerceModule,
        MiscellaneousModule,
        GojsAngularModule,
        NbCardModule,
        NbInputModule,
        NbSelectModule,
        NbButtonModule,
        CKEditorModule,
        NbIconModule,
        NgxDatatableModule,
        NbCheckboxModule,
        NgSelectModule,
        NbDatepickerModule,
        NbRadioModule,
        ShareModule,
        FormsModule,
        ReactiveFormsModule,
        ColorPickerModule,
        NbFormFieldModule,
        CarouselModule,
        NbSpinnerModule,
        NbAccordionModule,
        NbTooltipModule,
        NbAlertModule,
        NbListModule,
        NbLayoutModule,
        NbPopoverModule,
        NbSidebarModule,
        TreeViewModule,
        DropDownsModule,
        NgxTrimDirectiveModule,
        TooltipModule,
        TextMaskModule,
        ContextMenuModule,
        NbTabsetModule,
        NbToggleModule,
        CheckboxModule,
        DialogModule,
        TableModule,
        CKEditorModule,
        CKEditorModule,
        CKEditorModule,
        CKEditorModule,
        CKEditorModule,
        NbCalendarModule,
        CalendarModule,
        NgCircleProgressModule.forRoot({}),
        HighchartsChartModule,
        GroupChartModule,
    ],
  declarations: [
    PagesComponent,
    GraphPageComponent,
    ApplicationNodeComponent,
    ApplicationClusterComponent,
    ApplicationNewComponent,
    ApplicationDetailComponent,
    ApplicationClustersNewComponent,
    ApplicationComponent,
    LinkComponent,
    LinkNewComponent,
    LinkTableComponent,
    NodeTypeInputComponent,
    NodeTypeInputNewComponent,
    ApplicationNodeDialogComponent,
    ApplicationClusterDialogComponent,
    LinkDialogComponent,
    ApplicationNodeServerComponent,
    ChangePasswordComponent,
    RequestPasswordComponent,
    RequestPasswordCompleteComponent,
    NodeComponent,
    NodeUrlComponent,
    HdfsBrowserComponent,
    JobManagementComponent,
    ListFilterPipe,
    DatatablePipe,
    ConfigMakeFileDbComponent,
    AccessManagementComponent,
    SendRequireComponent,
    AddOrEditAppComponent,
    PopupErrorComponent,
    SmsAlertConfigComponent,
    UpdateAtlasComponent,
    ExportFileComponent,
    EncodeToolComponent,
    RoleManagementComponent,
    ModuleManagementComponent,
    AlertGroupComponent,
    AlertIsdnComponent,
    UploadFileComponent,
    DataIngestionComponent,
    TutorialIngestionComponent,
    FlowsComponent,
    RoleManagerComponent,
    EditIptableComponent,
    ServerIpTableManageComponent,
    AccessAuthorizationComponent,
    AccessLogComponent,
    AccessAuthorizationComponent,
    UserThriftComponent,
    ThriftManagerComponent,
    LookupTableComponent,
    DbOracleManagerComponent,
    DbInfoComponent,
    DbManagerTableSpaceComponent,
    DbManagerUserComponent,
    ServerInfoComponent,
    IptableRuleComponent,
    RpAppComponent,
    DatalakeDashboardComponent,
    ApplicationManagementComponent,
    DatalakeDashboardUserComponent,
    DatalakeDashboardAdminComponent
  ],
  entryComponents: [
    ApplicationClustersNewComponent,
    ApplicationNewComponent,
    LinkComponent,
    NodeTypeInputComponent,
    ApplicationNodeDialogComponent,
    ApplicationClusterDialogComponent,
    LinkDialogComponent,
    ChangePasswordComponent
  ]
})
export class PagesModule {
}
