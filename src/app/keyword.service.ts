import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class KeywordService {

  constructor(@Inject('PREFIX_URL') private PREFIX_URL, private http: HttpClient) {
  }

  items(): Observable<any> {
    return this.http.get(this.PREFIX_URL + '/keywords');
  }

  item(id): Observable<any> {
    return this.http.get(this.PREFIX_URL + '/keywords/' + id);
  }

  find(body): Observable<any> {
    return this.http.get(this.PREFIX_URL + '/keywords', {params: body});
  }

  qs(params): Observable<any> {
    return this.http.get(this.PREFIX_URL + `/keywords?${params}`, {});
  }

  count(body?): Observable<any> {
    return this.http.get(this.PREFIX_URL + '/keywords/count', {params: body});
  }

  qsCount(params): Observable<any> {
    return this.http.get(this.PREFIX_URL + `/keywords/count?${params}`, {});
  }

  create(body): Observable<any> {
    return this.http.post(this.PREFIX_URL + '/keywords', body);
  }

  update(id, body): Observable<any> {
    return this.http.put(this.PREFIX_URL + '/keywords/' + id, body);
  }

  delete(id): Observable<any> {
    return this.http.delete(this.PREFIX_URL + '/keywords/' + id);
  }

}
