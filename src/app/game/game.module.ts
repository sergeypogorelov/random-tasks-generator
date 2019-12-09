import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { GameRoutingModule } from './game-routing.module';

import { GameComponent } from './game.component';
import { SelectPersonComponent } from './select-person/select-person.component';
import { GetTasksComponent } from './get-tasks/get-tasks.component';

@NgModule({
  declarations: [GameComponent, SelectPersonComponent, GetTasksComponent],
  imports: [CommonModule, SharedModule, GameRoutingModule]
})
export class GameModule {}
