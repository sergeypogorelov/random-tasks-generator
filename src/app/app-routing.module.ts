import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { urlFragments } from './core/constants/url-fragments';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: urlFragments.home
  },
  {
    path: urlFragments.home,
    loadChildren: './home/home.module#HomeModule'
  },
  {
    path: '**',
    loadChildren: './not-found/not-found.module#NotFoundModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
