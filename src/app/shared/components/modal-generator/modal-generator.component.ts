import { Component, ViewChild, ComponentRef, OnInit, ComponentFactoryResolver } from '@angular/core';

import { ModalService } from '../../../core/services/modal/modal.service';

import { ModalComponent } from './modal-component.interface';
import { ModalGeneratorHostDirective } from './modal-generator-host.directive';

@Component({
  selector: 'rtg-modal-generator',
  templateUrl: './modal-generator.component.html'
})
export class ModalGeneratorComponent implements OnInit {
  @ViewChild(ModalGeneratorHostDirective, { static: true })
  host: ModalGeneratorHostDirective;

  private modals: Map<string, ComponentRef<ModalComponent>>;

  constructor(private cfResolver: ComponentFactoryResolver, private modalService: ModalService) {
    this.modals = new Map<string, ComponentRef<ModalComponent>>();
  }

  ngOnInit() {
    this.modalService.showObservable.subscribe(modalInfo => {
      if (!this.modals.has(modalInfo.tag)) {
        const viewContainerRef = this.host.viewContainerRef;
        const componentFactory = this.cfResolver.resolveComponentFactory<ModalComponent>(modalInfo.component);

        const componentRef = viewContainerRef.createComponent<ModalComponent>(componentFactory);
        componentRef.instance.data = modalInfo.componentData;
        componentRef.instance.callbacksContainer = modalInfo.callbacksContainer;

        this.modals.set(modalInfo.tag, componentRef);
      }
    });

    this.modalService.hideObservable.subscribe(modalTag => {
      if (this.modals.has(modalTag)) {
        this.modals.get(modalTag).destroy();
        this.modals.delete(modalTag);
      }
    });
  }
}
