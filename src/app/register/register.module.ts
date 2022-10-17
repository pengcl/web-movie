import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ThemeModule } from '../@theme/theme.module';
import { RegisterPage } from './register.page';
import { RegisterPageRoutingModule } from './register-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    ThemeModule
  ],
  declarations: [RegisterPage],
  exports: [RegisterPage]
})
export class RegisterPageModule {
}
