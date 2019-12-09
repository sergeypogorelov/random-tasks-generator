import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { urlFragments } from '../core/constants/url-fragments';

import { GameComponent } from './game.component';
import { SelectPersonComponent } from './select-person/select-person.component';
import { GetTasksComponent } from './get-tasks/get-tasks.component';

const routes: Routes = [
  {
    path: '',
    component: GameComponent
  },
  {
    path: urlFragments.gameChilds.selectPerson,
    component: SelectPersonComponent
  },
  {
    path: urlFragments.gameChilds.getTasks,
    component: GetTasksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule {}
