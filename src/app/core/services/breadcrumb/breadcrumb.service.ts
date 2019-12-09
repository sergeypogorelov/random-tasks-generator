import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Utils } from '../../helpers/utils.class';

import { BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb-item.interface';

@Injectable()
export class BreadcrumbService {
  get observable(): Observable<BreadcrumbItem[]> {
    return this.subject.asObservable();
  }

  private items: BreadcrumbItem[] = [];

  private subject = new Subject<BreadcrumbItem[]>();

  getItems(): BreadcrumbItem[] {
    return this.items;
  }

  setItems(items: BreadcrumbItem[]) {
    if (!items) {
      throw new Error('Breadcrumb items are not specified.');
    }

    this.items = Utils.jsonCopy(items);

    this.subject.next(this.items);
  }
}
