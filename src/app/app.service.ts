import { Inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject, of as observableOf } from 'rxjs';

import { StorageService } from './@core/utils/storage.service';
import { AuthService } from './auth/auth.service';
import { HttpClient } from '@angular/common/http';
import {prefix,omsOpenService_prefix} from './@core/config';

// const prefix = 'http://10.0.0.114:8118';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  position;
  positionStatus: BehaviorSubject<any> = new BehaviorSubject<any>(this.currentPosition);
  public loginRedirectUrl: string;
  private loading = false;
  private seats;
  private settingStatus = new BehaviorSubject<any>(this.currentSettings);
  private cinemaStatus = new BehaviorSubject<any>(this.currentCinema);
  private renderStatus = new Subject<any>();
  private loadingStatus = new BehaviorSubject<any>(this.currentLoading);
  fullscreenStatus = new Subject<boolean>();

  constructor(@Inject('PREFIX_URL') private prefixUrl, private http: HttpClient, private zone: NgZone,
              private router: Router,
              private authSvc: AuthService,
              private storage: StorageService) {
  }

  getToken(cinemaCode): Observable<any> {
    const data = {
      cinemaCode,
      authCode: '12',
      pSign: '12',
      pSignType: 'ws1'
    };
    return this.http.post('/omsOpenService-api/webSale/user/wsGetAccessToken', {data});
  }
  login(data): Observable<any> {
    return this.http.post('/hook/apiService/login', {data});
  }
  config(data): Observable<any> {
    return this.http.post('/hook/apiService/config', {data});
  }

  get currentPosition() {
    return this.position;
  }

  updatePositionStatus(position) {
    this.position = position;
    this.positionStatus.next(this.position);
  }

  getPositionStatus() {
    return this.positionStatus.asObservable();
  }

  requestSetting() {
    if (this.router.url.indexOf('auth') !== -1) {
      return false;
    }
    if (this.loginRedirectUrl) {
      return false;
    }

    this.loginRedirectUrl = this.router.url;
    this.zone.run(() => {
      this.router.navigate(['/auth/login']).then();
    });
  }

  get currentSettings() {
    const settings = this.storage.get('systemSet');
    return JSON.parse(settings);
  }

  get currentCinema() {
    const cinema = this.storage.get('cinema');
    return JSON.parse(cinema);
  }

  get currentOrg() {
    return this.storage.get('uidOrg');
  }

  getSettingStatus(): Observable<any> {
    return this.settingStatus.asObservable();
  }

  getRenderStatus(): Observable<boolean> {
    return this.renderStatus.asObservable();
  }

  getLoadingStatus(): Observable<any> {
    return this.loadingStatus.asObservable();
  }

  getCinemaStatus(): Observable<any> {
    return this.cinemaStatus.asObservable();
  }

  get currentLoading() {
    return this.loading;
  }

  updateLoadingStatus(status: boolean) {
    this.loading = status;
    this.loadingStatus.next(this.loading);
  }

  updateFullscreenStatus(status: boolean) {
    this.fullscreenStatus.next(status);
  }

  updateSettingStatus(data) {
    this.storage.set('systemSet', JSON.stringify(data));
    this.settingStatus.next(this.currentSettings);
  }

  updateCinemaStatus(data) {
    this.storage.set('cinema', JSON.stringify(data));
    this.cinemaStatus.next(this.currentCinema);
  }

  updateRenderStatus(seats) {
    this.seats = seats;
    this.renderStatus.next(this.seats);
  }

  updateMac(mac) {
    this.storage.set('mac', mac);
  }

  get isSvcMixPay() {// 前台同一笔订单是否允许多张会员储值卡混合支付
    const mixPay = this.currentCinema.teminalList ?
        this.currentCinema.teminalList.filter(item => item.dicCode === 'teminalMemMixPay')[0] : null;
    return mixPay ? mixPay.dicValue === '1' : false;
  }

  get isBalancePay() {// 前台储值卡会员是否只允许余额支付
    const balancePay = this.currentCinema.teminalList ?
        this.currentCinema.teminalList.filter(item => item.dicCode === 'teminalMemPayOnly')[0] : null;
    return balancePay ? balancePay.dicValue === '1' : false;
  }
}
