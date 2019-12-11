import { Component } from '@angular/core';

import { linkLabels } from '../core/constants/link-labels';
import { urlFragments } from '../core/constants/url-fragments';

import { LinkItem } from '../shared/components/link/link-item.interface';

@Component({
  selector: 'rtg-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  linkForPartGame: LinkItem = {
    label: linkLabels.game,
    routerLink: [`/${urlFragments.game}`]
  };

  linkForPartManagement: LinkItem = {
    label: linkLabels.management,
    routerLink: [`/${urlFragments.management}`]
  };

  linkForPartStatistics: LinkItem = {
    label: linkLabels.statistics,
    routerLink: [`/${urlFragments.statistics}`]
  };

  linkForPartImportAndExport: LinkItem = {
    label: linkLabels.importAndExport,
    routerLink: [`/${urlFragments.importAndExport}`]
  };

  linkForPartAbout: LinkItem = {
    label: linkLabels.about,
    routerLink: [`/${urlFragments.about}`]
  };
}
