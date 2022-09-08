import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AppService } from '../../app.service';
import { DatePipe } from '@angular/common';
import { CodeComponent } from '../../@theme/entryComponents/code/code';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../@theme/modules/toast';
import { IonSlides } from '@ionic/angular';
import { TicketService } from '../../ticket/ticket.service';
import { CinemaService } from '../../cinema/cinema.service';

@Component({
  selector: 'app-movie-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
  providers: [DatePipe]
})
export class MovieItemPage implements OnInit {
  scrollTop = 0;
  cinemas;
  movie;
  cinema;
  day = {};
  slideOpts = {
    slidesPerView: 5,
    spaceBetween: 11,
    slidesPerGroup: 5
  };
  movies: any[];
  @ViewChild('slides', {static: false}) private slides: IonSlides;
  currentPlan;
  page = 0;

  constructor(private activatedRoute: ActivatedRoute,
              private appSvc: AppService,
              private dialog: MatDialog,
              private datePipe: DatePipe,
              private dataSvc: DataService,
              private ticketSvc: TicketService,
              private cinemaSvc: CinemaService,
              private toastSvc: ToastService) {
    this.activatedRoute.queryParamMap.subscribe(queryParam => {
      const params: any = queryParam['params'];
      this.dataSvc.plans().subscribe(res => {
        this.movie = res.data.filter(item => item.movieCode === this.activatedRoute.snapshot.params.id)[0];
        const items = [];
        this.cinemaSvc.find({_limit: 999}).subscribe(_cinemas=>{
          const cinemas = {};
          _cinemas.forEach(item=>{
            cinemas[item.code] = item;
          })

          const code = params.cinema;
          if (code) {
            this.cinema = cinemas[code];
            this.movie.saleCinemas.forEach(cinemaCode => {
              if (cinemas[cinemaCode]) {
                items.push(cinemas[cinemaCode]);
              }
            });

          } else {
            this.cinema = items[0];
          }
          this.cinemas = items.sort((a, b) => b.code - a.code);
          this.getData();
        })
      });
    });
  }

  more() {
    if (this.page * 12 < this.movies.length) {
      this.page = this.page + 1;
    }
  }

  getData() {
    const data = {
      cinemaCode: this.cinema.code
    };
    this.appSvc.getToken(data.cinemaCode).subscribe(res => {
      const userToken = res.data.access_token;
      const plansParams = {
        cinemaCode: data.cinemaCode,
        userToken
      };
      this.ticketSvc.getInfo(plansParams).subscribe(res => {
        res.data.movieList.forEach(item => {
          item.current = item.movieAllPlans[0];
        });
        let movies = [res.data.movieList.filter(item => item.movieCode === this.activatedRoute.snapshot.params.id)[0]];
        movies = movies.concat(res.data.movieList.filter(item => item.movieCode !== this.activatedRoute.snapshot.params.id));
        this.getDayPlans(movies);
      });
    });
  };

  getDayPlans(movies) {
    movies.forEach(item => {
      if (item.movieCode === this.movie.movieCode) {
        this.currentPlan = item.movieAllPlans.filter(item => item.filmPlanShowList.length > 0)[0];
      }
    });
    this.movies = movies;
  }

  ngOnInit() {
  }

  ionScroll(e) {
    this.scrollTop = e.detail.scrollTop;
  }

  openDialog(data): void {
    const dialogRef = this.dialog.open(CodeComponent, {
      width: '200px',
      maxWidth: '200px',
      data
    });
  }

  showCode(movieCode) {
    /*this.openDialog({movieCode, cinemaCode: this.cinema.code});*/
  }

  getMovies(): any[] {
    return this.dataSvc.getMovies();
  }

  selected(target, item) {
    this[target] = item;
    this.getData();
  }

  slidePrev() {
    this.slides.slidePrev().then();
  }

  slideNext() {
    this.slides.slideNext().then();
  }
}
