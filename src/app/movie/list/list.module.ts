import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeModule} from '../../@theme/theme.module';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {MovieListPage} from './list.page';
import {MovieListRoutingModule} from './list-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovieListRoutingModule,
    ThemeModule
  ],
  declarations: [MovieListPage],
  exports: [MovieListPage]
})
export class MovieListPageModule {
}
