import { Component, QueryList, ContentChildren, Input } from '@angular/core';

import { GridColumnComponent } from './grid-column/grid-column.component';

@Component({
  selector: 'rtg-grid',
  templateUrl: './grid.component.html'
})
export class GridComponent {
  searchValue: string;

  dataFiltered: any[];

  get data(): any[] {
    return this.dataItems;
  }

  @Input()
  set data(value: any[]) {
    this.dataItems = value;

    this.applySearch();
  }

  @Input()
  searchField: string;

  @ContentChildren(GridColumnComponent)
  columns: QueryList<GridColumnComponent>;

  private dataItems: any[];

  searchSubmitHandler() {
    this.applySearch();
  }

  private applySearch() {
    if (!this.searchField || !this.searchValue) {
      this.dataFiltered = this.data;
      return;
    }

    const searchValue = this.searchValue.toUpperCase();

    this.dataFiltered = this.data.filter(dataItem => {
      const dataItemValue = dataItem[this.searchField] as string;
      return dataItemValue.toUpperCase().includes(searchValue);
    });
  }
}
