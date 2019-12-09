import { linkLabels } from '../../../core/constants/link-labels';
import { urlFragments } from '../../../core/constants/url-fragments';

import { LinkItem } from '../../components/link/link-item.interface';

export const primaryNavigationItems: LinkItem[] = [
  {
    label: linkLabels.home,
    routerLink: [`/${urlFragments.home}`]
  },
  {
    label: linkLabels.game,
    routerLink: [`/${urlFragments.game}`]
  },
  {
    label: linkLabels.management,
    routerLink: [`/${urlFragments.management}`]
  },
  {
    label: linkLabels.statistics,
    routerLink: [`/${urlFragments.statistics}`]
  },
  {
    label: linkLabels.importAndExport,
    routerLink: [`/${urlFragments.importAndExport}`]
  },
  {
    label: linkLabels.about,
    routerLink: [`/${urlFragments.about}`]
  },
  {
    label: linkLabels.exit,
    routerLink: [`/${urlFragments.exit}`]
  }
];
