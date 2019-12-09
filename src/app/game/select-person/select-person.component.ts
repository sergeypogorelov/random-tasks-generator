import { Component, OnInit } from '@angular/core';

import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';

@Component({
  selector: 'rtg-select-person',
  templateUrl: './select-person.component.html'
})
export class SelectPersonComponent implements OnInit {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        label: 'Home',
        routerLink: ['/home']
      },
      {
        label: 'Select Person'
      }
    ]);
  }
}
