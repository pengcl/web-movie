import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { DataService } from '../../../services/data.service';

export interface PeriodicElement {
  name: string;
  code: number;
  province: number;
  city: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-cinemas-selector',
  templateUrl: 'cinemasSelector.html',
  styleUrls: ['cinemasSelector.scss']
})
export class CinemasSelectorComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selected: PeriodicElement;

  constructor(private modalController: ModalController,
              private navParams: NavParams,
              private dataSvc: DataService) {
    this.selected = this.navParams.data.cinema;
  }

  displayedColumns: string[] = ['select', 'code', 'name', 'province', 'city'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.dataSvc.getCinemas());
  selection = new SelectionModel<PeriodicElement>(false, []);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.data.forEach(item=>{
      if(this.selected.code === item.code){
        this.selection.select(item);
      }
    })
  }

  cancel() {
    this.modalController.dismiss(null).then();
  }

  confirm() {
    this.modalController.dismiss(this.selection.selected[0]).then();
  }
}
