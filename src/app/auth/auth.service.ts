import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import { StorageService } from '../@core/utils/storage.service';

@Injectable({providedIn: 'root'})
export class AuthService {
  public loginRedirectUrl: string;
  private loginStatus = new BehaviorSubject<boolean>(!!this.currentUser);

  constructor(@Inject('PREFIX_URL') private prefixUrl,
              private http: HttpClient,
              private router: Router,
              private storage: StorageService) {
  }

  requestAuth(): any {
    if (this.router.url.indexOf('auth') !== -1) {
      return false;
    }
    if (this.loginRedirectUrl) {
      return false;
    }

    this.loginRedirectUrl = this.router.url;
    this.router.navigate(['/auth']).then();
  }

  login(body): Observable<any> {
    return this.http.post('/hook/apiService/login', {data: body});
  }

  register(body): Observable<any> {
    return this.http.post(this.prefixUrl + '/auth/local/register', body);
  }

  users(): Observable<any> {
    return this.http.get('api/users');
  }

  token(token?): any {
    if (token) {
      this.storage.set('token', JSON.stringify(token));
    } else if (token === null) {
      this.storage.remove('token');
    } else {
      const TOKEN = this.storage.get('token');
      if (TOKEN) {
        return JSON.parse(TOKEN);
      } else {
        return '';
      }
    }
  }

  get currentUser() {
    return this.storage.get('name');
  }

  get isLogged(): boolean {
    this.loginStatus.next(!!this.currentUser);
    return !!this.currentUser;
  }

  getLoginStatus(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }

  updateLoginStatus(data) {
    for (const key in data) {
      if (typeof data[key] === 'object') {
        this.storage.set(key, JSON.stringify(data[key]));
      } else {
        this.storage.set(key, data[key]);
      }
    }

    this.loginStatus.next(this.isLogged);
  }

  logout(): void {
    this.storage.remove('token');
    this.router.navigate(['/auth/login']).then();
  }

  get currentStaff() {
    return this.storage.get('staffName');
  }

  get currentRoles() {
    return JSON.parse(this.storage.get('roles'));
  }

  get currentUid() {
    return this.storage.get('uid');
  }

  get currentToken() {
    return this.storage.get('token');
  }

  get currentTerminalCode() {
    return this.storage.get('terminalCode');
  }

  get currentUidOrg() {
    return this.storage.get('uidOrg');
  }

  get remember() {
    return this.storage.get('remember');
  }

  get password() {
    return this.storage.get('password');
  }

  getCurrentUserOrgAlias() {
    return this.storage.get('aliasList');
  }

  role(code) {
    const roles = this.currentRoles;
    const isAdmin = this.isAdmin + '';
    if (roles) {
      if (code === '-1') {
        return true;
      }
      if (code === '702' && isAdmin === '1') {
        return false;
      }
      return roles.indexOf(code) !== -1;
    } else {
      this.storage.clear();
      this.router.navigate(['/auth/login']).then();
    }
  }

  get currentPosAuth() {
    return this.storage.get('isPosAuth');
  }

  get isAdmin() {
    return this.storage.get('isAdmin');
  }
}
