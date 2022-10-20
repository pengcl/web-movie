import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class CinemaService {

  constructor(@Inject('PREFIX_URL') private prefixUrl, private http: HttpClient) {
  }

  find(body): Observable<any> {
    body = body || {};
    body.show = true;
    return this.http.get(this.prefixUrl + '/cinemas', {params: body});
  }

  count(body?): Observable<any> {
    return this.http.get(this.prefixUrl + '/cinemas/count', {params: body});
  }

  create(body): Observable<any> {
    return this.http.post(this.prefixUrl + '/cinemas', body);
  }

  update(id, body): Observable<any> {
    return this.http.put(this.prefixUrl + '/cinemas/' + id, body);
  }

  delete(id): Observable<any> {
    return this.http.delete(this.prefixUrl + '/cinemas/' + id);
  }

}
