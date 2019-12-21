import { NgModule } from '@angular/core';

import { IndexedDBModule } from './indexed-db.module';

import { DatabaseService } from './services/database/database.service';
import { TagService } from './services/tag/tag.service';
import { SubtaskService } from './services/subtask/subtask.service';

import { ModalService } from './services/modal/modal.service';
import { ModalConfirmService } from './services/modal-confirm/modal-confirm.service';

import { BreadcrumbService } from './services/breadcrumb/breadcrumb.service';

const dbServices = [DatabaseService, TagService, SubtaskService];

const modalServices = [ModalService, ModalConfirmService];

const componentServices = [BreadcrumbService];

@NgModule({
  imports: [IndexedDBModule],
  providers: [...dbServices, ...modalServices, ...componentServices],
  exports: [IndexedDBModule]
})
export class CoreModule {}
