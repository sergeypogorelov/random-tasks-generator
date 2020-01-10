import { Component, QueryList, ContentChildren, Input, EventEmitter, Output } from '@angular/core';

import { GridColumnComponent } from './grid-column/grid-column.component';

@Component({
  selector: 'rtg-grid',
  templateUrl: './grid.component.html'
})
export class GridComponent {
  searchControlValue: string;

  dataFiltered: any[];

  dataToDisplay: any[];

  get data(): any[] {
    return this.dataItems;
  }

  @Input()
  set data(value: any[]) {
    this.dataItems = value;

    this.apply();
  }

  get searchValue(): string {
    return this.searchValueByDefault;
  }

  @Input()
  set searchValue(value: string) {
    this.searchValueByDefault = value;
    this.searchControlValue = value;

    this.apply();
  }

  get page(): number {
    return this.pageNumber;
  }

  @Input()
  set page(value: number) {
    this.pageNumber = value || 1;

    this.apply();
  }

  @Input()
  searchField: string;

  @Input()
  itemsPerPage: string;

  @Output()
  searchValueChange = new EventEmitter<string>();

  @Output()
  pageChange = new EventEmitter<number>();

  @ContentChildren(GridColumnComponent)
  columns: QueryList<GridColumnComponent>;

  private dataItems: any[];

  private searchValueByDefault: string;

  private pageNumber: number;

  totalItems: number;

  totalPages: number;

  pages: number[];

  searchSubmitHandler() {
    if (typeof this.searchValue === 'undefined') {
      this.apply();
    }

    this.searchValueChange.emit(this.searchControlValue);
  }

  pageClickHandler(ev: Event, page: number) {
    ev.preventDefault();

    this.pageChange.emit(page);
  }

  private apply() {
    if (!this.searchField || !this.searchControlValue) {
      this.dataFiltered = this.data;
    } else {
      const searchValue = this.searchControlValue.toUpperCase();

      this.dataFiltered = this.data.filter(dataItem => {
        const dataItemValue = dataItem[this.searchField] as string;
        return dataItemValue.toUpperCase().includes(searchValue);
      });
    }

    if (this.pageNumber && this.itemsPerPage) {
      this.totalItems = this.dataFiltered.length;
      this.totalPages = Math.round(this.dataFiltered.length / +this.itemsPerPage);

      const skip = this.pageNumber * +this.itemsPerPage - +this.itemsPerPage;
      this.dataToDisplay = this.dataFiltered.slice(skip, skip + +this.itemsPerPage);

      this.pages = [];

      if (this.pageNumber - 1 >= 1) {
        this.pages.push(this.pageNumber - 1);
      }

      this.pages.push(this.pageNumber);

      if (this.pageNumber + 1 <= this.totalPages) {
        this.pages.push(this.pageNumber + 1);
      }
    } else {
      this.dataToDisplay = this.dataFiltered;
    }
  }
}
