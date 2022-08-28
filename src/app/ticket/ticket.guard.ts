import {Injectable, NgZone} from '@angular/core';
import {SnackbarService} from '../@core/utils/snackbar.service';
import {CanDeactivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {TicketIndexPage} from './index/index.page';
import {ShoppingCartService} from '../shopping-cart.service';
import {AppService} from '../app.service';
import {AuthService} from '../auth/auth.service';
import {MemberService} from '../@theme/modules/member/member.service';
import {TicketService} from './ticket.service';
import {checkRedirect} from '../@core/utils/extend';
import {countMemberSeat, getEntityValue} from '../@theme/modules/member/member.extend';

@Injectable()
export class TicketGuard implements CanDeactivate<TicketIndexPage> {
  constructor(private zone: NgZone,
              private snackbarSvc: SnackbarService,
              private appSvc: AppService,
              private authSvc: AuthService,
              private memberSvc: MemberService,
              private cartSvc: ShoppingCartService,
              private ticketSvc: TicketService) {
  }
  /*getSceneCount(card): Promise<any> {
    return new Promise((resolve, reject) => {
      this.memberSvc.sceneCount(card.uidMemberCard, card.uidCardLevel, card.cardNo, this.ticketSvc.currentInfo).subscribe(res => {
        resolve(Number(res.data));
      });
    });
  }*/

  submitSeat(seats): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.cartSvc.submit(this.cartSvc.creatShoppingCartInputDto(seats)).subscribe(res => {
        if (res.status.status === 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  submit(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const seats = [];
      const selected = this.ticketSvc.currentSelected;
      for (const uid in selected) {
        if (selected[uid]) {
          seats.push(selected[uid]);
        }
      }
      if (seats.length > 0) {
        const currentMember= this.memberSvc.currentMember;
        if(currentMember && currentMember.card){
          const card = currentMember.card
          const memberSeatCount = countMemberSeat(selected);
          const dayLimit = Number(getEntityValue(card.cardParamEntityList, 'dayLimit')); // 当日限购数量
          const sceneLimit = Number(getEntityValue(card.cardParamEntityList, 'salesLimit')); // 当前场次限购数量
          const movieSaleLimit = Number(getEntityValue(card.cardParamEntityList, 'movieSaleLimit')); // 当前影片限购数量
          const countToday = Number(card.totalSaleTicketCountToday);
          if (memberSeatCount) {
            if (dayLimit > 0 && countToday + memberSeatCount > dayLimit) {
              this.snackbarSvc.show('当前会员卡购票已超出每日限购折扣票数，无法继续使用优惠。');
              resolve(false);
            }
            const sceneCount = Number(card.curPosResourctTicketCount);
            console.log('sceneCount=' + sceneCount);
            if (sceneLimit > 0 && sceneCount + memberSeatCount > sceneLimit) {
              this.snackbarSvc.show('当前会员卡购票已超出当场限购折扣票数，无法继续使用折扣。');
              resolve(false);
            }
          }
          const movieBuyCount = Number(card.movieBuyCount);
          console.log('movieBuyCount=' + movieBuyCount);
          if (movieSaleLimit > 0 && movieBuyCount + seats.length > movieSaleLimit) {
            this.snackbarSvc.show('当前会员卡在本影片限购' + movieSaleLimit + '张，已购' + movieBuyCount + '张，此单累计已超限额。');
            resolve(false);
          }
        }
        resolve(await this.submitSeat(seats));
      } else {
        return resolve(true);
      }
    });
  }

  async canDeactivate(ticketIndexPage: TicketIndexPage,
                      route: ActivatedRouteSnapshot,
                      currentState: RouterStateSnapshot,
                      nextState?: RouterStateSnapshot) {
    if (nextState.url.indexOf('/shoppingCart/index') !== -1 ||
      nextState.url.indexOf('/checkout/index') !== -1 ||
      nextState.url.indexOf('/product/index') !== -1 ||
      nextState.url.indexOf('/ticket/index') !== -1) {
      return await this.submit();
    } else if (nextState.url.indexOf('/auth') !== -1) {
      return true;
    } else {
      const res = await checkRedirect(this.cartSvc);
      if (res.status) {
        return await this.memberSvc.remove();
      } else {
        if (res.error.seats) {
          this.snackbarSvc.show('您已经选择了座位，无法切换页面', 2000);
        }
        return false;
      }
    }
  }
}
