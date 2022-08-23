import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovieAddPage } from './add.page';

const routes: Routes = [
  {
    path: '',
    component: MovieAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovieAddRoutingModule {}
