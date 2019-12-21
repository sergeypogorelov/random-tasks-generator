import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Utils } from '../../../core/helpers/utils.class';

@Component({
  selector: 'rtg-tags-selector',
  styleUrls: ['./tags-selector.component.scss'],
  templateUrl: './tags-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagsSelectorComponent),
      multi: true
    }
  ]
})
export class TagsSelectorComponent implements ControlValueAccessor {
  textboxValue: string;

  suggestedDataItems: string[] = [];

  selectedDataItems: string[] = [];

  @Input()
  dataItems: string[] = [];

  private onChangeHandler: any;

  private onTouchedHandler: any;

  writeValue(obj: any) {
    const value = obj || [];

    this.selectedDataItems = value;
  }

  registerOnChange(fn: any) {
    this.onChangeHandler = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedHandler = fn;
  }

  controlTopClickOutsideHandler() {
    this.suggestedDataItems = [];
  }

  textboxChangeHandler(value: string) {
    this.filterSuggestedDataItems(value);
  }

  textboxBlurHandler() {
    if (this.onTouchedHandler) {
      this.onTouchedHandler();
    }
  }

  textboxFocusHandler() {
    const value = this.textboxValue || '';

    this.filterSuggestedDataItems(value);
  }

  suggestionClickHandler(value: string) {
    if (!this.selectedDataItems.includes(value)) {
      this.selectedDataItems.push(value);

      if (this.onChangeHandler) {
        this.onChangeHandler(Utils.jsonCopy(this.selectedDataItems));
      }
    }

    const foundIndex = this.suggestedDataItems.indexOf(value);
    if (foundIndex !== -1) {
      this.suggestedDataItems.splice(foundIndex, 1);
    }

    if (this.onTouchedHandler) {
      this.onTouchedHandler();
    }
  }

  buttonRemoveClickHandler(value: string) {
    const foundIndex = this.selectedDataItems.indexOf(value);
    if (foundIndex !== -1) {
      this.selectedDataItems.splice(foundIndex, 1);

      if (this.onChangeHandler) {
        this.onChangeHandler(Utils.jsonCopy(this.selectedDataItems));
      }
    }

    if (this.onTouchedHandler) {
      this.onTouchedHandler();
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
