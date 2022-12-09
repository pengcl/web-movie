import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MemberService } from '../../member.service';
import { AppService } from '../../../../../app.service';
import { TicketService } from '../../../../../ticket/ticket.service';
import { LogService } from '../../../../../@core/utils/log.service';

@Component({
  selector: 'app-member-login',
  templateUrl: 'login.html',
  styleUrls: ['../../../../../../theme/ion-modal.scss', 'login.scss'],
  providers: []
})
export class MemberLoginComponent implements AfterViewInit {
  form: FormGroup = new FormGroup({
    cinema: new FormControl(this.appSvc.currentCinema.cinemaName, [Validators.required]),
    cardType: new FormControl('1', [Validators.required]),
    conditions: new FormControl('', [Validators.required])
  });

  constructor(private modalController: ModalController,
              private logSvc: LogService,
              private appSvc: AppService,
              private memberSvc: MemberService,
              private ticketSvc: TicketService) {

  }

  ngAfterViewInit() {
  }

  confirm() {
    console.log('confirm');
    if (this.form.valid) {
      const cardType = this.form.get('cardType').value;
      const conditions = this.form.get('conditions').value;
      const body: any = {cardType};
      if (cardType === 1) {
        body.conditions = conditions;
      } else {
        body.cardNoPhysical = conditions;
      }
      console.log('getMember');
      this.getMember(body);
    }
  }

  getMember(body) {
    console.log(this.ticketSvc.currentPlan);
    if (this.ticketSvc.currentPlan) {
      body.uidScene = this.ticketSvc.currentPlan.uidPlan;
    }
    this.memberSvc.login(body).subscribe(res => {
      if (res.data) {
        this.logSvc.log('登录', this.form.get('conditions').value);
        this.modalController.dismiss(res.data).then();
      }
    });
  }

  dismiss() {
    this.modalController.dismiss().then();
  }

  clickNumber(strNum: string) {
    let conditions = this.form.get('conditions').value;
    if (strNum === 'del') {
      conditions = conditions.slice(0, conditions.length - 1);
    } else {
      conditions = conditions + strNum;
    }
    this.form.get('conditions').setValue(conditions);
  }

}
