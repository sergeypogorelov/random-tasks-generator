import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'rtg-menu-button',
  styleUrls: ['./menu-button.component.scss'],
  templateUrl: './menu-button.component.html'
})
export class MenuButtonComponent {
  expanded: boolean;

  @Output()
  userClick = new EventEmitter<boolean>();

  clickHandler() {
    this.expanded = !this.expanded;

    this.userClick.emit(this.expanded);
  }
}
