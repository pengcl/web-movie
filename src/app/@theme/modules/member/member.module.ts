import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {MemberComponent} from './member.component';
import {MemberLoginComponent} from './entryComponents/login/login';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MemberCardComponent} from './entryComponents/card/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {ThemeModule} from '../../theme.module';

@NgModule({
  imports: [CommonModule, RouterModule, IonicModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, ThemeModule],
  declarations: [MemberComponent, MemberLoginComponent, MemberCardComponent],
  exports: [MemberComponent, MemberLoginComponent, MemberCardComponent],
  entryComponents: [MemberLoginComponent, MemberCardComponent],
  providers: []
})
export class MemberModule {
}
