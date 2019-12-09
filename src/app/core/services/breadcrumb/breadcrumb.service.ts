import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { LinkItem } from '../../../shared/components/link/link-item.interface';

import { Utils } from '../../helpers/utils.class';

@Injectable()
export class BreadcrumbService {
  get observable(): Observable<LinkItem[]> {
    return this.subject.asObservable();
  }

  private items: LinkItem[] = [];

  private subject = new Subject<LinkItem[]>();

  getItems(): LinkItem[] {
    return this.items;
  }

  setItems(items: LinkItem[]) {
    if (!items) {
      throw new Error('Breadcrumb items are not specified.');
    }

    this.items = Utils.jsonCopy(items);

    this.subject.next(this.items);
  }
}
