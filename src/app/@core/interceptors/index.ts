import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptors} from './jwt.interceptors';
import {ErrorInterceptor} from './error.interceptors';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {PaginatorInterceptors} from './paginator.interceptors';

export const INTERCEPTORS = [
    {provide: MatPaginatorIntl, useValue: PaginatorInterceptors()},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptors, multi: true}
];
