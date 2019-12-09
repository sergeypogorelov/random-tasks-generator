import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { urlFragments } from '../core/constants/url-fragments';

import { GameComponent } from './game.component';
import { SelectPersonComponent } from './select-person/select-person.component';

const routes: Routes = [
  {
    path: '',
    component: GameComponent
  },
  {
    path: urlFragments.gameChilds.selectPerson,
    component: SelectPersonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule {}
