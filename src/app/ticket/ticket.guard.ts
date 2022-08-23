import {Injectable, NgZone} from '@angular/core';
import {CanDeactivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {TicketIndexPage} from './index/index.page';
import {ShoppingCartService} from '../shopping-cart.service';
import {AppService} from '../app.service';
import {AuthService} from '../auth/auth.service';
import {TicketService} from './ticket.service';
import {checkRedirect} from '../@core/utils/extend';

@Injectable()
export class TicketGuard implements CanDeactivate<TicketIndexPage> {
  constructor(private zone: NgZone,
              private appSvc: AppService,
              private authSvc: AuthService,
              private cartSvc: ShoppingCartService,
              private ticketSvc: TicketService) {
  }

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

  async canDeactivate(ticketIndexPage: TicketIndexPage,
                      route: ActivatedRouteSnapshot,
                      currentState: RouterStateSnapshot,
                      nextState?: RouterStateSnapshot) {
    if (nextState.url.indexOf('/shoppingCart/index') !== -1 ||
      nextState.url.indexOf('/checkout/index') !== -1 ||
      nextState.url.indexOf('/product/index') !== -1 ||
      nextState.url.indexOf('/ticket/index') !== -1) {
    } else if (nextState.url.indexOf('/auth') !== -1) {
      return true;
    } else {
      const res = await checkRedirect(this.cartSvc);
      if (res.status) {
      } else {
        return false;
      }
    }
  }
}
