import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadService } from '../upload.service';
import { formData } from '../@core/utils/extend';
import { CinemaService } from '../cinema/cinema.service';
import { DialogService } from '../@theme/modules/dialog';

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
    city: new FormControl('', [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    license: new FormControl('', [Validators.required]),
    permit: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    contact_name: new FormControl('', [Validators.required]),
    contact_id: new FormControl('', [Validators.required]),
    contact_phone: new FormControl('', [Validators.required]),
    contact_email: new FormControl('', [Validators.required]),
    published_at: new FormControl(null, [])
  });
  fileLicenseList: any[];
  filePermitList: any[];
  loading: false;
  customLicenseRequest = (e): any => {
    const body = formData({files: e.file});
    this.uploadSvc.upload(body).subscribe(res => {
      e.onSuccess(e.file);
      this.form.get('license').setValue(res[0].id);
    });
  };
  customPermitRequest = (e): any => {
    const body = formData({files: e.file});
    this.uploadSvc.upload(body).subscribe(res => {
      e.onSuccess(e.file);
      this.form.get('permit').setValue(res[0].id);
    });
  };

  constructor(private uploadSvc: UploadService, private cinemaSvc: CinemaService, private dialogSvc: DialogService) {
  }

  ngOnInit() {
  }

  ionScroll(e) {
    this.scrollTop = e.detail.scrollTop;
  }

  submit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
      return false;
    }
    if (this.loading) {
      return false;
    }
    this.cinemaSvc.create(this.form.value).subscribe(res => {
      console.log(res);
      if (res) {
        this.dialogSvc.show({
          title: '提交成功',
          content: '线上提交入驻信息后，平台将通过线下的方式进行审核，审核通过后将通过电话与影院联系，提供入驻账号',
          cancel: '',
          confirm: '我知道了'
        }).subscribe();
      }
    });
  }
}
