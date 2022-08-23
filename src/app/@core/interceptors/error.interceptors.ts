import { Injectable, NgZone } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { DialogService } from '../../@theme/modules/dialog';
import { SnackbarService } from '../utils/snackbar.service';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialogSvc: DialogService, private snackbarSvc: SnackbarService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(tap(
      res => this.handleResponse(res, req, next),
      err => this.handleResponse(err, req, next)
    ));
  }

  private handleResponse(res: any, req, next): void {
    if (typeof res.status === 'number') {
      if (res.status === 200) {
        if (res.body.status && res.body.status.status !== 0) {
          if (res.body.status.status === 401 || res.body.status.status === 403 || res.body.status.status === 411) {
            //this.authSvc.requestAuth();
          } else {
            if (res.body.status) {
              this.snackbarSvc.show(res.body.status.msg2Client, 3000);
            }
          }
        }
      } else {
        this.snackbarSvc.show('服务器内部错误，请稍后重试', 3000);
      }
    }
  }
}
