import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../movie.service';
import { CodeComponent } from '../../@theme/entryComponents/code/code';

@Component({
  selector: 'app-movie-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss']
})
export class MovieListPage implements OnInit {
  movies: any[];
  cinemas;
  slideOpts = {};
  slideBannerOpts = {
    initialSlide: 1,
    speed: 400
  };
  city;
  loading = true;
  cinema;
  filterMovies;
  scrollTop = 0;
  comings: any[] = null;
  tab = '正在热映';
  searchKey;
  page = {
    movie: 0,
    coming: 0
  };

  constructor(private popoverController: PopoverController,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private data: DataService,
              private movieSvc: MovieService) {
    this.cinemas = this.getCinemas();
    this.route.queryParamMap.subscribe(res => {
      this.searchKey = res['params'].searchKey;
      this.getData();
    });
  }

  getData() {
    this.data.plans().subscribe(res => {
      this.movies = this.searchKey ? res.data.filter(item => item.movieName.indexOf(this.searchKey) !== -1) : res.data;
      this.getFilterMovies();
    });
    this.movieSvc.getComingsStatus().subscribe(res => {
      this.comings = res;
    });
  };

  changeTab(tab) {
    this.tab = tab;
  }

  more(target) {
    if (this.page[target] * 12 < this.movies.length) {
      this.page[target] = this.page[target] + 1;
    }
  }

  ngOnInit() {
  }

  ionScroll(e) {
    this.scrollTop = e.detail.scrollTop;
  }

  getFilterMovies() {
    if (this.movies && this.cinema) {
      this.filterMovies = this.movies.filter(movie => movie.saleCinemas.indexOf(this.cinema.code) !== -1);
    } else {
      this.filterMovies = this.movies;
    }
  };

  openDialog(data): void {
    const dialogRef = this.dialog.open(CodeComponent, {
      width: '200px',
      maxWidth: '200px',
      data
    });
  }

  showCode(movieCode) {
    this.openDialog({movieCode, cinemaCode: this.cinema.code});
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  getMovies(): any[] {
    return this.data.getMovies();
  }

  getComings() {

  }

  getCinemas(): any[] {
    return this.data.getCinemas();
  }

  selected(target, item) {
    this[target] = item;
    this.getFilterMovies();
  }
}
