import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PagesComponent} from './pages.component';
import {NotFoundComponent} from './miscellaneous/not-found/not-found.component';
import {GraphPageComponent} from './graph-page/graph-page.component';
import {ApplicationComponent} from './application/application.component';
import {LinkComponent} from './link/link.component';
import {NodeTypeInputComponent} from './node-type-input/node-type-input.component';
import {NodeComponent} from './node/node.component';
import {AccountResolverService} from '../@core/auth/resolve-route';
import {NotPermissionComponent} from './miscellaneous/not-permission/not-permission.component';
import {HdfsBrowserComponent} from './hdfs-browser/hdfs-browser.component';
import {JobManagementComponent} from './job-management/job-management.component';
import {ConfigMakeFileDbComponent} from './config-make-file-db/config-make-file-db.component';
import {AccessManagementComponent} from './access-management/access-management.component';
import {SmsAlertConfigComponent} from './sms-alert-config/sms-alert-config.component';
import {UpdateAtlasComponent} from './datalake/update-atlas/update-atlas.component';
import {ExportFileComponent} from './datalake/export-file/export-file.component';
import {EncodeToolComponent} from './datalake/encode-tool/encode-tool.component';
import {RoleManagementComponent} from './role-management/role-management.component';
import {ModuleManagementComponent} from './module-management/module-management.component';
import {UploadFileComponent} from './datalake/upload-file/upload-file.component';
import {TutorialIngestionComponent} from './tutorial-ingestion/tutorial-ingestion.component';
import {FlowsComponent} from './flows/flows.component';
import {ConnectionManagementComponent} from './data-ingestion/connection-management/connection-management.component';
import {RoleManagerComponent} from './role-manager/role-manager.component';
import {EditIptableComponent} from './edit-iptable/edit-iptable.component';
import {ServerIpTableManageComponent} from './server-ip-table-manage/server-ip-table-manage.component';
import {AccessAuthorizationComponent} from './access-authorization/access-authorization.component';
import {AccessLogComponent} from './access-log/access-log.component';
import {UserThriftComponent} from './user-thrift/user-thrift.component';
import {ThriftManagerComponent} from './thrift-manager/thrift-manager.component';
import {LookupTableComponent} from './lookup-table/lookup-table.component';
import {DbOracleManagerComponent} from './db-oracle-manager/db-oracle-manager.component';
import {UserRouteAccessService} from '../@core/auth/user-route-access-service';
import {AuthoritiesConstant} from '../authorities.constant';
import {IptableRuleComponent} from './iptable-rule/iptable-rule.component';
import {RpAppComponent} from './rp-app/rp-app.component';
import {DatalakeDashboardComponent} from './datalake-dashboard/datalake-dashboard.component';
import {ApplicationManagementComponent} from './application-management/application-management.component';
import {UserDetailComponent} from './user-management/user-config/user-detail/user-detail.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'tutorial-ingestion',
      component: TutorialIngestionComponent,
    },
    {
      path: 'upload-file',
      component: UploadFileComponent,
      data: {
        authorities: [
          AuthoritiesConstant.UPLOAD_FILE.UPLOAD_FILE_WRITE,
          AuthoritiesConstant.UPLOAD_FILE.UPLOAD_FILE_READ,
          AuthoritiesConstant.UPLOAD_FILE.UPLOAD_FILE_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    {
      path: 'dashboards',
      component: DatalakeDashboardComponent,
      data: {
        authorities: [
          AuthoritiesConstant.DATALAKE_DASHBOARD.DATALAKE_DASHBOARD_WRITE,
          AuthoritiesConstant.DATALAKE_DASHBOARD.DATALAKE_DASHBOARD_READ,
          AuthoritiesConstant.DATALAKE_DASHBOARD.DATALAKE_DASHBOARD_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    {
      path: 'application-management',
      component: ApplicationManagementComponent,
      data: {
        authorities: [
          AuthoritiesConstant.DATALAKE_DASHBOARD.DATALAKE_DASHBOARD_WRITE,
          AuthoritiesConstant.DATALAKE_DASHBOARD.DATALAKE_DASHBOARD_READ,
          AuthoritiesConstant.DATALAKE_DASHBOARD.DATALAKE_DASHBOARD_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    {
      path: 'encode-tool',
      component: EncodeToolComponent,
      data: {
        authorities: [
          AuthoritiesConstant.ENCODE_TOOL.ENCODE_TOOL_WRITE,
          AuthoritiesConstant.ENCODE_TOOL.ENCODE_TOOL_READ,
          AuthoritiesConstant.ENCODE_TOOL.ENCODE_TOOL_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    {
      path: 'export-file',
      component: ExportFileComponent,
      data: {
        authorities: [
          AuthoritiesConstant.EXPORT_FILE.EXPORT_FILE_WRITE,
          AuthoritiesConstant.EXPORT_FILE.EXPORT_FILE_READ,
          AuthoritiesConstant.EXPORT_FILE.EXPORT_FILE_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    // {
    //   path: 'update-atlas',
    //   component: UpdateAtlasComponent,
    //   data: {
    //     authorities: [
    //       AuthoritiesConstant.ATLAS_UPDATE.ATLAS_UPDATE_WRITE,
    //       AuthoritiesConstant.ATLAS_UPDATE.ATLAS_UPDATE_READ,
    //       AuthoritiesConstant.ATLAS_UPDATE.ATLAS_UPDATE_EXECUTE
    //     ]
    //   },
    //   canActivate: [UserRouteAccessService]
    // },
    {
      path: 'sms-alert-config',
      component: SmsAlertConfigComponent,
      data: {
        authorities: [
          AuthoritiesConstant.SMS_ALERT_CONFIG.SMS_ALERT_CONFIG_WRITE,
          AuthoritiesConstant.SMS_ALERT_CONFIG.SMS_ALERT_CONFIG_READ,
          AuthoritiesConstant.SMS_ALERT_CONFIG.SMS_ALERT_CONFIG_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    {
      path: 'config-makeFile-db',
      component: ConfigMakeFileDbComponent,
      data: {
        authorities: [
          AuthoritiesConstant.DB_MAKE_FILE_CONFIG.DB_MAKE_FILE_CONFIG_WRITE,
          AuthoritiesConstant.DB_MAKE_FILE_CONFIG.DB_MAKE_FILE_CONFIG_READ,
          AuthoritiesConstant.DB_MAKE_FILE_CONFIG.DB_MAKE_FILE_CONFIG_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    // {
    //   path: 'dashboard',
    //   component: GraphPageComponent,
    //   data: {
    //     authorities: [
    //       AuthoritiesConstant.DASHBOARD.DASHBOARD_WRITE,
    //       AuthoritiesConstant.DASHBOARD.DASHBOARD_READ,
    //       AuthoritiesConstant.DASHBOARD.DASHBOARD_EXECUTE
    //     ]
    //   },
    //   canActivate: [UserRouteAccessService]
    // },
    // {
    //   path: 'edit-iptable',
    //   component: EditIptableComponent,
    //   data: {
    //     authorities: [
    //       AuthoritiesConstant.EDIT_IP_TABLE.EDIT_IP_TABLE_WRITE,
    //       AuthoritiesConstant.EDIT_IP_TABLE.EDIT_IP_TABLE_READ,
    //       AuthoritiesConstant.EDIT_IP_TABLE.EDIT_IP_TABLE_EXECUTE
    //     ]
    //   },
    //   canActivate: [UserRouteAccessService]
    // },
    {
      path: 'server-ip-table-manage',
      component: ServerIpTableManageComponent,
      data: {
        authorities: [
          AuthoritiesConstant.SERVER_IP_MANAGER.SERVER_IP_MANAGER_WRITE,
          AuthoritiesConstant.SERVER_IP_MANAGER.SERVER_IP_MANAGER_READ,
          AuthoritiesConstant.SERVER_IP_MANAGER.SERVER_IP_MANAGER_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    {
      path: 'hdfs-browser',
      component: HdfsBrowserComponent,
      data: {
        authorities: [
          AuthoritiesConstant.HDFS_BROWSER.HDFS_BROWSER_WRITE,
          AuthoritiesConstant.HDFS_BROWSER.HDFS_BROWSER_READ,
          AuthoritiesConstant.HDFS_BROWSER.HDFS_BROWSER_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    {
      path: 'job-management',
      component: JobManagementComponent,
      data: {
        authorities: [
          AuthoritiesConstant.JOB_MANAGEMENT.JOB_MANAGEMENT_WRITE,
          AuthoritiesConstant.JOB_MANAGEMENT.JOB_MANAGEMENT_READ,
          AuthoritiesConstant.JOB_MANAGEMENT.JOB_MANAGEMENT_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    {
      path: 'application',
      // data: {role: [AuthoritiesConstant.ROLE_ADMIN]},
      // resolve: {data: AccountResolverService},
      component: ApplicationComponent,
    },
    {
      path: 'node',
      component: NodeComponent,
      // data: {role: [AuthoritiesConstant.ROLE_ADMIN]},
      // resolve: {data: AccountResolverService},
    },
    {
      path: 'link',
      // data: {role: [AuthoritiesConstant.ROLE_ADMIN]},
      // resolve: {data: AccountResolverService},
      component: LinkComponent,
    },
    {
      path: 'node-type-input',
      // // data: {role: [AuthoritiesConstant.ROLE_ADMIN]},
      resolve: {data: AccountResolverService},
      component: NodeTypeInputComponent,
    },
    {
      path: 'role-manager',
      // // data: {role: [AuthoritiesConstant.ROLE_ADMIN]},
      // resolve: {data: AccountResolverService},
      component: RoleManagerComponent,
      data: {
        authorities: [
          AuthoritiesConstant.ROLE_MANAGER.ROLE_MANAGER_WRITE,
          AuthoritiesConstant.ROLE_MANAGER.ROLE_MANAGER_READ,
          AuthoritiesConstant.ROLE_MANAGER.ROLE_MANAGER_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    {
      path: 'user-management',
      data: {
        authorities: [
          AuthoritiesConstant.USER_MANAGER.USER_MANAGER_WRITE,
          AuthoritiesConstant.USER_MANAGER.USER_MANAGER_READ,
          AuthoritiesConstant.USER_MANAGER.USER_MANAGER_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService],
      loadChildren: () => import('./user-management/user-management.module')
        .then(m => m.UserManagementModule)
    },
    {
      path: 'access-management',
      // data: {role: [AuthoritiesConstant.ROLE_ADMIN]},
      // resolve: {data: AccountResolverService},
      component: AccessManagementComponent,
      data: {
        authorities: [
          AuthoritiesConstant.LB_CONNECTION.LB_CONNECTION_WRITE,
          AuthoritiesConstant.LB_CONNECTION.LB_CONNECTION_READ,
          AuthoritiesConstant.LB_CONNECTION.LB_CONNECTION_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    {
      path: 'rp-app',
      component: RpAppComponent,
      data: {
        authorities: [
          AuthoritiesConstant.RP_APP.RP_APP_WRITE,
          AuthoritiesConstant.RP_APP.RP_APP_READ,
          AuthoritiesConstant.RP_APP.RP_APP_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    {
      path: 'iptable-rule',
      // data: {role: [AuthoritiesConstant.ROLE_ADMIN]},
      // resolve: {data: AccountResolverService},
      component: IptableRuleComponent,
      data: {
        authorities: [
          AuthoritiesConstant.IPTABLE_RULE.IPTABLE_RULE_EXECUTE,
          AuthoritiesConstant.IPTABLE_RULE.IPTABLE_RULE_WRITE,
          AuthoritiesConstant.IPTABLE_RULE.IPTABLE_RULE_READ
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    {
      path: 'access-log',
      // data: {role: [AuthoritiesConstant.ROLE_ADMIN]},
      // resolve: {data: AccountResolverService},
      component: AccessLogComponent,
      data: {
        authorities: [
          AuthoritiesConstant.ACCESS_LOG.ACCESS_LOG_WRITE,
          AuthoritiesConstant.ACCESS_LOG.ACCESS_LOG_READ,
          AuthoritiesConstant.ACCESS_LOG.ACCESS_LOG_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    {
      path: 'access-authorization',
      component: AccessAuthorizationComponent,
      data: {
        authorities: [
          AuthoritiesConstant.ACCESS_AUTHORIZATION.ACCESS_AUTHORIZATION_WRITE,
          AuthoritiesConstant.ACCESS_AUTHORIZATION.ACCESS_AUTHORIZATION_READ,
          AuthoritiesConstant.ACCESS_AUTHORIZATION.ACCESS_AUTHORIZATION_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    {
      path: 'lookup-table',
      component: LookupTableComponent,
      data: {
        authorities: [
          AuthoritiesConstant.LOOKUP_TABLE.LOOKUP_TABLE_WRITE,
          AuthoritiesConstant.LOOKUP_TABLE.LOOKUP_TABLE_READ,
          AuthoritiesConstant.LOOKUP_TABLE.LOOKUP_TABLE_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService]
    },
    // {
    //   path: 'db-oracle-manager',
    //   component: DbOracleManagerComponent,
    //   data: {
    //     authorities: [
    //       AuthoritiesConstant.DB_ORACLE_MANAGER.DB_ORACLE_MANAGER_WRITE,
    //       AuthoritiesConstant.DB_ORACLE_MANAGER.DB_ORACLE_MANAGER_READ,
    //       AuthoritiesConstant.DB_ORACLE_MANAGER.DB_ORACLE_MANAGER_EXECUTE
    //     ]
    //   },
    //   canActivate: [UserRouteAccessService]
    // },
    {
      path: 'user-thrift',
      component: UserThriftComponent,
    },
    {
      path: 'thrift-manager',
      component: ThriftManagerComponent,
      data: {
        authorities: [
          AuthoritiesConstant.THRIFT_MANAGE.THRIFT_MANAGE_WRITE,
          AuthoritiesConstant.THRIFT_MANAGE.THRIFT_MANAGE_READ,
          AuthoritiesConstant.THRIFT_MANAGE.THRIFT_MANAGE_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService],
    },
    {
      path: 'role-management',
      // data: {role: [AuthoritiesConstant.ROLE_ADMIN]},
      // resolve: {data: AccountResolverService},
      component: RoleManagementComponent,
      data: {
        authorities: [
          AuthoritiesConstant.USER_HDFS_MANAGER.USER_HDFS_MANAGER_WRITE,
          AuthoritiesConstant.USER_HDFS_MANAGER.USER_HDFS_MANAGER_READ,
          AuthoritiesConstant.USER_HDFS_MANAGER.USER_HDFS_MANAGER_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService],
    },
    {
      path: 'module-management',
      // data: {role: [AuthoritiesConstant.ROLE_ADMIN]},
      // resolve: {data: AccountResolverService},
      component: ModuleManagementComponent,
    },
    {
      path: 'group-chart',
      // data: {authorities: ['GROUP_CHART']},
      // resolve: {data: AccountResolverService},
      data: {
        authorities: [
          AuthoritiesConstant.GROUP_CHART.GROUP_CHART_WRITE,
          AuthoritiesConstant.GROUP_CHART.GROUP_CHART_READ,
          AuthoritiesConstant.GROUP_CHART.GROUP_CHART_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService],
      loadChildren: () => import('./group-chart/group-chart.module')
        .then(m => m.GroupChartModule)
    },
    {
      path: 'support-request',
      data: {
        authorities: [
          AuthoritiesConstant.SUPPORT_REQUEST.SUPPORT_REQUEST_WRITE,
          AuthoritiesConstant.SUPPORT_REQUEST.SUPPORT_REQUEST_READ,
          AuthoritiesConstant.SUPPORT_REQUEST.SUPPORT_REQUEST_EXECUTE
        ]
      },
      canActivate: [UserRouteAccessService],
      loadChildren: () => import('./support-request/support-request.module')
        .then(m => m.SupportRequestModule)
    },
    {
      path: 'data-ingestion',
      // data: {role: [AuthoritiesConstant.ROLE_ADMIN]},
      // resolve: {data: AccountResolverService},
      loadChildren: () => import('./data-ingestion/data-ingestion.module')
        .then(m => m.DataIngestionModule)
    },
    // {
    //   path: 'forms',
    //   loadChildren: () => import('./forms/forms.module')
    //     .then(m => m.FormsModule),
    // },
    // {
    //   path: 'ui-features',
    //   loadChildren: () => import('./ui-features/ui-features.module')
    //     .then(m => m.UiFeaturesModule),
    // },
    // {
    //   path: 'modal-overlays',
    //   loadChildren: () => import('./modal-overlays/modal-overlays.module')
    //     .then(m => m.ModalOverlaysModule),
    // },
    {
      path: 'extra-components',
      loadChildren: () => import('./extra-components/extra-components.module')
        .then(m => m.ExtraComponentsModule),
    },
    // {
    //   path: 'maps',
    //   loadChildren: () => import('./maps/maps.module')
    //     .then(m => m.MapsModule),
    // },
    // {
    //   path: 'charts',
    //   loadChildren: () => import('./charts/charts.module')
    //     .then(m => m.ChartsModule),
    // },
    // {
    //   path: 'editors',
    //   loadChildren: () => import('./editors/editors.module')
    //     .then(m => m.EditorsModule),
    // },
    {
      path: 'tables',
      loadChildren: () => import('./tables/tables.module')
        .then(m => m.TablesModule),
    },
    // {
    //   path: 'miscellaneous',
    //   loadChildren: () => import('./miscellaneous/miscellaneous.module')
    //     .then(m => m.MiscellaneousModule),
    // },
    {
      path: 'not-permission',
      component: NotPermissionComponent
    },
    {
      path: 'not-found',
      component: NotFoundComponent
    },
    {
      path: '',
      redirectTo: 'dashboards',
      pathMatch: 'full',
    },
    {
      path: 'ingestion-dashboard',
      redirectTo: 'data-ingestion',
      pathMatch: 'full',
    },
    {
      path: 'flows',
      component: FlowsComponent,
      data: {
        authorities: [
          AuthoritiesConstant.FLOW_CUSTOMIZED.FLOW_CUSTOMIZED_EXECUTE,
          AuthoritiesConstant.FLOW_CUSTOMIZED.FLOW_CUSTOMIZED_WRITE,
          AuthoritiesConstant.FLOW_CUSTOMIZED.FLOW_CUSTOMIZED_READ
        ]
      },
      canActivate: [UserRouteAccessService],
    },
    {
      path: 'connection-Management',
      component: ConnectionManagementComponent,
      data: {
        authorities: [
          AuthoritiesConstant.CONNECTION_MANAGER.CONNECTION_MANAGER_EXECUTE,
          AuthoritiesConstant.CONNECTION_MANAGER.CONNECTION_MANAGER_WRITE,
          AuthoritiesConstant.CONNECTION_MANAGER.CONNECTION_MANAGER_READ
        ]
      },
      canActivate: [UserRouteAccessService],
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
