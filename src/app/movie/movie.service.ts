import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Subject, BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class MovieService {
  private comingsStatus: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(@Inject('PREFIX_URL') private prefixUrl, private http: HttpClient) {
  }

  items(): Observable<any> {
    return this.http.get(this.prefixUrl + '/movies');
  }

  item(id): Observable<any> {
    return this.http.get(this.prefixUrl + '/movies/' + id);
  }
  tops(): Observable<any> {
    return this.http.get('/mtime/community/top_list/query.api?tt=' + new Date().getTime() + '&type=1&pageIndex=1&pageSize=50');
  }
  getComings(): Observable<any> {
    return this.http.get('/mtime/ticket/schedule/movie/coming_list.api?locationId=290');
  }

  getComingItem(movieId): Observable<any> {
    return this.http.get('/mtime/library/movie/detail.api?tt=' + new Date().getTime() + '&movieId=' + movieId + '&locationId=290');
  }

  find(body): Observable<any> {
    return this.http.get(this.prefixUrl + '/movies', {params: body});
  }

  count(body?): Observable<any> {
    return this.http.get(this.prefixUrl + '/movies/count', {params: body});
  }

  create(body): Observable<any> {
    return this.http.post(this.prefixUrl + '/movies', body);
  }

  update(id, body): Observable<any> {
    return this.http.put(this.prefixUrl + '/movies/' + id, body);
  }

  delete(id): Observable<any> {
    return this.http.delete(this.prefixUrl + '/movies/' + id);
  }

  getComingsStatus(){
    return this.comingsStatus.asObservable();
  }

  updateComings(comings){
    this.comingsStatus.next(comings);
  }

}
