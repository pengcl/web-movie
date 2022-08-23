import { Component, Input } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: 'header.html',
  styleUrls: ['header.scss']
})
export class HeaderComponent {
  @Input() scrollTop;
  @Input() name;
  user = null;
  tip;
  searchKey;

  constructor(private authSvc: AuthService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe(res => {
      this.searchKey = res['params'].searchKey;
    });
    authSvc.getLoginStatus().subscribe(res => {
      this.user = res ? authSvc.currentUser : null;
      this.tip = this.getTip();
    });
  }

  search() {
    this.router.navigate(['/movie/list'], {queryParams: {searchKey: this.searchKey}}).then();
  }

  getTip() {
    let tip = '';
    if (this.user) {
      let date = new Date();
      if (date.getHours() >= 0 && date.getHours() < 12) {
        tip = '上午好！' + this.user.username;
      } else if (date.getHours() >= 12 && date.getHours() < 18) {
        tip = '下午好！' + this.user.username;
      } else {
        tip = '晚上好！' + this.user.username;
      }
    }
    return tip;
  }

  logout() {
    this.authSvc.logout();
  }

}
