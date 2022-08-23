import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {CoreModule} from './@core/core.module';
import {ThemeModule} from './@theme/theme.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {MatDialogModule} from '@angular/material/dialog';
import {CurrencyPipe} from '@angular/common';
import {environment} from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot({
      mode: 'ios',
      hardwareBackButton: false
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    MatDialogModule,
    AppRoutingModule],
  providers: [
    {provide: 'PREFIX_URL', useValue: environment.prefixUrl},
    {provide: 'FILE_PREFIX_URL', useValue: environment.prefixUrl},
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }, CurrencyPipe],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
