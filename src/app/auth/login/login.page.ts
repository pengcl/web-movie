import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from '../../@theme/modules/dialog';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.page.html',
  styleUrls: ['../auth.scss', './login.page.scss']
})
export class AuthLoginPage {
  form: FormGroup;

  constructor(private router: Router,
              private dialogSvc: DialogService,
              private authSvc: AuthService) {
    this.form = new FormGroup({
      identifier: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]),
      password: new FormControl('', [Validators.required])
    });
  }

  login(): any {
    console.log(this.form);
    if (this.form.invalid) {
      return false;
    }
    this.authSvc.login(this.form.value).subscribe(res => {
      console.log(res);
      // 设置用户Token信息
      if (res.user) {
        this.authSvc.updateLoginStatus(res);
        this.router.navigate(['/index']).then();
      } else {
        this.form.setErrors({identifier: {valid: false}});
      }
    });

  }

}
