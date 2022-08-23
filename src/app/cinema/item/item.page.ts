import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../../services/data.service';
import {DatePipe} from '@angular/common';
import {CodeComponent} from '../../@theme/entryComponents/code/code';
import {MatDialog} from '@angular/material/dialog';
import {ToastService} from '../../@theme/modules/toast';

@Component({
  selector: 'app-cinema-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
  providers: [DatePipe]
})
export class CinemaItemPage implements OnInit {
  scrollTop = 0;
  cinemas;
  cinema = this.getCinemas()[this.activatedRoute.snapshot.params.id];
  movies = [];

  constructor(private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              private datePipe: DatePipe,
              private dataSvc: DataService,
              private toastSvc: ToastService) {
    this.dataSvc.plans().subscribe(res => {
      this.movies = res.data.filter(movie => movie.saleCinemas.indexOf(this.cinema.code) !== -1);
    });
  }

  ngOnInit() {
  }

  ionScroll(e) {
    this.scrollTop = e.detail.scrollTop;
  }

  getCinemas(): any {
    const cinemas = {};
    (this.dataSvc.getCinemas()).forEach(item => {
      cinemas[item.code] = item;
    });
    return cinemas;
  }
}
