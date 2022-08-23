import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../../services/data.service';
import {DatePipe} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {ToastService} from '../../@theme/modules/toast';
import {MovieService} from '../movie.service';
import {IonSlides} from '@ionic/angular';

@Component({
  selector: 'app-movie-coming-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
  providers: [DatePipe]
})
export class MovieComingItemPage implements OnInit {
  scrollTop = 0;
  cinemas;
  movie;
  cinema;
  day = {};
  videoOpts = {
    slidesPerView: 4,
    spaceBetween: 11,
    slidesPerGroup: 4
  };
  movies: any[];
  @ViewChild('videoSlides', {static: false}) private videoSlides: IonSlides;
  @ViewChild('imgSlides', {static: false}) private imgSlides: IonSlides;
  page = 0;

  constructor(private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              private datePipe: DatePipe,
              private movieSvc: MovieService,
              private dataSvc: DataService,
              private toastSvc: ToastService) {
    this.movieSvc.getComingItem(this.activatedRoute.snapshot.params.id).subscribe(res => {
      this.movie = res.data.basic;
    });
    this.dataSvc.plans().subscribe(res => {
      this.movies = res.data;
    });
  }

  ngOnInit() {
  }

  more() {
    if(this.page * 12 < this.movies.length){
      this.page = this.page + 1;
    }
  }

  ionScroll(e) {
    this.scrollTop = e.detail.scrollTop;
  }

  slidePrev(target) {
    this[target].slidePrev().then();
  }

  slideNext(target) {
    this[target].slideNext().then();
  }
}
