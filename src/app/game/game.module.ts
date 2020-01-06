import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { GameRoutingModule } from './game-routing.module';

import { GameStateService } from './services/game-state/game-state.service';
import { GameService } from './services/game/game.service';
import { GetTasksPageService } from './components/get-tasks/get-tasks-page.service';
import { CompleteTasksPageService } from './components/complete-tasks/services/complete-tasks-page.service';

import { GameComponent } from './game.component';
import { SelectPersonComponent } from './components/select-person/select-person.component';
import { GetTasksComponent } from './components/get-tasks/get-tasks.component';
import { CompleteTasksComponent } from './components/complete-tasks/complete-tasks.component';

const services = [GameStateService, GameService, GetTasksPageService, CompleteTasksPageService];

@NgModule({
  declarations: [GameComponent, SelectPersonComponent, GetTasksComponent, CompleteTasksComponent],
  providers: [...services],
  imports: [CommonModule, SharedModule, GameRoutingModule]
})
export class GameModule {}
