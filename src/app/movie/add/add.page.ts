import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { MovieService } from '../movie.service';
import { DialogService } from '../../@theme/modules/dialog';

@Component({
  selector: 'app-movie-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss']
})
export class MovieAddPage implements OnInit {
  scrollTop = 0;
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    start_at: new FormControl('', [Validators.required]),
    director: new FormControl('', [Validators.required]),
    company: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    contact_name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required])
  });
  loading: false;

  constructor(private router: Router, private movieSvc: MovieService, private authSvc: AuthService, private dialogSvc: DialogService) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    if (!this.authSvc.isLogged) {
      this.dialogSvc.show({content: '请先登录网站，再发布电影信息', confirm: '我知道了', cancel: '返回首页'}).subscribe(res => {
        if (res.value) {
          this.router.navigate(['/auth/login']).then();
        } else {
          this.router.navigate(['/home']).then();
        }
      });
    }
  }

  ionScroll(e) {
    this.scrollTop = e.detail.scrollTop;
  }

  submit() {
    if (this.form.invalid) {
      return false;
    }
    if (this.loading) {
      return false;
    }
    this.movieSvc.create(this.form.value).subscribe(res => {
      console.log(res);
    });
  }
}
