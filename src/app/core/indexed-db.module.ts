import { NgModule } from '@angular/core';
import { NgxIndexedDBModule } from 'ngx-indexed-db';

import { dbConfig } from './configs/db-config';

@NgModule({
  imports: [NgxIndexedDBModule.forRoot(dbConfig)],
  exports: [NgxIndexedDBModule]
})
export class IndexedDBModule {}
