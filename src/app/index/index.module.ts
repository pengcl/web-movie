import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeModule} from '../@theme/theme.module';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {IndexPageRoutingModule} from './index-routing.module';
import {IndexPage} from './index.page';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
    IonicModule,
    IndexPageRoutingModule
  ],
  declarations: [IndexPage],
  entryComponents: [],
  exports: [
  ],
  providers: []
})
export class IndexPageModule {
}
