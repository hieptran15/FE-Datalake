import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRequestRoutingModule } from './support-request-routing.module';
import { OpenRequestComponent } from './open-request/open-request.component';
import {SupportRequestComponent} from './support-request.component';
import {
  NbButtonModule,
  NbCardModule, NbCheckboxModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule, NbListModule, NbPopoverModule, NbRadioModule,
  NbSpinnerModule, NbStepperModule, NbTooltipModule
} from '@nebular/theme';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {TranslateModule} from '@ngx-translate/core';
import { ContentRequestComponent } from './open-request/content-request/content-request.component';
import { PerformSRComponent } from './open-request/perform-sr/perform-sr.component';
import { PerformLogComponent } from './open-request/perform-log/perform-log.component';
import {ShareModule} from '../../share/share.module';
import {CalendarModule} from 'primeng/calendar';
import {RadioButtonModule} from 'primeng/radiobutton';


@NgModule({
  declarations: [SupportRequestComponent, OpenRequestComponent, ContentRequestComponent, PerformSRComponent, PerformLogComponent],
  imports: [
    CommonModule,
    SupportRequestRoutingModule,
    NbLayoutModule,
    NbSpinnerModule,
    NbCardModule,
    NgSelectModule,
    NbFormFieldModule,
    NbIconModule,
    FormsModule,
    NbInputModule,
    NgxTrimDirectiveModule,
    NgxDatatableModule,
    NbTooltipModule,
    NbButtonModule,
    TranslateModule,
    NbPopoverModule,
    NbListModule,
    NbStepperModule,
    ReactiveFormsModule,
    ShareModule,
    CalendarModule,
    NbRadioModule,
    NbCheckboxModule,
    RadioButtonModule
  ]
})
export class SupportRequestModule { }
