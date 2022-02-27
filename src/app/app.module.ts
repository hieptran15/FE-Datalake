/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LOCALE_ID, NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CoreModule} from './@core/core.module';
import {ThemeModule} from './@theme/theme.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgSelectModule} from '@ng-select/ng-select';
import {
    NbToggleModule,
    NbAlertModule, NbButtonModule,
    NbChatModule,
    NbDatepickerModule,
    NbDialogModule, NbInputModule,
    NbMenuModule,
    NbSidebarModule, NbSpinnerModule,
    NbToastrModule,
    NbWindowModule,
    NbIconModule, NbCardModule, NbCheckboxModule
} from '@nebular/theme';
import {ShareModule} from './share/share.module';
import {ColorPickerModule} from 'ngx-color-picker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import vi from '@angular/common/locales/vi';
import viEt from '@angular/common/locales/extra/vi';
import {DecimalPipe, registerLocaleData} from '@angular/common';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {LoginComponent} from './auth-routing/login/login.component';
import {LogoutComponent} from './auth-routing/logout/logout.component';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {AccountResolverService} from './@core/auth/resolve-route';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {EnvServiceProvider} from './env.service.provider';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';

registerLocaleData(vi, 'vi-VI', viEt);

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, LoginComponent, LogoutComponent],
    imports: [
        BrowserModule,
        NbToggleModule,
        DropdownModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        NgSelectModule,
        CalendarModule,
        NgxDatatableModule,
        NbIconModule,
        NbSidebarModule.forRoot(),
        NbMenuModule.forRoot(),
        NbDatepickerModule.forRoot(),
        NbDialogModule.forRoot(),
        NbWindowModule.forRoot(),
        NbToastrModule.forRoot(),
        NgxWebstorageModule.forRoot(),
        NbChatModule.forRoot({
            messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
        }),
        CoreModule.forRoot(),
        ThemeModule.forRoot(),
        ShareModule,
        ColorPickerModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            },
            defaultLanguage: 'vi'
        }),
        NbAlertModule,
        NbInputModule,
        NbButtonModule,
        NbSpinnerModule,
        NgxTrimDirectiveModule,
        NbCardModule,
        NbCheckboxModule
    ],
  bootstrap: [AppComponent],
  exports: [ColorPickerModule, TranslateModule],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'vi-VI'
  }, DecimalPipe, TranslatePipe, AccountResolverService, EnvServiceProvider]
})
export class AppModule {
}
