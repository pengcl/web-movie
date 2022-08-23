import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {AuthLoginPage} from './login.page';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: AuthLoginPage}]),
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  declarations: [AuthLoginPage]
})
export class AuthLoginPageModule {
}
