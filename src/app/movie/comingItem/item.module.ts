import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ThemeModule} from '../../@theme/theme.module';
import {IonicModule} from '@ionic/angular';
import {MovieComingItemPage} from './item.page';
import {MovieComingItemRoutingModule} from './item-routing.module';
import {RmbPipe} from '../../pipes.pipe';

@NgModule({
  imports: [CommonModule, ThemeModule, FormsModule, IonicModule, MovieComingItemRoutingModule],
  declarations: [MovieComingItemPage, RmbPipe],
  exports: [MovieComingItemPage],
  providers: [RmbPipe]
})
export class MovieComingItemPageModule {
}
