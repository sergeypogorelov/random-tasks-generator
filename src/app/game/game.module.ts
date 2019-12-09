import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { GameRoutingModule } from './game-routing.module';

import { GameComponent } from './game.component';
import { SelectPersonComponent } from './select-person/select-person.component';

@NgModule({
  declarations: [GameComponent, SelectPersonComponent],
  imports: [CommonModule, SharedModule, GameRoutingModule]
})
export class GameModule {}
