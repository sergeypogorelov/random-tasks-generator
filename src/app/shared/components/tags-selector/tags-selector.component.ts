import { Component, Input, forwardRef, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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

  suggestedDataItems: any[] = [];

  selectedDataItems: any[] = [];

  @Input()
  labelKey: string;

  @Input()
  valueKey: string;

  @Input()
  dataItems: any[] = [];

  @Input()
  @HostBinding('class.is-valid')
  valid: boolean;

  @Input()
  @HostBinding('class.is-invalid')
  invalid: boolean;

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

  suggestionClickHandler(item: any) {
    if (this.selectedDataItems.findIndex(i => i[this.valueKey] === item[this.valueKey]) === -1) {
      this.selectedDataItems.push(item);

      if (this.onChangeHandler) {
        this.onChangeHandler(this.selectedDataItems);
      }
    }

    const foundIndex = this.suggestedDataItems.findIndex(i => i[this.valueKey] === item[this.valueKey]);
    if (foundIndex !== -1) {
      this.suggestedDataItems.splice(foundIndex, 1);
    }

    if (this.onTouchedHandler) {
      this.onTouchedHandler();
    }
  }

  buttonRemoveClickHandler(item: any) {
    const foundIndex = this.selectedDataItems.findIndex(i => i[this.valueKey] === item[this.valueKey]);
    if (foundIndex !== -1) {
      this.selectedDataItems.splice(foundIndex, 1);

      if (this.onChangeHandler) {
        this.onChangeHandler(this.selectedDataItems);
      }
    }

    if (this.onTouchedHandler) {
      this.onTouchedHandler();
    }
  }

  private filterSuggestedDataItems(value: string) {
    value = value ? value.trim().toUpperCase() : '';

    if (value) {
      this.suggestedDataItems = this.dataItems
        .filter(item => this.selectedDataItems.findIndex(i => i[this.valueKey] === item[this.valueKey]) === -1)
        .filter(item => item[this.labelKey].toUpperCase().includes(value));
    } else {
      this.suggestedDataItems = [];
    }
  }
}
