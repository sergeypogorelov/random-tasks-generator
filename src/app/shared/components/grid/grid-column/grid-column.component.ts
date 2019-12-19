import { Component, ContentChild, TemplateRef, Input } from '@angular/core';

import { GridCellTemplateDirective } from './grid-cell-template.directive';

@Component({
  selector: 'rtg-grid-column',
  templateUrl: './grid-column.component.html'
})
export class GridColumnComponent {
  @Input()
  title: string;

  @Input()
  field: string;

  @Input()
  classNames = '';

  @Input()
  headClassNames = '';

  @ContentChild(GridCellTemplateDirective, { read: TemplateRef, static: false })
  gridCellTemplate: TemplateRef<any>;
}
