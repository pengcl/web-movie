import {Component} from '@angular/core';
import {AppService} from './app.service';
import {AuthService} from './auth/auth.service';
import {MovieService} from './movie/movie.service';
import {ShoppingCartService} from './shopping-cart.service';

declare let qq: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private appSvc: AppService,
              private authSvc: AuthService,
              private movieSvc: MovieService,
              private cartSvc: ShoppingCartService) {
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
  }
}
