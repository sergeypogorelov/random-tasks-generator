import { Component, QueryList, ContentChildren, Input, EventEmitter, Output } from '@angular/core';

import { GridColumnComponent } from './grid-column/grid-column.component';

@Component({
  selector: 'rtg-grid',
  templateUrl: './grid.component.html'
})
export class GridComponent {
  searchControlValue: string;

  dataFiltered: any[];

  get data(): any[] {
    return this.dataItems;
  }

  @Input()
  set data(value: any[]) {
    this.dataItems = value;

    this.applySearch();
  }

  get searchValue(): string {
    return this.searchValueByDefault;
  }

  @Input()
  set searchValue(value: string) {
    this.searchValueByDefault = value;
    this.searchControlValue = value;

    this.applySearch();
  }

  @Input()
  searchField: string;

  @Output()
  searchValueChange = new EventEmitter<string>();

  @ContentChildren(GridColumnComponent)
  columns: QueryList<GridColumnComponent>;

  private dataItems: any[];

  private searchValueByDefault: string;

  searchSubmitHandler() {
    if (typeof this.searchValue === 'undefined') {
      this.applySearch();
    }

    this.searchValueChange.emit(this.searchControlValue);
  }

  private applySearch() {
    if (!this.searchField || !this.searchControlValue) {
      this.dataFiltered = this.data;
      return;
    }

    const searchValue = this.searchControlValue.toUpperCase();

    this.dataFiltered = this.data.filter(dataItem => {
      const dataItemValue = dataItem[this.searchField] as string;
      return dataItemValue.toUpperCase().includes(searchValue);
    });
  }
}
