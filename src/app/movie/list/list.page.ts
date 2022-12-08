import {Component, OnInit, Input} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {MatDialog} from '@angular/material/dialog';
import {DataService} from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import {MovieService} from '../movie.service';
import {CodeComponent} from '../../@theme/entryComponents/code/code';
import {CinemaService} from '../../cinema/cinema.service';
import {getPassword} from '../../@core/utils/extend';
import {ToastService} from '../../@theme/modules/toast';
import {AuthService} from '../../auth/auth.service';
import {AppService} from '../../app.service';

const intersect = function (nums1, nums2) {
//将两个数组从小到大排序
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);
  let res = [];
  let key1 = 0, key2 = 0, index = 0;
//在两个指针不达边界的前提下不断推进
  while (key1 < nums1.length && key2 < nums2.length) {
//判断nums1[key1]与nums2[key2]的大小，分出大于小于等于三种情况
    if (nums1[key1] < nums2[key2]) key1++;
    else if (nums1[key1] > nums2[key2]) key2++;
    else {
      res[index++] = nums1[key1];
      key1++;
      key2++;
    }
  }
  return res;
};

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
  subscribe = {cinema: null};

  constructor(private popoverController: PopoverController,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private data: DataService,
              private cinemaSvc: CinemaService,
              private toastSvc: ToastService,
              private authSvc: AuthService,
              private appSvc: AppService,
              private movieSvc: MovieService) {
    this.route.queryParamMap.subscribe(res => {
      this.searchKey = res['params'].searchKey;
      if (res['params'].tab) {
        this.tab = res['params'].tab;
      }
      this.getData();
    });
    this.getCinemas();
  }

  ionViewDidEnter() {
    this.subscribe.cinema = this.appSvc.getCinemaStatus().subscribe(res => {
      this.cinema = res;
    });
  }

  ionViewDidLeave() {
    for (const key in this.subscribe) {
      if (this.subscribe[key]) {
        this.subscribe[key].unsubscribe();
      }
    }
  }

  getData() {
    this.getCinemas();
    this.movieSvc.getComingsStatus().subscribe(res => {
      this.comings = res;
    });
  };

  getCinemas() {
    this.cinemaSvc.find({_limit: 999, show: true}).subscribe(res => {
      this.cinemas = res;
      const codes = [];
      res.forEach(item => {
        codes.push(item.code);
      });
      this.data.plans().subscribe(res => {
        let movies = this.searchKey ? res.data.filter(item => item.movieName.indexOf(this.searchKey) !== -1) : res.data;
        movies = movies.filter(item => intersect(item.saleCinemas, codes).length > 0);
        this.movies = movies;
      });
      if (!this.cinema) {
        this.cinemas.find(item => item.code === '50010131');
        const cinema = this.cinemas.find(item => item.code === '50010131');
        this.login(cinema);
      }
    });
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
}
