import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activityDetail.component.html',
  styleUrls: ['../../../../theme/ion-modal.scss', './activityDetail.component.scss'],
  providers: [DatePipe]
})
export class ActivityDetailComponent implements OnInit {
  activity = null;
  constructor(private navParams: NavParams,
              private modalController: ModalController) {
    this.activity = this.navParams.data.activity;
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss().then();
  }
}
