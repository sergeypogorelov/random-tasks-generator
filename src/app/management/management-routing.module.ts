import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { urlFragments } from '../core/constants/url-fragments';

import { ManagementComponent } from './management.component';
import { PersonsComponent } from './persons/persons.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskDetailsComponent } from './tasks/task-details/task-details.component';
import { SubtasksComponent } from './subtasks/subtasks.component';
import { SubtaskDetailsComponent } from './subtasks/subtask-details/subtask-details.component';
import { TagsComponent } from './tags/tags.component';
import { TagDetailsComponent } from './tags/tag-details/tag-details.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'fully',
    component: ManagementComponent
  },
  {
    path: urlFragments.managementChilds.persons,
    component: PersonsComponent
  },
  {
    path: urlFragments.managementChilds.tasks,
    component: TasksComponent
  },
  {
    path: `${urlFragments.managementChilds.tasks}/:id`,
    component: TaskDetailsComponent
  },
  {
    path: urlFragments.managementChilds.subtasks,
    component: SubtasksComponent
  },
  {
    path: `${urlFragments.managementChilds.subtasks}/:id`,
    component: SubtaskDetailsComponent
  },
  {
    path: urlFragments.managementChilds.tags,
    component: TagsComponent
  },
  {
    path: `${urlFragments.managementChilds.tags}/:id`,
    component: TagDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {}
