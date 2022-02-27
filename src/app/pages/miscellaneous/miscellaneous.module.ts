import { NgModule } from '@angular/core';
import {NbButtonModule, NbCardModule, NbLayoutModule, NbSpinnerModule} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { MiscellaneousRoutingModule } from './miscellaneous-routing.module';
import { MiscellaneousComponent } from './miscellaneous.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotPermissionComponent } from './not-permission/not-permission.component';

@NgModule({
    imports: [
        ThemeModule,
        NbCardModule,
        NbButtonModule,
        MiscellaneousRoutingModule,
        NbLayoutModule,
        NbSpinnerModule,
    ],
  declarations: [
    MiscellaneousComponent,
    NotFoundComponent,
    NotPermissionComponent,
  ],
})
export class MiscellaneousModule { }
