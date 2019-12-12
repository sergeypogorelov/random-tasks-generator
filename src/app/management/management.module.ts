import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { ManagementRoutingModule } from './management-routing.module';

import { ManagementComponent } from './management.component';
import { PersonsComponent } from './persons/persons.component';
import { TagsComponent } from './tags/tags.component';
import { TagDetailsComponent } from './tags/tag-details/tag-details.component';

@NgModule({
  declarations: [ManagementComponent, PersonsComponent, TagsComponent, TagDetailsComponent],
  imports: [CommonModule, SharedModule, ManagementRoutingModule]
})
export class ManagementModule {}
