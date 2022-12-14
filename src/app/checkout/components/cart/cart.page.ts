import {Component, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, Input} from '@angular/core';
import {CheckoutService} from '../../checkout.service';
import {groupSame} from '../../../shopping-cart.utils';
import {ToastService} from '../../../@theme/modules/toast';
import {SnackbarService} from '../../../@core/utils/snackbar.service';
import {AuthService} from '../../../auth/auth.service';

@Component({
  selector: 'app-checkout-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss']
})
export class CheckoutCartPage implements OnInit, OnDestroy, AfterViewInit {
  @Input() businessType;
  detail;
  groupProduct = [];
  shoppingCartInfoSubscribe;
  products = [];
  coupons = [];
  points = [];
  cards = [];
  @ViewChild('ionContent', {static: false}) private ionContent: any;
  @Input() takeGoodsType;
  @Output() takeGoodsTypeChange = new EventEmitter();
  @Output() askForHideActivities = new EventEmitter();
  count = {
    product: {
      total: 0,
      discount: 0,
      amount: 0,
      point: 0
    },
    ticket: {
      total: 0,
      discount: 0,
      amount: 0,
      point: 0
    },
    point: {
      total: 0,
      discount: 0,
      amount: 0,
      point: 0
    },
    coupon: {
      total: 0,
      discount: 0,
      amount: 0,
      point: 0
    },
    card: {
      total: 0,
      discount: 0,
      amount: 0,
      point: 0
    }
  };

  constructor(private checkoutSvc: CheckoutService,
              private snackbarSvc: SnackbarService,
              private toastSvc: ToastService,
              public authSvc: AuthService) {
  }

  ngAfterViewInit() {
  }

  get size() {
    const width = document.body.offsetWidth;
    let size = 3;
    if (width < 1400) {
      size = 4;
    }
    return size;
  }

  initCount() {
    this.count = {
      product: {
        total: 0,
        discount: 0,
        amount: 0,
        point: 0
      },
      ticket: {
        total: 0,
        discount: 0,
        amount: 0,
        point: 0
      },
      point: {
        total: 0,
        discount: 0,
        amount: 0,
        point: 0
      },
      coupon: {
        total: 0,
        discount: 0,
        amount: 0,
        point: 0
      },
      card: {
        total: 0,
        discount: 0,
        amount: 0,
        point: 0
      }
    };
  }

  counting(target, item) {
    if (target === 'point') {
      this.count[target].total = this.count[target].total + item.pointsChangePrice;
      this.count[target].amount = this.count[target].amount + item.pointsChangePrice;
      this.count[target].discount = this.count[target].total - this.count[target].amount;
      this.count[target].point = this.count[target].point + item.pointsChangePoints;
    } else {
      this.count[target].total = this.count[target].total + item.cartResPriceOri;
      this.count[target].amount = this.count[target].amount + item.cartResPrice;
      this.count[target].discount = this.count[target].total - this.count[target].amount;
    }
  }

  /*cartResType 0:????????????,1:??????,2:????????????,3:???????????????,4:????????????*/
  grouping() {
    this.initCount();
    const products = [];
    const coupons = [];
    const points = [];
    const cards = [];
    if (this.detail) {
      this.detail.posShopCartResDTOList.forEach(item => {
        if ((item.cartResType === 0 || item.cartResType === 1 || item.cartResType === 4) && item.isPointsPay !== 1) {
          products.push(item);
          this.counting('product', item);
        }
        if (item.cartResType === 2 && item.isPointsPay !== 1) {
          coupons.push(item);
          this.counting('coupon', item);
        }
        if (item.cartResType === 3 && item.isPointsPay !== 1) {
          cards.push(item);
          this.counting('card', item);
        }
        if (item.isPointsPay === 1) {
          points.push(item);
          this.counting('point', item);
        }
      });
      this.detail.posShopCartPlanSeatDTOList.forEach(item => {
        const servicePrice = item.acCartSeatPriceService ? item.acCartSeatPriceService : item.cartSeatPriceService;
        const supplyPrice = item.cartSeatPriceSupplyValue;
        const secondSupplyValue = item.secondSupplyValue ? item.secondSupplyValue : 0;
        this.count.ticket.total = this.count.ticket.total + item.cartSeatPriceOri + servicePrice;
        this.count.ticket.amount = this.count.ticket.amount + item.cartSeatPrice + item.cartSeatPriceService - supplyPrice - secondSupplyValue;
        this.count.ticket.discount = this.count.ticket.total - this.count.ticket.amount;
      });
    }
    this.products = groupSame(products);
    this.coupons = groupSame(coupons);
    this.points = groupSame(points);
    this.cards = groupSame(cards);
    if (points.length > 0) {
      this.askForHideActivities.next(true);
    }
  }

  // ????????????????????????????????????
  change(e) {
    let takeType = 0;
    if (e.detail.checked) {
      takeType = 2;
    }
    const takeGoodsTypeInfo: any = {};
    takeGoodsTypeInfo.takeType = takeType; // ?????????????????????0 ??????????????????1 ???????????????2.??????
    takeGoodsTypeInfo.takeMobile = '';  // ????????????????????????
    takeGoodsTypeInfo.takePosition = ''; // ????????????????????????
    takeGoodsTypeInfo.takeTime = '';   // ????????????????????????

    const params: any = {};
    params.uidShopCart = this.detail.uidShopCart;
    params.takeGoodsTypeInfo = takeGoodsTypeInfo;
    this.toastSvc.loading('????????????...', 0);
    this.checkoutSvc.changePosShopCartTakeGoodsType(params).subscribe(res => {
      this.toastSvc.hide();
      if (res.status.status === 0) {// ??????
      } else {
        this.snackbarSvc.show('??????????????????????????????' + res.status.msg2Client);
      }
    });
  }

  ngOnInit() {
    this.shoppingCartInfoSubscribe = this.checkoutSvc.getShoppingCartDetail().subscribe(res => {
      if (res) {
        if (res.notifier && res.notifier.indexOf('cart') !== -1) {
          // console.log('cart-?????????????????????');
          this.detail = res.detail;
          this.grouping();
        } else {
          // console.log('cart-???????????????????????????');
        }
      } else {
        // console.log('???????????????????????????');
        this.resetData();
        this.grouping();
      }
    });
  }

  // ???????????????
  resetData() {
    this.detail = null;
    this.grouping();
  }

  ngOnDestroy() {
    if (this.shoppingCartInfoSubscribe) {
      this.resetData();
      this.shoppingCartInfoSubscribe.unsubscribe();
    }
  }
}
