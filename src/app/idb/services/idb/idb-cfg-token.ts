import { InjectionToken } from '@angular/core';

import { IdbCfg } from '../../idb-cfg.interface';

export const idbCfgToken = new InjectionToken<IdbCfg>('Config for IdbService');
