import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {IonicModule} from '@ionic/angular';
import {COMPONENTS, ENTRY_COMPONENTS, PIPES, DIRECTIVES} from './index';
import {ToastModule} from './modules/toast';
import {MaskModule} from './modules/mask';
import {MemberModule} from './modules/member/member.module';
import {DialogModule} from './modules/dialog';
import {PaginationModule} from './modules/pagination';
import {ScrollbarThemeModule} from './modules/scrollbar/scrollbar.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';

const MATERIAL_PART = [
  MatSidenavModule
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
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSnackBarModule
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
    ...MATERIAL_PART
  ],
  declarations: [...COMPONENTS, ...ENTRY_COMPONENTS, ...PIPES, ...DIRECTIVES],
  entryComponents: [],
  providers: []
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [...PIPES]
    } as ModuleWithProviders<ThemeModule>;
  }
}
