import { NgModule, ModuleWithProviders } from '@angular/core';

import { IdbCfg } from './idb-cfg.interface';

import { idbCfgToken } from './services/idb/idb-cfg-token';
import { IdbService } from './services/idb/idb.service';

@NgModule()
export class IdbModule {
  static forRoot(cfg: IdbCfg): ModuleWithProviders {
    return {
      ngModule: IdbModule,
      providers: [
        IdbService,
        {
          provide: idbCfgToken,
          useValue: cfg
        }
      ]
    };
  }
}
