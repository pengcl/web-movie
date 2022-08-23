import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovieListPage } from './list.page';

const routes: Routes = [
  {
    path: '',
    component: MovieListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovieListRoutingModule {}
