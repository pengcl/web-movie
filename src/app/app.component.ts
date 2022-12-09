import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { MovieService } from './movie/movie.service';
import { ShoppingCartService } from './shopping-cart.service';
import { LogService } from './@core/utils/log.service';

declare let qq: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private router: Router,
              private appSvc: AppService,
              private authSvc: AuthService,
              private movieSvc: MovieService,
              private cartSvc: ShoppingCartService,
              private logSvc: LogService) {
    const geolocation = new qq.maps.Geolocation('PDBBZ-2NVWV-7GAPA-UKVP5-YED6S-FRB6L', 'danius');
    geolocation.getLocation((res) => {
      this.appSvc.updatePositionStatus(res);
    }, (err) => {
      this.appSvc.updatePositionStatus({province: null, city: null});
    });
    movieSvc.getComings().subscribe(res => {
      movieSvc.updateComings(res.data.moviecomings);
    });
    this.authSvc.getLoginStatus().subscribe(res => {
      if (res) {
        cartSvc.createEmptyCart().then();
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.logSvc.log('浏览');
      }
    });
  }
}
