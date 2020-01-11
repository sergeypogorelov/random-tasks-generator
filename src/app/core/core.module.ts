import { NgModule } from '@angular/core';

import { dbConfig } from './configs/db-config';

import { IdbModule } from '../idb/idb.module';

import { TagService } from './services/tag/tag.service';
import { SubtaskService } from './services/subtask/subtask.service';
import { TaskService } from './services/task/task.service';
import { PersonService } from './services/person/person.service';
import { GameResultService } from './services/game-result/game-result.service';

import { ModalService } from './services/modal/modal.service';
import { ModalConfirmService } from './services/modal-confirm/modal-confirm.service';
import { ModalAlertService } from './services/modal-alert/modal-alert.service';
import { ModalSubtaskInfoService } from './services/modal-subtask-info/modal-subtask-info.service';

import { ObjectUrlService } from './services/object-url/object-url.service';

import { BreadcrumbService } from './services/breadcrumb/breadcrumb.service';

const dbServices = [TagService, SubtaskService, TaskService, PersonService, GameResultService];

const helpers = [ObjectUrlService];

const modalServices = [ModalService, ModalConfirmService, ModalAlertService, ModalSubtaskInfoService];

const componentServices = [BreadcrumbService];

@NgModule({
  imports: [IdbModule.forRoot(dbConfig)],
  providers: [...dbServices, ...helpers, ...modalServices, ...componentServices]
})
export class CoreModule {}
