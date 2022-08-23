import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'index',
    loadChildren: () => import('./index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'ticket',
    loadChildren: () => import('./ticket/ticket.module').then( m => m.TicketPageModule)
  },
  {
    path: 'movie/list',
    loadChildren: () => import('./movie/list/list.module').then( m => m.MovieListPageModule)
  },
  {
    path: 'movie/item/:id',
    loadChildren: () => import('./movie/item/item.module').then( m => m.MovieItemPageModule)
  },
  {
    path: 'movie/coming/:id',
    loadChildren: () => import('./movie/comingItem/item.module').then( m => m.MovieComingItemPageModule)
  },
  {
    path: 'movie/add',
    loadChildren: () => import('./movie/add/add.module').then( m => m.MovieAddPageModule)
  },
  {
    path: 'cinema/list',
    loadChildren: () => import('./cinema/list/list.module').then( m => m.CinemaListPageModule)
  },
  {
    path: 'cinema/list',
    loadChildren: () => import('./cinema/list/list.module').then( m => m.CinemaListPageModule)
  },
  {
    path: 'cinema/item/:code',
    loadChildren: () => import('./cinema/item/item.module').then( m => m.CinemaItemPageModule)
  },
  {
    path: 'cinema/item/:id',
    loadChildren: () => import('./cinema/item/item.module').then( m => m.CinemaItemPageModule)
  },
  {
    path: 'auth/login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.AuthLoginPageModule)
  },
  {
    path: 'auth/register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.AuthRegisterPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then( m => m.ContactPageModule)
  },
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
