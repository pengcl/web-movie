import {Component, Input} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {KeywordService} from '../../../keyword.service';
import {DialogService} from '../../modules/dialog';

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
  keywords = [];

  constructor(private authSvc: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private keywordSvc: KeywordService,
              private dialogSvc: DialogService) {
    this.route.queryParamMap.subscribe(res => {
      this.searchKey = res['params'].searchKey;
    });
    authSvc.getLoginStatus().subscribe(res => {
      this.user = res ? authSvc.currentUser : null;
      this.tip = this.getTip();
    });
    keywordSvc.find({_limit: 9999}).subscribe(res => {
      this.keywords = res;
    });
  }

  search() {
    if (!this.searchKey) {
      this.dialogSvc.show({content: '请输入您要搜索的关键字！', cancel: '', confirm: '我知道了'}).subscribe();
      return false;
    }
    let isDisallow = false;
    this.keywords.forEach(item => {
      if (this.searchKey.indexOf(item.name) !== -1) {
        isDisallow = true;
      }
    });
    if (isDisallow) {
      this.dialogSvc.show({content: `您输入的内容存在非法字符"${this.searchKey}"`, cancel: '', confirm: '我知道了'}).subscribe();
      this.searchKey = '';
    } else {
      this.router.navigate(['/movie/list'], {queryParams: {searchKey: this.searchKey}}).then();
    }
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
