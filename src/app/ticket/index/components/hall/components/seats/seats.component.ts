import {
  Component,
  Input,
  NgZone,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  Output,
  EventEmitter
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';
import {fromEvent} from 'rxjs';
import {CacheService} from '../../../../../../@core/utils/cache.service';
import {DialogService} from '../../../../../../@theme/modules/dialog';
import {ModalController} from '@ionic/angular';
import {ToastService} from '../../../../../../@theme/modules/toast';
import {ShoppingCartService} from '../../../../../../shopping-cart.service';
import {SeatsService} from './seats.service';
import {AuthService} from '../../../../../../auth/auth.service';
import {AppService} from '../../../../../../app.service';
import {TicketService} from '../../../../../ticket.service';
import {MouseService} from './mouse.service';

import {
  COUNTS,
  getMost,
  getCounts,
  getScale,
  getStyle,
  getRegion,
  isNeedMember,
  containMemberLevel,
  getSelectedFromShoppingCart
} from './seats.extend';

import {getIndex, unique} from '../../../../../../@core/utils/extend';
import {Router} from '@angular/router';


function clearEventBubble(e) {
  e.stopPropagation();
  e.preventDefault();
}

function formatFloors(arr) {
  if (arr.length > 0) {
    if (!arr[0]) {
      arr.shift();
      return formatFloors(arr);
    } else {
      return arr;
    }
  } else {
    return arr;
  }
}

@Component({
  selector: 'app-ticket-hall-seats',
  templateUrl: './seats.component.html',
  styleUrls: ['./seats.component.scss'],
  providers: [DatePipe]
})
export class TicketHallSeatsComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() didEnter;
  @Input() info;
  @Input() plan;
  @Input() member;
  ticketType = this.ticketSvc.currentTicketType;
  @Output() countsChange = new EventEmitter(JSON.parse(JSON.stringify(COUNTS)));
  @Output() selectChange = new EventEmitter();
  @Output() select = new EventEmitter();
  @Output() askForDeletes = new EventEmitter();
  @ViewChild('container', {static: false}) private container: ElementRef;
  @ViewChild('content', {static: false}) private content: ElementRef;
  seats;
  floors;
  regions;
  overSeat = null;
  scale = 1; // 缩放比例
  interval;

  layerStyle: any = {left: 0, top: 0, width: 0, height: 0};
  square = {left: 0, top: 0, right: 0, bottom: 0};
  mouseIsDown = false;
  isOpen = false; // 副屏状态
  clickFlag = false;
  subscribe;

  constructor(private zone: NgZone,
              private cdr: ChangeDetectorRef,
              private route: ActivatedRoute,
              private modalController: ModalController,
              private toastSvc: ToastService,
              private dialogSvc: DialogService,
              private appSvc: AppService,
              private authSvc: AuthService,
              private cacheSvc: CacheService,
              private shoppingCartSvc: ShoppingCartService,
              private seatsSvc: SeatsService,
              private ticketSvc: TicketService,
              private mouseSvc: MouseService,
              private router: Router) {
  }

  ngOnInit() {
    this.ticketSvc.getTicketTypeStatus().subscribe(res => {
      this.ticketType = res;
    });
    this.appSvc.getRenderStatus().subscribe(res => {
      if (res) {
        this.rendSeats(res);
      }
    });
    this.seatsSvc.getRefreshingStatus().subscribe(res => {
      if (res && this.subscribe) {
        this.subscribe.unsubscribe();
      }
    });
  }

  initSquare() {
    this.square = {left: 0, top: 0, right: 0, bottom: 0};
    this.layerStyle = {left: 0, top: 0, width: 0, height: 0};
  }

  ngAfterViewInit() {
    fromEvent(window, 'resize').subscribe((event) => {
      const most = getMost(this.seats);
      setTimeout(() => {
        this.scale = getScale(this.container, most);
      });
    });
    this.mouseSvc.getElementsStatus().subscribe(res => {
      if (res.status) {
        this.getMouseSelected(res.selected, res.calculate);
      }
    });
    this.appSvc.fullscreenStatus.subscribe(res => {
      setTimeout(() => {
        const most = getMost(this.seats);
        this.scale = getScale(this.container, most);
      }, 300);
    });
  }

  getMouseSelected(uidS, calculate) {
    const seats = [];
    uidS.forEach(uid => {
      this.seats.forEach(seat => {
        if (uid === seat.uid) {
          seat.mouseSelected = true;
          seats.push(seat);
        }
      });
    });
    const most = getMost(seats);
    this.getSeats(most, calculate);
  }

  getSeats(most, calculate) {
    const seats = this.seats.filter(seat => {
      const x = Number(seat.resSeatX);
      const y = Number(seat.resSeatY);
      const inSquare = (x >= most.left && x < most.right) && (y >= most.top && y < most.bottom);
      return inSquare && seat.resSeatSaleStatus !== -1;
    });
    this.getStyle(seats);
    if (calculate) {
      const selectableSeats = this.getSelectableSeats(seats);
      this.selectSeats(selectableSeats);
    }
  }

  getSelectableSeats(seats) {
    const currentSelected = this.ticketSvc.currentSelected;
    let selectableSeats = seats.filter(seat => {
      const undamaged = seat.status === 0;
      const unreserved = seat.resSeatReserve === 0;
      const unsold = seat.resSeatSaleStatus === 0;
      const owner = seat.resSeatReserve === 1 && seat.isOwned; // todo:确认是否重复判断
      const unselected = !(currentSelected[seat.uid]);
      const memberValid = this.checkRegion(seat, false);
      return unselected && memberValid && unsold && unreserved && undamaged && seat.resSeatSaleStatus !== -1 && !owner;
    });
    selectableSeats = unique(selectableSeats, 'uid');
    return selectableSeats;
  }

  getStyle(seats) {
    seats.forEach((item, index) => {
      const top = Number(item.style.top.replace('px', ''));
      const left = Number(item.style.left.replace('px', ''));
      if (index === 0) {
        this.square.left = left;
        this.square.top = top;
        this.square.right = left + 50;
        this.square.bottom = top + 50;
      } else {
        if (left < this.square.left) {
          this.square.left = left;
        }
        if (top < this.square.top) {
          this.square.top = top;
        }
        if (left > this.square.right - 50) {
          this.square.right = left + 50;
        }
        if (top > this.square.bottom - 50) {
          this.square.bottom = top + 50;
        }
      }
    });
    this.layerStyle = {
      left: this.square.left + 'px',
      top: this.square.top + 'px',
      width: (this.square.right - this.square.left) + 2 + 'px',
      height: (this.square.bottom - this.square.top) + 2 + 'px'
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.info && changes.info.currentValue !== changes.info.previousValue) {
      const info = changes.info.currentValue;
      let floors = [];
      let seats = [];
      if (info) {
        seats = info.seatList;
        this.regions = info.regionList;
        floors = formatFloors(formatFloors(JSON.parse(info.floorStr)).reverse()).reverse();
      }
      this.floors = floors;
      this.ticketSvc.updateRegionsStatus(this.regions);
      this.rendSeats(seats);
    }
    if (changes.didEnter && changes.didEnter.currentValue) {
      this.refresh();
      if (this.route.snapshot.queryParams.recovery) {
        this.recovery();
      }
    }
  }

  getCount(seats) {
    const counts = getCounts(seats);
    this.countsChange.next(counts);
  }

  getRegions(seats) {// 获取区域数据
    const regions = [];
    this.regions = regions;
    this.ticketSvc.updateRegionsStatus(this.regions);
    this.rendSeats(seats);
  }

  rendSeats(seats) {
    this.getCount(seats);
    const most = getMost(seats);
    this.scale = getScale(this.container, most);
    seats.forEach(seat => {
      seat.style = getStyle(seat, most);
      // seat.region = getRegion(seat, this.regions);
    });
    this.seats = seats;
  }

  // 已售
  async openSoldModal() {
  }

  // 跳转界面
  openRefundPage(data) {
    const pars = {
      billCode: data.billCode
    };
    this.zone.run(() => {
      this.toastSvc.loading('正在处理...', 3000);
      this.router.navigate([data.target], {queryParams: pars}).then(() => {
        this.toastSvc.hide();
      });
    });
  }

  recovery() {// 从预订中恢复会员，座位及票类等
  }

  // 预订
  async openBookModal() {
  }

  checkRegion(seat, showError) {
    let res = true;
    const selected = this.ticketSvc.currentSelected;
    if (isNeedMember(seat, this.regions, this.plan) && !selected[seat.uid]) {
      if (this.member) {
        if (!containMemberLevel(seat, this.member.card.uidCardLevel, this.regions)) {
          res = false;
          if (showError) {
            // this.snackbarSvc.show('当前会员等级不允许购买该专属座位。', 3000);
          }
        }
      } else {
        res = false;
        if (showError) {
          // this.snackbarSvc.show('该座位会员专属座位，请登陆相应等级会员。', 3000);
        }
      }
    }
    return res;
  }

  seatClick(seats) {
    this.selectSeats(seats);
  }

// resSeatSaleCh: 0
  // resSeatSaleStatus: -1|0;-1:已售
  // isOwned:0|1; 0:非本机锁,1;本机锁
  // status:-1|0; -1:不可销售 坏座,0:可销售
  // resSeatReserve:0|1|2; 0:可销售,1:锁定,2:预订
  selectSeats(seats) {// 选座
    if (seats.length === 1) {// 单座
      const seat = seats[0];
      if (seat.resSeatSaleStatus === -1) {// 已售
        // this.openSoldModal(seat).then();
        return false;
      }
      if (seat.status !== 0) {// 坏座
        return false;
      }
      if (seat.resSeatReserve !== 0) {// 锁定/预订
        if (seat.resSeatReserve === 1 && seat.isOwned) {
        } else if (seat.resSeatReserve === 2 && !seat.isOwned) {
          // this.openBookModal(seat).then();
          return false;
        } else if (seat.resSeatReserve === 1 && !seat.isOwned) {
          return false;
        }
      }
      if (!this.checkRegion(seat, true)) {
        return false;
      }
    }
    const otherSeats = [];
    seats.forEach(item => {
      item.selectable = true;
      if (!this.info.planAloneSell && item.resSeatTypeCode === 'seatType_ql') {
        if (item.seatBgStr.indexOf('left') !== -1) {
          const rightSeat = this.getRight(item); // 获取右座
          if (rightSeat) {// 查看右座是否可选
            rightSeat.selectable = true;
            otherSeats.push(rightSeat);
          } else {
            if (seats.length === 1) {
              this.dialogSvc.show({
                content: '因设置了情侣座不能单独销售，此情侣座有坏座所以不可销售，请选择其他座位！',
                confirm: '我知道了',
                cancel: ''
              }).subscribe();
            }
            item.selectable = false;
          }
        } else {
          const leftSeat = this.getLeft(item);
          if (leftSeat) {
            leftSeat.selectable = true;
            otherSeats.push(leftSeat);
          } else {
            if (seats.length === 1) {// 单选情侣座
              this.dialogSvc.show({
                content: '因设置了情侣座不能单独销售，此情侣座有坏座所以不可销售，请选择其他座位',
                confirm: '我知道了',
                cancel: ''
              }).subscribe();
            }
            item.selectable = false;
          }
        }
      }
    });
    seats = seats.concat(otherSeats);
    seats = seats.filter(seat => seat.selectable); // 去掉误选的不可单独销售及有坏座的情侣座
    seats = unique(seats, 'uid'); // 去重
    if (seats.length > 0) {
      this.select.next(seats);
    }
  }

  getLeft(seat) { // 获取情侣座左边的座位
    const index = getIndex(this.seats, 'uid', seat.uid);
    const leftSeat = this.seats[index - 1].status !== -1 ? this.seats[index - 1] : false;
    return leftSeat;
  }

  getRight(seat) { // 获取情侣座右边的座位
    const index = getIndex(this.seats, 'uid', seat.uid);
    const rightSeat = this.seats[index + 1].status !== -1 ? this.seats[index + 1] : false;
    return rightSeat;
  }

  mouseout() {
    this.overSeat = null;
  }

  mouseover(seat) {
    this.overSeat = seat;
  }

  mouseup(e) {
    this.mouseIsDown = false;
    const currentStatus = this.mouseSvc.currentStatus;
    currentStatus.calculate = true;
    this.mouseSvc.updateElementsStatus(currentStatus);
    this.mouseSvc.clearElements();
    this.initSquare();
  }

  mousemove(e) {
    this.open();
    if (!this.mouseIsDown) {
      return false;
    }
    const currentStatus = this.mouseSvc.currentStatus;
    currentStatus.end = {x: e.x, y: e.y};
    currentStatus.status = currentStatus.end.x - currentStatus.start.x > 10 || currentStatus.end.y - currentStatus.start.y > 10;
    this.mouseSvc.updateElementsStatus(currentStatus);
    if (currentStatus.status) {
      const target = e.target.parentElement.parentElement.parentElement.attributes;
      if (target['date-uid']) {
        if (currentStatus.selected[0]) {
          currentStatus.selected[1] = target['date-uid'].value;
        } else {
          currentStatus.selected[0] = target['date-uid'].value;
        }
      }
      this.mouseSvc.updateElementsStatus(currentStatus);
    }
  }

  mousedown(e) {
    this.mouseIsDown = true;
    clearEventBubble(e);
    const currentStatus = this.mouseSvc.currentStatus;
    currentStatus.status = false;
    currentStatus.start = {x: e.x, y: e.y};
    this.mouseSvc.updateElementsStatus(currentStatus);
  }

  refresh() {// 刷新座位
    if (!this.plan) {
      return false;
    }
    this.seatsSvc.updateRefreshingStatus(true);
    this.subscribe = this.seatsSvc.refresh({
      terminalCode: this.authSvc.currentTerminalCode,
      uidComp: this.appSvc.currentCinema.uidComp,
      uidField: this.plan.uidHall,
      uidPlan: this.plan.uidPlan,
      uidPosShopCart: this.shoppingCartSvc.currentCart
    }).subscribe(res => {

      // 同步座位图到info中 start
      const info = this.ticketSvc.currentInfo;
      info.seatList = res.data.seatList;
      this.ticketSvc.updateInfoStatus(info, true);
      // end

      this.seatsSvc.updateRefreshingStatus(false);
      this.toastSvc.hide();
      this.rendSeats(res.data.seatList);
      const seats = [];
      res.data.seatList.forEach(seat => {
        if ((seat.resSeatReserve === 1 || seat.resSeatReserve === 2) && seat.isOwned) {
          seats.push(seat);
        }
      });
      this.ticketSvc.addSelected(seats);
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    });
  }

  open() {
    /*if (this.isOpen) {
      return false;
    }
    this.isOpen = true;
    const url = location.origin + '/sub/ticket';
    const aidaShell = (window as any).aidaShell;
    if (aidaShell) {
      aidaShell.setSlaveScreenUrl(url);
    } else {
      window.open(url, '_blank');
    }*/
  }

}
