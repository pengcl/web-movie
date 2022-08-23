import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../auth.service';
import { AgreementDialog } from '../contents/agreement/agreement';
import { PrivacyDialog } from '../contents/privacy/privacy';

@Component({
  selector: 'app-auth-register',
  templateUrl: './register.page.html',
  styleUrls: ['../auth.scss', './register.page.scss']
})
export class AuthRegisterPage {
  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    confirmed: new FormControl(true, [Validators.required])
  });

  constructor(private router: Router,
              private dialog: MatDialog,
              private authSvc: AuthService) {
  }

  getErrorMessage(key): string {
    const control = this.form.get(key);
    if (control.hasError('required')) {
      return '不能为空';
    }
    if (control.hasError('maxlength')) {
      return '太长了';
    }
    if (control.hasError('minlength')) {
      return '太短了';
    }
    if (control.hasError('exist')) {
      return '已经存在';
    }
    return control.hasError('email') ? '邮箱格式不正确' : '';
  }

  register(): any {
    if (this.form.invalid) {
      return false;
    }
    this.authSvc.register(this.form.value).subscribe(res => {
      console.log(res);
      // 设置用户Token信息
      this.authSvc.updateLoginStatus(res);
      this.router.navigate(['/home']).then();
    });

  }

  openDialog(target) {
    let dialogRef;
    if (target === 'agreement') {
      dialogRef = this.dialog.open(AgreementDialog);
    } else {
      dialogRef = this.dialog.open(PrivacyDialog);
    }
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
