import { NgModule } from '@angular/core';

import { BreadcrumbService } from './services/breadcrumb/breadcrumb.service';

const componentServices = [BreadcrumbService];

@NgModule({
  providers: [...componentServices]
})
export class CoreModule {}
