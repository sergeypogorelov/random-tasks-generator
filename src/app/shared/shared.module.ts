import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './layout/header/header.component';
import { PrimaryNavigationComponent } from './layout/primary-navigation/primary-navigation.component';
import { FooterComponent } from './layout/footer/footer.component';
import { PageComponent } from './layout/page.component';

import { MenuButtonComponent } from './components/menu-button/menu-button.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { LinkComponent } from './components/link/link.component';

const angularModules = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule];

const declarationsAndExports = [
  HeaderComponent,
  MenuButtonComponent,
  PrimaryNavigationComponent,
  FooterComponent,
  PageComponent,
  BreadcrumbComponent,
  LinkComponent
];

@NgModule({
  imports: [...angularModules],
  declarations: [...declarationsAndExports],
  exports: [...angularModules, ...declarationsAndExports]
})
export class SharedModule {}
