import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { ManagementRoutingModule } from './management-routing.module';

import { ManagementComponent } from './management.component';

@NgModule({
  declarations: [ManagementComponent],
  imports: [CommonModule, SharedModule, ManagementRoutingModule]
})
export class ManagementModule {}
