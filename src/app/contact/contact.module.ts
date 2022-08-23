import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ThemeModule } from '../@theme/theme.module';
import { ContactPage } from './contact.page';
import { ContactPageRoutingModule } from './contact-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ContactPageRoutingModule,
    ThemeModule
  ],
  declarations: [ContactPage],
  exports: [ContactPage]
})
export class ContactPageModule {
}
