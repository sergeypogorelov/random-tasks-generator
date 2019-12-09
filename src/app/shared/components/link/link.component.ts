import { Component, Input } from '@angular/core';

import { LinkItem } from './link-item.interface';

@Component({
  selector: 'rtg-link',
  templateUrl: './link.component.html'
})
export class LinkComponent {
  @Input()
  item: LinkItem;

  @Input()
  classNames?: string;
}
