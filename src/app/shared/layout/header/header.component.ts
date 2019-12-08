import { Component } from '@angular/core';

@Component({
  selector: 'rtg-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  primaryNavigationShown: boolean;

  menuButtonClickHandler(expanded: boolean) {
    this.primaryNavigationShown = expanded;
  }
}
