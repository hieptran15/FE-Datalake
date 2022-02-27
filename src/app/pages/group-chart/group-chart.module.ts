import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GroupChartRoutingModule} from './group-chart-routing.module';
import {GroupChartComponent} from './group-chart.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {
    NbButtonModule,
    NbCardModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule, NbLayoutModule, NbListModule, NbPopoverModule, NbRadioModule, NbSpinnerModule,
    NbTooltipModule
} from '@nebular/theme';
import {ChartCardComponent} from './components/chart-card/chart-card.component';
import {GroupChartDetailComponent} from './components/group-chart-detail/group-chart-detail.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ShareModule} from '../../share/share.module';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {TextMaskModule} from 'angular2-text-mask';
import {NgxMaskModule} from 'ngx-mask';
import {ThemeModule} from '../../@theme/theme.module';
import {ViewLogDialogComponent} from '../../share/component/viewlog-dialog/viewlog-dialog.component';


@NgModule({
    declarations: [GroupChartComponent, ChartCardComponent, GroupChartDetailComponent, ViewLogDialogComponent],
    exports: [
        GroupChartComponent
    ],
    imports: [
        CommonModule,
        TextMaskModule,
        GroupChartRoutingModule,
        NgSelectModule,
        NbCardModule,
        NbIconModule,
        NbButtonModule,
        NbInputModule,
        NbTooltipModule,
        NgxDatatableModule,
        FormsModule,
        ReactiveFormsModule,
        ShareModule,
        NbDatepickerModule,
        NgxTrimDirectiveModule,
        NgxMaskModule.forRoot(),
        NbLayoutModule,
        ThemeModule,
        NbSpinnerModule,
        NbPopoverModule,
        NbListModule,
        NbRadioModule
    ]
})
export class GroupChartModule {
}
