import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { GameRoutingModule } from './game-routing.module';

import { GameComponent } from './game.component';

@NgModule({
  declarations: [GameComponent],
  imports: [CommonModule, SharedModule, GameRoutingModule]
})
export class GameModule {}
