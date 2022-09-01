import {
  Component,
  ChangeDetectorRef,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {TicketHallSeatsComponent} from './components/seats/seats.component';
import {ToastService} from '../../../../@theme/modules/toast';
import {NgZone} from '@angular/core';

import {ShoppingCartService, AddItemsInputDto, SubmitItemsInputDto} from '../../../../shopping-cart.service';
import {AppService} from '../../../../app.service';
import {AuthService} from '../../../../auth/auth.service';
import {TicketService} from '../../../ticket.service';
import {IsOptionalPipe} from '../../../../pipes.pipe';
import {timer} from 'rxjs';
import {CodeComponent} from '../../../../@theme/entryComponents/code/code';
import {MatDialog} from '@angular/material/dialog';
import {checkRedirect, objectToArray, setTicketType} from '../../../../@core/utils/extend';

import {MemberService} from '../../../../@theme/modules/member/member.service';

@Component({
  selector: 'app-ticket-hall',
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.scss'],
  providers: [IsOptionalPipe]
})
export class TicketHallComponent implements OnDestroy {
  @Input() didEnter;
  @Input() userToken;
  @Input() ticketTypes;
  plan = this.ticketSvc.currentPlan;
  info = this.ticketSvc.currentInfo;
  selected = this.ticketSvc.currentSelected;
  member;
  counts = [];
  data = {
    plan: null,
    seats: [],
    data: null
  };
  @ViewChild('seats', {static: true}) public ticketHallSeatsComponent: TicketHallSeatsComponent;
  isFullscreen = false;
  currentRotate = false;
  @Output() rotate = new EventEmitter();
  subscribe: any = {};

  constructor(private route: ActivatedRoute,
              private router: Router,
              private cdr: ChangeDetectorRef,
              private zone: NgZone,
              private isOptionalPipe: IsOptionalPipe,
              private modalController: ModalController,
              public authSvc: AuthService,
              private appSvc: AppService,
              private toastSvc: ToastService,
              private dialog: MatDialog,
              private shoppingCartSvc: ShoppingCartService,
              private ticketSvc: TicketService,
              private memberSvc: MemberService) {
    this.subscribe.getMemberStatus = this.memberSvc.getMemberStatus().subscribe(res => {
      this.member = res;
      const selected = setTicketType(this.ticketSvc.currentSelected, this.ticketSvc.currentInfo, this.member, this.isOptionalPipe);
      this.ticketSvc.updateSelectedStatus(selected);
    });
    this.subscribe.getPlanStatus = ticketSvc.getPlanStatus().subscribe(res => {
      this.plan = res;
    });
    this.subscribe.getInfoStatus = ticketSvc.getInfoStatus().subscribe(res => {
      this.info = res;
      if (this.info) {
        const seats = [];
        this.info.seatList.forEach(seat => {
          if ((seat.resSeatReserve === 1 || seat.resSeatReserve === 2) && seat.isOwned) {
            seats.push(seat);
          }
        });
        this.ticketTypes = res ? res.ticketTypeList : [];
        this.getTicketType();
        this.ticketSvc.addSelected(seats);
      }
    });
  }

  typeChange(ticketType) {
    const isOptional = this.isOptionalPipe.transform(ticketType, this.member);
    if (isOptional) {// 判断是否可选
      this.ticketSvc.updateTicketTypeStatus(ticketType);
    }
  }

  /*getSeats() {
    const params = {
      planShowId: this.plan.planShowId,
      userToken: this.userToken
    };
    this.ticketSvc.getSeats(params).subscribe(res => {
      this.ticketSvc.updateInfoStatus(res.data);
    });
  }*/
  getTicketType() {
    let ticketType;
    if (this.ticketTypes && this.ticketTypes.length > 0) {
      const ticketTypes = [];
      this.ticketTypes.forEach(item => {
        const isOptional = this.isOptionalPipe.transform(item, this.member);
        if (isOptional) {
          ticketTypes.push(item);
        }
      });
      // uidTicketType
      ticketType = ticketTypes.filter(item => item.ticketTypeName === '标准票')[0];
      if (this.member) {
        ticketType = ticketTypes.filter(item => item.uidMemCardLevels)[0] || ticketType;
      }
      this.typeChange(ticketType);
    }
  }
  expand() {
    this.isFullscreen = !this.isFullscreen;
    this.appSvc.updateFullscreenStatus(this.isFullscreen);
  }

  setRotate() {
    this.currentRotate = !this.currentRotate;
    this.rotate.next(this.currentRotate);
  }

  countsChange(counts) {
    this.counts = counts;
  }

  select(seats) {
    const selected = [];
    const deselected = [];
    const ticketType = this.ticketSvc.currentTicketType;
    seats.forEach(seat => {
      if (!this.selected[seat.uid]) {
        seat.ticketType = ticketType;
        seat.levelPrice = seat.ticketType.levelPriceDTO.filter(item => {
          return seat.resSeatLevelCode === item.seatLevelCode;
        })[0];
        this.selected[seat.uid] = seat;
        selected.push(seat);
      } else {
        this.selected[seat.uid] = false;
        deselected.push(seat);
      }
    });
    // todo:很可疑
    this.ticketSvc.updateSelectedStatus(this.selected);
    if (selected.length > 0) {
      this.add(selected);
    }
    if (deselected.length > 0) {
      const isMouseSelected = deselected.filter(item => item.mouseSelected).length > 0;
      if (!isMouseSelected) {// 非框选
        this.delete(deselected);
      } else {
        deselected.forEach(item => {
          item.loading = false;
          this.selected[item.uid] = item;
        });
      }
    }
  }

  get selectedLength() {
    const selectedArray = objectToArray(this.selected);
    return selectedArray.length;
  }

  setLoadingStatus(seats, status) {
    seats.forEach(item => {
      item.loading = status;
    });
  }

  createAddItemInputDto(seats): AddItemsInputDto {
    return this.shoppingCartSvc.creatShoppingCartInputDto(seats);
  }

  add(seats) {// 锁座
    const ticketType = this.ticketSvc.currentTicketType;
    if (ticketType) { // 当有选择票券时才执行
      const dto = this.createAddItemInputDto(seats);
      // this.toastSvc.loading('加载中...', 0);
      this.appSvc.updateLoadingStatus(true);
      this.setLoadingStatus(seats, true);
      this.shoppingCartSvc.add(dto).subscribe(res => {
        this.setLoadingStatus(seats, false);
        this.appSvc.updateLoadingStatus(false);
        if (res.status.status !== 0) {
          seats.forEach(seat => {
            this.selected[seat.uid] = false;
          });
          this.ticketHallSeatsComponent.refresh();
        } else {
          seats.forEach(seat => {
            seat.resSeatReserve = 1;
            seat.isOwned = 1;
          });
          this.ticketSvc.updateReleaseTime(new Date(res.data.cartReleaseTime).getTime());
        }
        this.ticketSvc.updateSelectedStatus(this.selected);
        // this.ticketHallSeatsComponent.refresh();
      });
    }
  }

  delete(seats) {// 解除销座
    // const seatCodeList = [];
    seats.forEach(seat => {
      // seatCodeList.push(seat.resSeatCode);
      // todo:不支持批量删除；
      // this.toastSvc.loading('加载中...', 0);
      this.setLoadingStatus(seats, true);
      this.appSvc.updateLoadingStatus(true);
      this.shoppingCartSvc.del({
        resType: 1,
        seatCodeList: [seat.resSeatCode],
        uidResource: seat.uid,
        uidResourcePlan: this.info.uidResource,
        uidShopCart: this.shoppingCartSvc.currentCart
      }).subscribe(res => {
        this.setLoadingStatus(seats, false);
        this.appSvc.updateLoadingStatus(false);
        if (res.status.status !== 0) {
          seats.forEach(item => {
            this.selected[seat.uid] = item;
          });
          this.ticketHallSeatsComponent.refresh();
        } else {
          seats.forEach(item => {
            item.resSeatReserve = 0;
            item.isOwned = 0;
          });
          // this.ticketSvc.updateReleaseTime(new Date(res.data.cartReleaseTime).getTime());
        }
        this.ticketSvc.updateSelectedStatus(this.selected);
        // this.ticketHallSeatsComponent.refresh();
      });
    });
  }

  deletes() {// 解除销座
    if (this.appSvc.currentLoading) {
      return false;
    }
    const seatCodeList = [];
    for (const key in this.selected) {
      if (this.selected[key]) {
        seatCodeList.push(this.selected[key].resSeatCode);
      }
    }
    this.toastSvc.loading('加载中...', 0);
    this.shoppingCartSvc.unlocks().subscribe(res => {
      if (res.status && res.status.status === 0) {
        this.selected = {};
        // this.createBlankShoppingCart();
      }
      this.ticketSvc.updateSelectedStatus(this.selected);
      this.ticketHallSeatsComponent.refresh();
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    });
  }

  openDialog(data): void {
    const dialogRef = this.dialog.open(CodeComponent, {
      width: '400px',
      maxWidth: '400px',
      data
    });
  }

  showCode(movieCode) {
    this.openDialog({movieCode, cinemaCode: this.route.snapshot.queryParams.cinema});
  }

  submit() {
    // this.showCode(this.route.snapshot.queryParams.movie);
    console.log('submit');
    console.log(this.selected);

    const seats = [];
    for (const uid in this.selected) {
      if (this.selected[uid]) {
        seats.push(this.selected[uid]);
      }
    }
    console.log(seats);
    if (seats.length > 0) {
      this.router.navigate(['/checkout/index'], {
        queryParams: {
          uidShopCart: this.shoppingCartSvc.currentCart,
          businessType: 'SALE'
        }
      }).then(()=>{
        console.log('go');
      });
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    for (const key in this.subscribe) {
      if (this.subscribe[key]) {
        this.subscribe[key].unsubscribe();
      }
    }
  }

}
