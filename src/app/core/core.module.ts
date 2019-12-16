import { NgModule } from '@angular/core';

import { IndexedDBModule } from './indexed-db.module';

import { TagService } from './services/tag/tag.service';
import { DatabaseService } from './services/database/database.service';
import { BreadcrumbService } from './services/breadcrumb/breadcrumb.service';

const dbServices = [DatabaseService, TagService];

const componentServices = [BreadcrumbService];

@NgModule({
  imports: [IndexedDBModule],
  providers: [...dbServices, ...componentServices],
  exports: [IndexedDBModule]
})
export class CoreModule {}
