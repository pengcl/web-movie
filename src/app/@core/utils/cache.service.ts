import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {Observable, of as observableOf, from as observableFrom} from 'rxjs';

@Injectable({providedIn: 'root'})
export class CacheService {
  aidaShell = (window as any).aidaShell;

  constructor(private storageSvc: StorageService) {
  }

  get(key): Observable<any> {
    if (this.aidaShell) {
      return new Observable((observe) => {
        return this.aidaShell.readDataFromCache((status, msg, data) => {
          if (status === 0) {
            observe.next(data);
          } else {
            observe.next(null);
          }
          observe.complete();
        }, key);
      });
    } else {
      return observableOf(this.storageSvc.get(key));
    }
  }

  set(key, value, callback?) {
    if (this.aidaShell) {
      this.aidaShell.saveDataToCache((status, err) => {
        if (callback) {
          callback(status);
        }
      }, key, value);
    } else {
      this.storageSvc.set(key, value);
      if (callback) {
        callback(0);
      }
    }
  }

  remove() {
  }

  clear() {
  }
}
