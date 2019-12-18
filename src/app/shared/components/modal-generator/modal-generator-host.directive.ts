import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[rtgModalGeneratorHost]'
})
export class ModalGeneratorHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
