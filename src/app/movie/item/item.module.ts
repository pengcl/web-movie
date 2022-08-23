import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ThemeModule} from '../../@theme/theme.module';
import {IonicModule} from '@ionic/angular';
import {MovieItemPage} from './item.page';
import {MovieItemRoutingModule} from './item-routing.module';

@NgModule({
  imports: [CommonModule, ThemeModule, FormsModule, IonicModule, MovieItemRoutingModule],
  declarations: [MovieItemPage],
  exports: [MovieItemPage],
  providers: []
})
export class MovieItemPageModule {
}
