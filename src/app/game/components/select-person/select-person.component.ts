import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { linkLabels } from '../../../core/constants/link-labels';
import { urlFragments } from '../../../core/constants/url-fragments';

import { Person } from '../../../core/interfaces/person/person.interface';

import { FileReaderHelper } from '../../../core/helpers/filer-reader/file-reader-helper.class';

import { PersonService } from '../../../core/services/person/person.service';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb.service';
import { GameService } from '../../services/game/game.service';
import { ObjectUrlService } from 'src/app/core/services/object-url/object-url.service';

const PERSON_INDEX_BY_DEFAULT = 0;

const TAG = 'select-person-component';

@Component({
  selector: 'rtg-select-person',
  templateUrl: './select-person.component.html'
})
export class SelectPersonComponent implements OnInit, OnDestroy {
  person: Person;

  personIndex: number;

  personThumbnailDateUrl: string;

  personThumbnailSafeUrl: SafeUrl;

  persons: Person[];

  get nextBtnEnabled(): boolean {
    if (!this.persons) {
      return false;
    }

    return this.personIndex < this.persons.length - 1;
  }

  get prevBtnEnabled(): boolean {
    if (!this.persons) {
      return false;
    }

    return this.persons.length > 1 && this.personIndex !== 0;
  }

  constructor(
    private router: Router,
    private personService: PersonService,
    private breadcrumbService: BreadcrumbService,
    private objectUrlService: ObjectUrlService,
    private gameService: GameService
  ) {
    this.personIndex = PERSON_INDEX_BY_DEFAULT;
  }

  ngOnInit() {
    this.setBreadcrumb();
    this.loadAndSetPersons().subscribe(persons => this.setPerson(persons[this.personIndex]));
  }

  ngOnDestroy() {
    this.objectUrlService.revokeUrlsByTag(TAG);
  }

  imgLoadHandler() {
    URL.revokeObjectURL(this.personThumbnailDateUrl);
  }

  prevBtnClickHandler() {
    this.personIndex--;

    this.setPerson(this.persons[this.personIndex]);
  }

  nextBtnClickHandler() {
    this.personIndex++;

    this.setPerson(this.persons[this.personIndex]);
  }

  selectButtonClickHandler() {
    this.gameService.setCurrentPerson(this.person);

    this.router.navigate([`/${urlFragments.game}`, urlFragments.gameChilds.getTasks]);
  }

  private setBreadcrumb() {
    this.breadcrumbService.setItems([
      {
        label: linkLabels.gameChilds.selectPerson
      }
    ]);
  }

  private setPerson(person: Person) {
    if (!person) {
      throw new Error('Person is not specified.');
    }

    this.person = person;

    const imgInfo = this.objectUrlService.createImgUrl(TAG, this.person.thumbnail);
    this.personThumbnailDateUrl = imgInfo.dataUrl;
    this.personThumbnailSafeUrl = imgInfo.safeUrl;
  }

  private loadAndSetPersons(): Observable<Person[]> {
    return this.personService.getAll().pipe(tap(persons => (this.persons = persons)));
  }
}
