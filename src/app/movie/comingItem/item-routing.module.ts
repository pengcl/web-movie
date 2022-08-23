import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovieComingItemPage } from './item.page';

const routes: Routes = [
  {
    path: '',
    component: MovieComingItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovieComingItemRoutingModule {}
