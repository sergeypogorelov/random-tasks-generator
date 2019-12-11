import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { urlFragments } from '../core/constants/url-fragments';

import { ManagementComponent } from './management.component';
import { PersonsComponent } from './persons/persons.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'fully',
    component: ManagementComponent
  },
  {
    path: urlFragments.managementChilds.persons,
    component: PersonsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {}
