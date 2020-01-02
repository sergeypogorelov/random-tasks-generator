import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';

import { Task } from '../../core/interfaces/task/task.interface';
import { Person } from '../../core/interfaces/person/person.interface';
import { PersonsGridItem } from './persons-grid-item.interface';

import { TaskService } from '../../core/services/task/task.service';
import { PersonService } from '../../core/services/person/person.service';
import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';
import { ModalConfirmService } from '../../core/services/modal-confirm/modal-confirm.service';
import { PersonsService } from './persons.service';

import { idOfNewPerson } from './person-details/person-details.component';

@Component({
  selector: 'rtg-persons',
  templateUrl: './persons.component.html'
})
export class PersonsComponent implements OnInit, OnDestroy {
  tasks: Task[];

  persons: Person[];

  models: PersonsGridItem[] = [];

  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private taskService: TaskService,
    private personService: PersonService,
    private breadcrumbService: BreadcrumbService,
    private modalConfirmService: ModalConfirmService,
    private personsService: PersonsService
  ) {}

  ngOnInit() {
    this.setBreadcrumb();
    this.updateGrid();
  }

  ngOnDestroy() {
    this.subs.forEach(i => i.unsubscribe());
  }

  newButtonClickHandler() {
    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.persons, idOfNewPerson]);
  }

  editButtonClickHandler(item: PersonsGridItem) {
    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.persons, item.id]);
  }

  removeButtonClickHandler(item: PersonsGridItem) {
    this.modalConfirmService.createAndShowConfirmModal('remove-person', {
      confirm: () => {
        this.subs.push(this.personService.delete(item.id).subscribe(() => this.updateGrid()));
      }
    });
  }

  imgLoadHandler(item: PersonsGridItem) {
    URL.revokeObjectURL(item.thumbnailDateUrl);
  }

  private setBreadcrumb() {
    this.breadcrumbService.setItems([
      {
        label: linkLabels.management,
        routerLink: [`/${urlFragments.management}`]
      },
      {
        label: linkLabels.managementChilds.persons
      }
    ]);
  }

  private updateGrid() {
    this.subs.push(
      forkJoin(this.loadAndSetTasks(), this.loadAndSetPersons()).subscribe(results => {
        const tags = results[0];
        const persons = results[1];

        this.models = persons.map(person => this.personsService.castDtoToModel(person, tags));
      })
    );
  }

  private loadAndSetTasks(): Observable<Task[]> {
    return this.taskService.getAll().pipe(tap(tasks => (this.tasks = tasks)));
  }

  private loadAndSetPersons(): Observable<Person[]> {
    return this.personService.getAll().pipe(tap(persons => (this.persons = persons)));
  }
}
