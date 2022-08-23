import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CinemaListPage } from './list.page';

const routes: Routes = [
  {
    path: '',
    component: CinemaListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CinemaListRoutingModule {}
