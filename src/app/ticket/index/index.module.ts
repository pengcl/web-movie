import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {ThemeModule} from '../../@theme/theme.module';
import {TicketIndexPage} from './index.page';
import {TicketPlansComponent} from './components/plans/plans.component';
import {TicketPlansTypeFilmComponent} from './components/plans/components/type-film/type-film.component';
import {TicketPlansTypeHallComponent} from './components/plans/components/type-hall/type-hall.component';
import {TicketPlansTypeTimeComponent} from './components/plans/components/type-time/type-time.component';
import {TicketHallComponent} from './components/hall/hall.component';
import {TicketHallSeatsComponent} from './components/hall/components/seats/seats.component';
import {SeatComponent} from './components/hall/components/seats/seat/seat';

import {TimeHeightPipe} from '../ticket.pipe';

const PIPES = [TimeHeightPipe];

const COMPONENTS_DECLARATIONS = [
  TicketPlansComponent,
  TicketPlansTypeFilmComponent,
  TicketPlansTypeHallComponent,
  TicketPlansTypeTimeComponent,
  TicketHallComponent,
  TicketHallSeatsComponent,
  SeatComponent
];

const ENTRY_COMPONENTS_DECLARATIONS = [
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    IonicModule,
    RouterModule.forChild([{path: '', component: TicketIndexPage}])
  ],
  declarations: [
    TicketIndexPage,
    ...COMPONENTS_DECLARATIONS,
    ...ENTRY_COMPONENTS_DECLARATIONS,
    ...PIPES
  ],
  entryComponents: [...ENTRY_COMPONENTS_DECLARATIONS]
})
export class TicketIndexPageModule {
}
