import {Component, OnInit, Input} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {MatDialog} from '@angular/material/dialog';
import {DataService} from '../../services/data.service';
import {CodeComponent} from '../../@theme/entryComponents/code/code';
import {CinemaService} from '../cinema.service';

@Component({
  selector: 'app-cinema-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss']
})
export class CinemaListPage implements OnInit {
  movies;
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

  constructor(private popoverController: PopoverController,
              private dialog: MatDialog,
              private cinemaSvc: CinemaService,
              private data: DataService) {
    this.cinemaSvc.find({_limit:999,show:true}).subscribe(res=>{
      this.cinemas = res;
    })
    this.data.plans().subscribe(res => {
      this.movies = res.data;
      this.getFilterMovies();
    });
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

  getCinemas(): any[] {
    return this.data.getCinemas();
  }

  selected(target, item) {
    this[target] = item;
    this.getFilterMovies();
  }
}
