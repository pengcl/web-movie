import {Component, OnInit} from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-agreement',
  templateUrl: 'agreement.component.html',
  styleUrls: ['../../../../theme/ion-modal.scss', './agreement.component.scss'],
})
export class AgreementComponent implements OnInit {

  constructor(private navParams: NavParams,
              private modalController: ModalController) {
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss().then();
  }
}
