import {Component, Input} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: 'footer.html',
  styleUrls: ['footer.scss']
})
export class FooterComponent {
  @Input() scrollTop;
  user = null;
  tip;

  constructor(private authSvc: AuthService) {
    authSvc.getLoginStatus().subscribe(res => {
      this.user = res ? authSvc.currentUser : null;
    });
    this.tip = this.getTip();
  }

  getTip() {
    let tip;
    let date = new Date();
    if (date.getHours() >= 0 && date.getHours() < 12) {
      tip = '上午好！';
    } else if (date.getHours() >= 12 && date.getHours() < 18) {
      tip = '下午好！';
    } else {
      tip = '晚上好！';
    }
    return tip;
  }

  logout() {
    this.authSvc.logout();
  }

}
