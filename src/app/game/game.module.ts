import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { GameRoutingModule } from './game-routing.module';

import { GameStateService } from './game-state.service';
import { GameService } from './game.service';
import { GetTasksPageService } from './get-tasks/get-tasks-page.service';
import { CompleteTasksPageService } from './complete-tasks/services/complete-tasks-page.service';

import { GameComponent } from './game.component';
import { SelectPersonComponent } from './select-person/select-person.component';
import { GetTasksComponent } from './get-tasks/get-tasks.component';
import { CompleteTasksComponent } from './complete-tasks/complete-tasks.component';

const services = [GameStateService, GameService, GetTasksPageService, CompleteTasksPageService];

@NgModule({
  declarations: [GameComponent, SelectPersonComponent, GetTasksComponent, CompleteTasksComponent],
  providers: [...services],
  imports: [CommonModule, SharedModule, GameRoutingModule]
})
export class GameModule {}
