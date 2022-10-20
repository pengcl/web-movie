import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class UploadService {

  constructor(@Inject('PREFIX_URL') private PREFIX_URL, private http: HttpClient) {
  }

  items(): Observable<any> {
    return this.http.get(this.PREFIX_URL + '/upload/files');
  }

  item(id): Observable<any> {
    return this.http.get(this.PREFIX_URL + '/upload/files/' + id);
  }

  find(id): Observable<any> {
    return this.http.get(this.PREFIX_URL + '/upload/search/' + id);
  }

  count(): Observable<any> {
    return this.http.get(this.PREFIX_URL + '/upload/files/count');
  }

  upload(body): Observable<any> {
    return this.http.post(this.PREFIX_URL + '/upload', body);
  }

  update(id, body): Observable<any> {
    const form = new FormData();
    form.append('fileInfo', JSON.stringify(body));
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.PREFIX_URL + '/upload?id=' + id, form);
  }

  delete(id): Observable<any> {
    return this.http.delete(this.PREFIX_URL + '/upload/files/' + id);
  }
}
