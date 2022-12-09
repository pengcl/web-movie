import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Injectable({providedIn: 'root'})
export class LogService {

  constructor(@Inject('PREFIX_URL') private PREFIX_URL,
              private http: HttpClient) {
  }

  items(): Observable<any> {
    return this.http.get(this.PREFIX_URL + '/logs');
  }

  item(id): Observable<any> {
    return this.http.get(this.PREFIX_URL + '/logs/' + id);
  }

  find(body): Observable<any> {
    return this.http.get(this.PREFIX_URL + '/logs', {params: body});
  }

  qs(params): Observable<any> {
    return this.http.get(this.PREFIX_URL + `/logs?${params}`, {});
  }

  count(body?): Observable<any> {
    return this.http.get(this.PREFIX_URL + '/logs/count', {params: body});
  }

  qsCount(params): Observable<any> {
    return this.http.get(this.PREFIX_URL + `/logs/count?${params}`, {});
  }

  create(body): Observable<any> {
    return this.http.post(this.PREFIX_URL + '/logs', body);
  }

  update(id, body): Observable<any> {
    return this.http.put(this.PREFIX_URL + '/logs/' + id, body);
  }

  delete(id): Observable<any> {
    return this.http.delete(this.PREFIX_URL + '/logs/' + id);
  }

  log(action, user?): void {
    const body = {
      url: window.location.href,
      // @ts-ignore
      ip,
      action,
      user: user ? user : null
    };
    this.create(body).subscribe();
  }

}
