import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../core/services/breadcrumb/breadcrumb.service';

@Component({
  selector: 'rtg-game',
  templateUrl: './game.component.html'
})
export class GameComponent implements OnInit {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        label: 'Home',
        routerLink: ['/home']
      },
      {
        label: 'Game'
      }
    ]);
  }
}
