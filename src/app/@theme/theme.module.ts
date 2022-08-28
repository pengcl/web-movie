import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {IonicModule} from '@ionic/angular';
import {COMPONENTS, ENTRY_COMPONENTS, PIPES, DIRECTIVES} from './index';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {ToastModule} from './modules/toast';
import {MaskModule} from './modules/mask';
import {MemberModule} from './modules/member/member.module';
import {DialogModule} from './modules/dialog';
import {PaginationModule} from './modules/pagination';
import {ScrollbarThemeModule} from './modules/scrollbar/scrollbar.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {PasswordModule} from './modules/password';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzAlertModule} from 'ng-zorro-antd/alert';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzModalModule} from 'ng-zorro-antd/modal';


const MATERIAL_PART = [
  MatSidenavModule
];

const NZ_PART = [
  NzFormModule,
  NzInputModule,
  NzSelectModule,
  NzButtonModule,
  NzDatePickerModule,
  NzTableModule,
  NzRadioModule,
  NzIconModule,
  NzAlertModule,
  NzPaginationModule,
  NzToolTipModule,
  NzInputNumberModule,
  NzModalModule,
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule,
    ToastModule,
    MaskModule,
    MemberModule,
    DialogModule,
    PaginationModule,
    ScrollbarThemeModule,
    ...MATERIAL_PART,
    ...NZ_PART,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSnackBarModule,
    PasswordModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ToastModule,
    MaskModule,
    DialogModule,
    MemberModule,
    PaginationModule,
    IonicModule,
    ScrollbarThemeModule,
    MatSnackBarModule,
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
    ...PIPES,
    ...MATERIAL_PART,
    ...NZ_PART,
    PasswordModule
  ],
  declarations: [...COMPONENTS, ...ENTRY_COMPONENTS, ...PIPES, ...DIRECTIVES],
  entryComponents: [],
  providers: [CurrencyPipe, DatePipe]
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [...PIPES]
    } as ModuleWithProviders<ThemeModule>;
  }
}
