import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  scrollTop = 0;
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    province: new FormControl('', [Validators.required]),
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

  constructor() {
  }

  ngOnInit() {
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
  }
}
