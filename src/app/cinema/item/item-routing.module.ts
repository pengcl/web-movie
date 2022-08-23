import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CinemaItemPage } from './item.page';

const routes: Routes = [
  {
    path: '',
    component: CinemaItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CinemaItemRoutingModule {}
