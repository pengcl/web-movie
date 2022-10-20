import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, PopoverController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ToastService } from '../@theme/modules/toast';
import { DialogService } from '../@theme/modules/dialog';
import { DataService } from '../services/data.service';
import { AppService } from '../app.service';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieService } from '../movie/movie.service';
import { CinemasSelectorComponent } from '../@theme/entryComponents/cinemasSelector/cinemasSelector';
import { CinemaService } from '../cinema/cinema.service';
import { getPassword } from '../@core/utils/extend';

@Component({
  selector: 'app-index',
  templateUrl: 'index.page.html',
  styleUrls: ['index.page.scss']
})
export class IndexPage implements AfterViewInit {
  slideOpts = {
    slidesPerView: 5,
    spaceBetween: 11,
    slidesPerGroup: 5
  };
  movies: any[];
  isOpen = false;
  @ViewChild('slides', {static: false}) private slides: IonSlides;
  comings: any[];
  tops: any[];
  subscribe = {cinema: null};
  cinema = this.appSvc.currentCinema;
  cinemas;
  provinces;
  cities;
  filterCities;
  filterCinemas;

  constructor(private popoverController: PopoverController,
              private router: Router,
              private modalController: ModalController,
              private toastSvc: ToastService,
              private dialogSvc: DialogService,
              private dialog: MatDialog,
              private data: DataService,
              private movieSvc: MovieService,
              private cinemaSvc: CinemaService,
              private authSvc: AuthService,
              private appSvc: AppService) {
  }

  ngAfterViewInit() {
  }

  ionViewDidEnter() {
    this.subscribe.cinema = this.appSvc.getCinemaStatus().subscribe(res => {
      this.cinema = res;
      this.getData();
    });
    this.getCinemas();
  }

  ionViewDidLeave() {
    for (const key in this.subscribe) {
      if (this.subscribe[key]) {
        this.subscribe[key].unsubscribe();
      }
    }
  }

  getCinemas() {
    this.cinemaSvc.find({_limit: 999, show: true}).subscribe(res => {
      this.cinemas = res;
      const provinces = [];
      const cities = [];
      res.forEach(item => {
        if (provinces.indexOf(item.province) === -1) {
          provinces.push(item.province);
        }
        if (cities.filter(city => city.city === item.city).length === 0) {
          cities.push({province: item.province, city: item.city});
        }
      });
      this.provinces = provinces;
      this.cities = cities;
    });
  }

  getData() {
    this.getAll();
  }

  getAll() {
    this.data.plans().subscribe(res => {
      let movies = res.data;
      const codes = [];
      movies.forEach(item => {
        item.saleCinemas.forEach(code => {
          if (codes.indexOf(code) === -1) {
            codes.push(code);
          }
        });
      });
      console.log(codes);
      if (this.cinema) {
        movies = movies.filter(item => item.saleCinemas.indexOf(this.cinema.cinemaCode) !== -1);
      }
      this.movies = movies;
      this.slides.slideNext().then();
      this.getTops();
    });
    this.movieSvc.getComingsStatus().subscribe(res => {
      this.comings = res;
    });
  }

  getTops() {
    this.movieSvc.tops().subscribe(res => {
      const tops = [];
      const items = (() => {
        const movies = [];
        res.data.items[0].items.forEach(item => {
          movies.push(item.movieInfo);
        });
        return movies;
      })();
      items.forEach(item => {
        const target = this.movies.filter(i => item.movieName === i.movieName.replace(/^\s*|\s*$/g, '').split('（')[0])[0];
        if (target) {
          target._type = 1;
          tops.push(target);
        } else {
          item._type = 0;
          tops.push(item);
        }
      });
      this.tops = tops;
    });
  };

  slidePrev() {
    this.slides.slidePrev().then();
  }

  slideNext() {
    this.slides.slideNext().then();
  }

  link(movie) {
    const cinema = this.appSvc.currentCinema ? this.appSvc.currentCinema.cinemaCode : movie.saleCinemas[0];
    this.router.navigate(['/movie/item', movie.movieCode], {queryParams: {cinema}}).then();
  }

  async presentCinemasSelectorModal() {
    const modal = await this.modalController.create({
      showBackdrop: true,
      backdropDismiss: false,
      component: CinemasSelectorComponent,
      componentProps: {cinema: this.cinema},
      cssClass: 'cinemas-selector'
    });
    await modal.present();
    const {data} = await modal.onDidDismiss(); // 获取关闭传回的值
    if (data) {
      this.toastSvc.loading('加载中');
      this.cinemaSvc.find({code: data.code}).subscribe(res => {
        this.toastSvc.hide();
        this.login(res[0]);
      });
    }
  }

  menuItemOver(target, targetItem) {
    if (target === 'province') {
      this.filterCities = this.cities.filter(item => item.province === targetItem);
    }
    if (target === 'city') {
      this.filterCinemas = this.cinemas.filter(item => item.city === targetItem.city);
    }
    if (target === 'cinema') {
      if (!targetItem.show) {
        this.dialogSvc.show({content: '该影院暂未上线', cancel: '', confirm: '我知道了'}).subscribe();
        return false;
      }
      this.cinema = targetItem;
      this.login(targetItem);
    }
  }

  menuClosed(e) {
    console.log(e);
  }

  login(cinema) {
    if (cinema) {
      const form = {
        orgAlias: cinema.org.code,
        accountLoginName: cinema.org.username,
        accountLoginPassword: getPassword(cinema.org.pwd)
      };
      this.toastSvc.loading('加载中', 0);
      this.authSvc.login(form).subscribe(res => {
        this.toastSvc.hide();
        const loginStatus = {
          aliasList: [form.orgAlias],
          token: res.data.token,
          name: form.accountLoginName,
          staffName: res.data.staffName,
          password: form.accountLoginPassword,
          remember: true,
          cinema: res.data.cinemaDTOList[0],
          uidOrg: res.data.uidOrg,
          terminalCode: form.accountLoginName,
          uid: res.data.uid,
          roles: res.data.purviewList,
          isPosAuth: res.data.isPosAuth,
          isAdmin: res.data.isCreateByCloudUser
        };
        if (res.data.cinemaDTOList.length > 1) {
          loginStatus.cinema = res.data.cinemaDTOList.filter(item => item.cinemaCode === cinema.code)[0];
        }
        this.authSvc.updateLoginStatus(loginStatus);
        this.appSvc.updateCinemaStatus(loginStatus.cinema);
      });
    }
  }

}
