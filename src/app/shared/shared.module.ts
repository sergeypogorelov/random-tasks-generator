import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './layout/header/header.component';
import { MenuButtonComponent } from './layout/header/menu-button/menu-button.component';
import { PrimaryNavigationComponent } from './layout/primary-navigation/primary-navigation.component';
import { FooterComponent } from './layout/footer/footer.component';
import { PageComponent } from './layout/page.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

const angularModules = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule];

const declarationsAndExports = [
  HeaderComponent,
  MenuButtonComponent,
  PrimaryNavigationComponent,
  FooterComponent,
  PageComponent,
  BreadcrumbComponent
];

@NgModule({
  imports: [...angularModules],
  declarations: [...declarationsAndExports],
  exports: [...angularModules, ...declarationsAndExports]
})
export class SharedModule {}
