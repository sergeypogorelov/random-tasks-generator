import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { urlFragments } from '../core/constants/url-fragments';

@Component({
  selector: 'rtg-game',
  templateUrl: './game.component.html'
})
export class GameComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.navigate([`/${urlFragments.game}`, urlFragments.gameChilds.selectPerson]);
  }
}
