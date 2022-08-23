import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {cinemas} from './cinemas';
import {movies} from './movies';
import {prefix} from '../@core/config';

import { Observable } from 'rxjs';


// const prefix = 'https://oms.ai-datas.com';

// const prefix = 'http://cms-mvs.bihetech.com:8112';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public cinemas: any[] = cinemas;
  public movies: any[] = movies;

  constructor(@Inject('PREFIX_URL') private prefixUrl, private http: HttpClient) {
  }

  plans(): Observable<any> {
    const data = {
      chanelCode: 'net',
      publicKey: 'net888'
    };
    return this.http.post('/omsOpenService-api/webSale/movie/wsMovieQuery', {data});
  }

  moviePlans(data): Observable<any> {
    data.dataType = 1;
    data.needActPrice = '1';
    return this.http.post('/omsOpenService-api/webSale/plan/wsCinemePlanQuery', {data});
  }

  test(data): Observable<any> {
    return this.http.post('https://www.bihetech.com/plans/planShowService-api/planShow/showList', {data});
  }

  code(data): Observable<any> {
    return this.http.post(prefix + '/oms-api/wechatMiniApps/getNetMovieSaleCode', {data});
  }

  public getMovies(): any[] {
    return this.movies;
  }

  public getMovieById(id: number): any {
    return this.movies[id];
  }

  public getCinemas(): any[] {
    return this.cinemas;
  }

  public getCinemaByCode(code: string): any[] {
    return this.cinemas[code];
  }
}
