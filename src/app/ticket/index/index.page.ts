import {Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {ToastService} from '../../@theme/modules/toast';
import {ShoppingCartService} from '../../shopping-cart.service';
import {AuthService} from '../../auth/auth.service';
import {TicketService} from '../ticket.service';

import {DatePipe} from '@angular/common';
import {RepairDatePipe} from '../../pipes.pipe';
import {NgZone} from '@angular/core';
import {AppService} from '../../app.service';

import {TicketHallComponent} from './components/hall/hall.component';
import {getPassword} from '../../@core/utils/extend';
import {CinemaService} from '../../cinema/cinema.service';

@Component({
  selector: 'app-ticket-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
  providers: [DatePipe, RepairDatePipe]
})
export class TicketIndexPage implements OnInit, OnDestroy {
  isFullscreen = false;
  show = false;
  date = new Date();
  loading = false;
  didEnter = false;
  @ViewChild('hallComponent', {static: false}) private hallComponent: TicketHallComponent;
  plan;
  interval;
  subscribe: any = {};
  plans;
  userToken;

  constructor(private route: ActivatedRoute,
              private zone: NgZone,
              private cdr: ChangeDetectorRef,
              private datePipe: DatePipe,
              private repairDatePipe: RepairDatePipe,
              private modalController: ModalController,
              private toastSvc: ToastService,
              private authSvc: AuthService,
              private appSvc: AppService,
              private shoppingCartSvc: ShoppingCartService,
              private cinemaSvc: CinemaService,
              private ticketSvc: TicketService) {
    this.subscribe.fullscreenStatus = appSvc.fullscreenStatus.subscribe(res => {
      this.isFullscreen = res;
    });
    this.subscribe.getPlanStatus = ticketSvc.getPlanStatus().subscribe(res => {
      this.planChange(res);
    });
    this.subscribe.getDateStatus = ticketSvc.getDateStatus().subscribe(res => {
      if (res && this.date !== res) {
        this.date = res;
        this.getPlans();
      }
    });
  }



  ngOnInit() {
  }

  getPlans() {
    this.loading = true;
    this.ticketSvc.plans({
      cinemaCode: this.appSvc.currentCinema.cinemaCode,
      uidComp: this.appSvc.currentCinema.uidComp,
      planDate: this.datePipe.transform(this.date, 'yyyy-MM-dd')
    }).subscribe(res => {
      this.loading = false;
      const nowTimeStamp = new Date().getTime(); // 当前时间戳
      if (res.status.status === 0) {
        res.data.forEach(plan => {
          const posPlanValidTimeStamp = plan.posPlanValidTime ?
            new Date(this.repairDatePipe.transform(plan.posPlanValidTime)).getTime() :
            new Date(this.repairDatePipe.transform(plan.posStartTime)).getTime(); // 影片开始时间戳
          plan.expired = posPlanValidTimeStamp - nowTimeStamp <= 0;
        });
      }
      res.data.sort((a, b) => {
        return new Date(a.posStartTime).getTime() - new Date(b.posStartTime).getTime();
      });
      this.ticketSvc.updatePlansStatus(res.data);
    });
  }

  login(cinema) {
    if(cinema){
      const form = {
        orgAlias: cinema.org.code,
        accountLoginName: cinema.org.username,
        accountLoginPassword: getPassword(cinema.org.pwd)
      };
      this.authSvc.login(form).subscribe(res => {
        const loginStatus = {
          aliasList: [form.orgAlias],
          token: res.data.token,
          name: form.accountLoginName,
          staffName: res.data.staffName,
          password: form.accountLoginPassword,
          remember: true,
          cinema: res.data.cinemaDTOList[0],
          uidOrg: res.data.uidOrg,
          terminalCode: form.accountLoginName,
          uid: res.data.uid,
          roles: res.data.purviewList,
          isPosAuth: res.data.isPosAuth,
          isAdmin: res.data.isCreateByCloudUser
        };
        if (res.data.cinemaDTOList.length > 1) {
          loginStatus.cinema = res.data.cinemaDTOList.filter(item => item.cinemaCode === cinema.code)[0];
        }
        this.authSvc.updateLoginStatus(loginStatus);
        this.appSvc.updateCinemaStatus(loginStatus.cinema);
        this.getPlans();
      });
    }
  }

  getSeats(params) {

  }

  ionViewDidEnter() {
    this.didEnter = true;
    this.ticketSvc.updateDateStatus(this.route.snapshot.queryParams.date);
    const cinemaCode = this.route.snapshot.queryParams.cinema;
    this.cinemaSvc.find({code:cinemaCode}).subscribe(res=>{
      this.login(res[0]);
    })
  }

  ionViewDidLeave() {
    this.didEnter = false;
  }

  planChange(plan) {
    console.log(plan);
    if (plan) { // 当前有排片
      if (!this.plan || (this.plan && this.plan.uidPlan !== plan.uidPlan)) {
        this.toastSvc.loading('', 0);
        this.ticketSvc.plan({
          terminalCode: '',
          uidComp: this.appSvc.currentCinema.uidComp,
          uidField: plan.uidHall,
          uidPlan: plan.uidPlan,
          uidPosShopCart: this.shoppingCartSvc.currentCart
        }).subscribe(res => {
          this.toastSvc.hide();
          const info = res.data;
          this.ticketSvc.updateInfoStatus(info);
        });
      }
    } else {// 当前没有排片，清空数据
      const info = null;
      this.ticketSvc.updateInfoStatus(info);
    }
    this.plan = plan;
  }

  reload() {
    console.log('reload');
    // this.getPlans();
  }

  ngOnDestroy() {
    for (const key in this.subscribe) {
      if (this.subscribe[key]) {
        this.subscribe[key].unsubscribe();
      }
    }
  }

}
