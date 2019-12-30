import { NgModule } from '@angular/core';

import { dbConfig } from './configs/db-config';

import { IdbModule } from '../idb/idb.module';

import { TagService } from './services/tag/tag.service';
import { SubtaskService } from './services/subtask/subtask.service';
import { TaskService } from './services/task/task.service';
import { PersonService } from './services/person/person.service';

import { ModalService } from './services/modal/modal.service';
import { ModalConfirmService } from './services/modal-confirm/modal-confirm.service';

import { BreadcrumbService } from './services/breadcrumb/breadcrumb.service';

const dbServices = [TagService, SubtaskService, TaskService, PersonService];

const modalServices = [ModalService, ModalConfirmService];

const componentServices = [BreadcrumbService];

@NgModule({
  imports: [IdbModule.forRoot(dbConfig)],
  providers: [...dbServices, ...modalServices, ...componentServices]
})
export class CoreModule {}
