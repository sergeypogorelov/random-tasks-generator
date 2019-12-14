import { Component, Input } from '@angular/core';

@Component({
  selector: 'rtg-tags-selector',
  styleUrls: ['./tags-selector.component.scss'],
  templateUrl: './tags-selector.component.html'
})
export class TagsSelectorComponent {
  textboxValue: string;

  suggestedDataItems: string[] = [];

  selectedDataItems: string[] = [];

  @Input()
  dataItems: string[] = [];

  controlTopClickOutsideHandler() {
    this.suggestedDataItems = [];
  }

  textboxChangeHandler(value: string) {
    this.filterSuggestedDataItems(value);
  }

  textboxFocusHandler() {
    const value = this.textboxValue || '';

    this.filterSuggestedDataItems(value);
  }

  suggestionClickHandler(value: string) {
    if (!this.selectedDataItems.includes(value)) {
      this.selectedDataItems.push(value);
    }

    const foundIndex = this.suggestedDataItems.indexOf(value);
    if (foundIndex !== -1) {
      this.suggestedDataItems.splice(foundIndex, 1);
    }
  }

  buttonRemoveClickHandler(value: string) {
    const foundIndex = this.selectedDataItems.indexOf(value);
    if (foundIndex !== -1) {
      this.selectedDataItems.splice(foundIndex, 1);
    }
  }

  private filterSuggestedDataItems(value: string) {
    value = value ? value.trim() : '';

    if (value) {
      this.suggestedDataItems = this.dataItems
        .filter(i => !this.selectedDataItems.includes(i))
        .filter(i => i.includes(value));
    } else {
      this.suggestedDataItems = [];
    }
  }
}
