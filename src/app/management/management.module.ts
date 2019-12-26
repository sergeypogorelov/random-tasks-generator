import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { ManagementRoutingModule } from './management-routing.module';

import { TagDetailsService } from './tags/tag-details/tag-details.service';
import { SubtaskDetailsService } from './subtasks/subtask-details/subtask-details.service';
import { SubtasksService } from './subtasks/subtasks.service';
import { TaskDetailsService } from './tasks/task-details/task-details.service';

import { ManagementComponent } from './management.component';
import { PersonsComponent } from './persons/persons.component';
import { PersonDetailsComponent } from './persons/person-details/person-details.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskDetailsComponent } from './tasks/task-details/task-details.component';
import { SubtasksComponent } from './subtasks/subtasks.component';
import { SubtaskDetailsComponent } from './subtasks/subtask-details/subtask-details.component';
import { TagsComponent } from './tags/tags.component';
import { TagDetailsComponent } from './tags/tag-details/tag-details.component';

const declarations = [
  ManagementComponent,
  PersonsComponent,
  PersonDetailsComponent,
  TasksComponent,
  TaskDetailsComponent,
  SubtasksComponent,
  SubtaskDetailsComponent,
  TagsComponent,
  TagDetailsComponent
];

const services = [TagDetailsService, SubtaskDetailsService, SubtasksService, TaskDetailsService];

@NgModule({
  declarations: [...declarations],
  providers: [...services],
  imports: [CommonModule, SharedModule, ManagementRoutingModule]
})
export class ManagementModule {}
