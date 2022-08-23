import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovieItemPage } from './item.page';

const routes: Routes = [
  {
    path: '',
    component: MovieItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovieItemRoutingModule {}
