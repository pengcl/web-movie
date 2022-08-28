import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {ThemeModule} from '../../@theme/theme.module';
import {CheckoutIndexPage} from './index.page';
import {CheckoutActivitiesPage} from '../components/activities/activities.page';
import {CheckoutCartPage} from '../components/cart/cart.page';
import {CheckoutCheckPage} from '../components/check/check.page';
import {CheckoutMemberCardPayComponent} from '../entryComponents/memberCard/pay/memberCardPay.component';
import {CheckoutMemberCardCardComponent} from '../entryComponents/memberCard/card/card.component';

@NgModule({
  imports: [
    ThemeModule,
    IonicModule,
    RouterModule.forChild([{path: '', component: CheckoutIndexPage}])
  ],
  declarations: [
    CheckoutIndexPage,
    CheckoutCartPage,
    CheckoutCheckPage,
    CheckoutActivitiesPage,
    CheckoutMemberCardPayComponent,
    CheckoutMemberCardCardComponent
  ],
  entryComponents: [
    CheckoutMemberCardPayComponent,
    CheckoutMemberCardCardComponent
  ]
})
export class CheckoutIndexPageModule {
}
