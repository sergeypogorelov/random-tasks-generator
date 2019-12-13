import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { ManagementRoutingModule } from './management-routing.module';

import { ManagementComponent } from './management.component';
import { PersonsComponent } from './persons/persons.component';
import { SubtasksComponent } from './subtasks/subtasks.component';
import { SubtaskDetailsComponent } from './subtasks/subtask-details/subtask-details.component';
import { TagsComponent } from './tags/tags.component';
import { TagDetailsComponent } from './tags/tag-details/tag-details.component';

const declarations = [
  ManagementComponent,
  PersonsComponent,
  SubtasksComponent,
  SubtaskDetailsComponent,
  TagsComponent,
  TagDetailsComponent
];

@NgModule({
  declarations: [...declarations],
  imports: [CommonModule, SharedModule, ManagementRoutingModule]
})
export class ManagementModule {}
