import { Component } from '@angular/core';

import { LinkItem } from '../../components/link/link-item.interface';
import { primaryNavigationItems } from './primary-navigation-items';

@Component({
  selector: 'rtg-primary-navigation',
  templateUrl: './primary-navigation.component.html'
})
export class PrimaryNavigationComponent {
  items: LinkItem[] = primaryNavigationItems;
}
