import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataIngestionRoutingModule } from './data-ingestion-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MonitorIngestionComponent } from './monitor-ingestion/monitor-ingestion.component';
import { ConnectionManagementComponent } from './connection-management/connection-management.component';
import {
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule, NbLayoutModule,
    NbSpinnerModule, NbTooltipModule
} from '@nebular/theme';
import {TranslateModule} from '@ngx-translate/core';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NewConnectionComponent } from './connection-management/new-connection/new-connection.component';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {ShareModule} from '../../share/share.module';
import { AddThreadComponent } from './monitor-ingestion/add-thread/add-thread.component';
import { UpdateThreadComponent } from './monitor-ingestion/update-thread/update-thread.component';
import {HighchartsChartModule} from 'highcharts-angular';
import {ThemeModule} from '../../@theme/theme.module';


@NgModule({
  declarations: [DashboardComponent, MonitorIngestionComponent, ConnectionManagementComponent, NewConnectionComponent, AddThreadComponent, UpdateThreadComponent],
    imports: [
        NbInputModule,
        NbButtonModule,
        CommonModule,
        DataIngestionRoutingModule,
        NbCardModule,
        NgxDatatableModule,
        NbIconModule,
        TranslateModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NgxTrimDirectiveModule,
        ShareModule,
        NbCheckboxModule,
        NbSpinnerModule,
        HighchartsChartModule,
        NbFormFieldModule,
        NbLayoutModule,
        NbTooltipModule,
        ThemeModule
    ]
})
export class DataIngestionModule {
}
