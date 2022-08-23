import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthRegisterPage } from './register.page';
import { AgreementDialog } from '../contents/agreement/agreement';
import { PrivacyDialog } from '../contents/privacy/privacy';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: AuthRegisterPage}]),
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatDialogModule
  ],
  declarations: [AuthRegisterPage, AgreementDialog, PrivacyDialog]
})
export class AuthRegisterPageModule {
}
