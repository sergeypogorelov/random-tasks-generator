import { Component, QueryList, ContentChildren, Input } from '@angular/core';

import { GridColumnComponent } from './grid-column/grid-column.component';

@Component({
  selector: 'rtg-grid',
  templateUrl: './grid.component.html'
})
export class GridComponent {
  @Input()
  data: any[];

  @ContentChildren(GridColumnComponent)
  columns: QueryList<GridColumnComponent>;
}
