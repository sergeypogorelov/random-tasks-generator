import { Component, OnInit } from '@angular/core';

import { linkLabels } from '../core/constants/link-labels';
import { urlFragments } from '../core/constants/url-fragments';

import { LinkItem } from '../shared/components/link/link-item.interface';
import { BreadcrumbService } from '../core/services/breadcrumb/breadcrumb.service';
import { IdbService } from '../idb/services/idb/idb.service';
import { mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'rtg-management',
  templateUrl: './management.component.html'
})
export class ManagementComponent implements OnInit {
  linkForPartPersons: LinkItem = {
    label: linkLabels.managementChilds.persons,
    routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.persons]
  };

  linkForPartTasks: LinkItem = {
    label: linkLabels.managementChilds.tasks,
    routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.tasks]
  };

  linkForPartSubtasks: LinkItem = {
    label: linkLabels.managementChilds.subtasks,
    routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.subtasks]
  };

  linkForPartTags: LinkItem = {
    label: linkLabels.managementChilds.tags,
    routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.tags]
  };

  constructor(private breadcrumbService: BreadcrumbService, private idbService: IdbService) {
    // this.idbService
    //   .openDB()
    //   .pipe(tap(db => db.put('store', { name: 'value1' })))
    //   .pipe(tap(db => db.put('store', { name: 'value2' })))
    //   .subscribe(i => console.log(i));
  }

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        label: linkLabels.management
      }
    ]);
  }
}
