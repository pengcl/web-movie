import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class CodeService {

  constructor(@Inject('PREFIX_URL') private PREFIX_URL, private http: HttpClient) {
  }

  get(): Observable<any> {
    return this.http.post(this.PREFIX_URL + '/api/WXQRCode/GetShareCode_TuoKe', {});
  }
}
