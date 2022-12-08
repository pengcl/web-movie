import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {UploadService} from '../upload.service';
import {formData} from '../@core/utils/extend';
import {CinemaService} from '../cinema/cinema.service';
import {DialogService} from '../@theme/modules/dialog';
import {KeywordService} from '../keyword.service';
import {CopyrightComponent} from '../@theme/entryComponents/copyright/copyright.component';
import {AgreementComponent} from '../@theme/entryComponents/agreement/agreement.component';

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
    company_name: new FormControl('', [Validators.required]),
    company_no: new FormControl('', [Validators.required]),
    contact_name: new FormControl('', [Validators.required]),
    contact_id: new FormControl('', [Validators.required]),
    contact_phone: new FormControl('', [Validators.required]),
    contact_email: new FormControl('', [Validators.required]),
    published_at: new FormControl(null, [])
  });
  fileLicenseList: any[];
  filePermitList: any[];
  loading: false;
  keywords = [];
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
  remember:false;
  constructor(private modalController:ModalController,
              private uploadSvc: UploadService,
              private cinemaSvc: CinemaService,
              private dialogSvc: DialogService,
              private keywordSvc: KeywordService) {
    keywordSvc.find({_limit: 9999}).subscribe(res => {
      this.keywords = res;
    });
  }

  ngOnInit() {
  }

  ionScroll(e) {
    this.scrollTop = e.detail.scrollTop;
  }

  blur(key){
    if(this.form.get(key).invalid){
      return false;
    }
    this.keywords.forEach(item=>{
      if(this.form.get(key).value.indexOf(item.name) !== -1){
        this.dialogSvc.show({content: `您输入的内容存在非法字符"${this.form.get(key).value}"`, cancel: '', confirm: '我知道了'}).subscribe();
        this.form.get(key).reset();
      }
    })
  }

  async presentCopyrightModal() {
    const modal = await this.modalController.create({
      showBackdrop: true,
      backdropDismiss: false,
      component: CopyrightComponent,
      componentProps: {}
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  async presentAgreementModal() {
    const modal = await this.modalController.create({
      showBackdrop: true,
      backdropDismiss: false,
      component: AgreementComponent,
      componentProps: {}
    });
    await modal.present();
    await modal.onDidDismiss();
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
