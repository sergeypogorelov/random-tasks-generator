import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { urlFragments } from '../core/constants/url-fragments';

import { GameService } from './services/game/game.service';
import { GameStateService } from './services/game-state/game-state.service';

@Component({
  selector: 'rtg-game',
  templateUrl: './game.component.html'
})
export class GameComponent implements OnInit {
  constructor(private router: Router, private gameService: GameService, private gameStateService: GameStateService) {}

  ngOnInit() {
    const currentPerson = this.gameService.getCurrentPerson();

    if (!currentPerson) {
      return this.router.navigate([`/${urlFragments.game}`, urlFragments.gameChilds.selectPerson]);
    }

    const currentState = this.gameStateService.getState(currentPerson.id);

    if (currentState.tasksToDo.length === 0) {
      return this.router.navigate([`/${urlFragments.game}`, urlFragments.gameChilds.getTasks]);
    } else {
      return this.router.navigate([`/${urlFragments.game}`, urlFragments.gameChilds.completeTasks]);
    }
  }
}
