import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {NavParams, ModalController} from '@ionic/angular';
import {ToastService} from '../../modules/toast';
import {AppService} from '../../../app.service';
import {AuthService} from '../../../auth/auth.service';
import {PasswordService} from '../../modules/password';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset.component.html',
  styleUrls: ['../../../../theme/ion-modal.scss', './reset.component.scss'],
  providers: [DatePipe]
})
export class ResetPasswordComponent {
  memberUid;
  form: FormGroup = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^[0-9]+.?[0-9]*/),
      Validators.maxLength(6)
    ]) // 新密码
  });

  constructor(private navParams: NavParams,
              private modalController: ModalController,
              private appSvc: AppService,
              private authSvc: AuthService,
              private toastSvc: ToastService,
              private passwordSvc: PasswordService) {
    this.memberUid = this.navParams.data.params.memberUid;
  }

  startup(target: string) {
    this.passwordSvc.show().subscribe(res => {
      console.log(res);
      if (res) {
        this.form.get(target).setValue(res);
      }
    });
  }

  dismiss() {
    this.modalController.dismiss().then();
  }

  // 重置会员密码
  confirm() {
  }
}
