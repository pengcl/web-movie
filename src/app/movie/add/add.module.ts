import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeModule} from '../../@theme/theme.module';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {MovieAddPage} from './add.page';
import {MovieAddRoutingModule} from './add-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MovieAddRoutingModule,
    ThemeModule
  ],
  declarations: [MovieAddPage],
  exports: [MovieAddPage]
})
export class MovieAddPageModule {
}
