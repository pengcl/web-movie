import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ThemeModule} from '../../@theme/theme.module';
import {IonicModule} from '@ionic/angular';
import {CinemaItemPage} from './item.page';
import {CinemaItemRoutingModule} from './item-routing.module';

@NgModule({
  imports: [CommonModule, ThemeModule, FormsModule, IonicModule, CinemaItemRoutingModule],
  declarations: [CinemaItemPage],
  exports: [CinemaItemPage]
})
export class CinemaItemPageModule {
}
