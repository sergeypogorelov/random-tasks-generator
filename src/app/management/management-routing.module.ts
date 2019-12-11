import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManagementComponent } from './management.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'fully',
    component: ManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {}
