import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { urlFragments } from '../core/constants/url-fragments';

import { GameComponent } from './game.component';
import { SelectPersonComponent } from './select-person/select-person.component';
import { GetTasksComponent } from './get-tasks/get-tasks.component';
import { CompleteTasksComponent } from './complete-tasks/complete-tasks.component';

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
  },
  {
    path: urlFragments.gameChilds.completeTasks,
    component: CompleteTasksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule {}
