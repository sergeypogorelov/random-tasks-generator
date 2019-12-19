import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './layout/header/header.component';
import { PrimaryNavigationComponent } from './layout/primary-navigation/primary-navigation.component';
import { FooterComponent } from './layout/footer/footer.component';
import { PageComponent } from './layout/page.component';

import { ModalGeneratorComponent } from './components/modal-generator/modal-generator.component';
import { MenuButtonComponent } from './components/menu-button/menu-button.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { LinkComponent } from './components/link/link.component';
import { TagsSelectorComponent } from './components/tags-selector/tags-selector.component';
import { GridColumnComponent } from './components/grid/grid-column/grid-column.component';
import { GridComponent } from './components/grid/grid.component';

import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';

import { ClickOutsideDirective } from './directives/click-outside/click-outside.directive';
import { ModalGeneratorHostDirective } from './components/modal-generator/modal-generator-host.directive';
import { GridCellTemplateDirective } from './components/grid/grid-column/grid-cell-template.directive';

const angularModules = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule];

const declarationsAndExports = [
  HeaderComponent,
  PrimaryNavigationComponent,
  FooterComponent,
  PageComponent,
  ModalGeneratorComponent,
  MenuButtonComponent,
  BreadcrumbComponent,
  LinkComponent,
  TagsSelectorComponent,
  GridColumnComponent,
  GridComponent,
  ClickOutsideDirective,
  ModalGeneratorHostDirective,
  GridCellTemplateDirective
];

const entryComponents = [ModalConfirmComponent];

@NgModule({
  imports: [...angularModules],
  declarations: [...declarationsAndExports, ...entryComponents],
  entryComponents: [...entryComponents],
  exports: [...angularModules, ...declarationsAndExports]
})
export class SharedModule {}
