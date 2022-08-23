import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class OrgService {

  constructor(@Inject('PREFIX_URL') private prefixUrl, private http: HttpClient) {
  }

  find(body): Observable<any> {
    return this.http.get(this.prefixUrl + '/orgs', {params: body});
  }

  count(body?): Observable<any> {
    return this.http.get(this.prefixUrl + '/orgs/count', {params: body});
  }

  create(body): Observable<any> {
    return this.http.post(this.prefixUrl + '/orgs', body);
  }

  update(id, body): Observable<any> {
    return this.http.put(this.prefixUrl + '/orgs/' + id, body);
  }

  delete(id): Observable<any> {
    return this.http.delete(this.prefixUrl + '/orgs/' + id);
  }

}
