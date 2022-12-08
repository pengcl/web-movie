import {Component, OnInit} from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-copyright',
  templateUrl: 'copyright.component.html',
  styleUrls: ['../../../../theme/ion-modal.scss', './copyright.component.scss'],
})
export class CopyrightComponent implements OnInit {

  constructor(private navParams: NavParams,
              private modalController: ModalController) {
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss().then();
  }
}
