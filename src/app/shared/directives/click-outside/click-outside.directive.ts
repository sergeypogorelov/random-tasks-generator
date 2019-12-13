import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[rtgClickOutside]'
})
export class ClickOutsideDirective {
  constructor(private elementRef: ElementRef) {}

  @Output()
  rtgClickOutside = new EventEmitter<any>();

  @HostListener('document:click', ['$event.target'])
  documentClickHandler(targetElement: Element) {
    const currentElement = this.elementRef.nativeElement as Element;
    const clickedOutside = !currentElement.contains(targetElement);

    if (clickedOutside) {
      this.rtgClickOutside.emit();
    }
  }
}
