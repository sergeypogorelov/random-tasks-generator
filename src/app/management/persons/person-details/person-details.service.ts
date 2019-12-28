import { Injectable } from '@angular/core';
import { PersonDetails } from './interfaces/person-details.interface';
import { PersonDetailsIteration } from './interfaces/person-details-iteration.interface';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { PersonDetailsTag } from './interfaces/person-details-tag.interface';
import { Tag } from 'src/app/core/interfaces/tag/tag.interface';
import { ProbabilityRange } from 'src/app/core/enums/probability-range.enum';
import { PersonDetailsTask } from './interfaces/person-details-task.interface';

@Injectable()
export class PersonDetailsService {
  generateFormGroup(personDetails: PersonDetails = null) {
    let formValue = this.generateDefaultValue();

    if (personDetails) {
      formValue = {
        ...formValue,
        ...personDetails
      };
    }

    return new FormGroup({
      name: new FormControl(formValue.name, [Validators.required]),
      description: new FormControl(formValue.description),
      thumbnail: new FormControl(formValue.thumbnail, [Validators.required]),
      iterations: new FormArray(formValue.iterations.map(i => this.generateIterationFormGroup(i)))
    });
  }

  generateIterationFormGroup(personDetailsIteration: PersonDetailsIteration = null): FormGroup {
    let formValue = this.generateDefaultValueForIteration();

    if (personDetailsIteration) {
      formValue = {
        ...formValue,
        ...personDetailsIteration
      };
    }

    return new FormGroup({
      name: new FormControl(formValue.name, [Validators.required]),
      duration: new FormControl(formValue.duration, [Validators.required]),
      tasks: new FormArray(formValue.tasks.map(i => this.generateTaskFormGroup(i)))
    });
  }

  generateTaskFormGroup(personDetailsTask: PersonDetailsTask = null): FormGroup {
    let formValue = this.generateDefaultValueForTask();

    if (personDetailsTask) {
      formValue = {
        ...formValue,
        ...personDetailsTask
      };
    }

    return new FormGroup({
      id: new FormControl(formValue.id, [Validators.required]),
      probability: new FormControl(formValue.probability, [Validators.required]),
      tags: new FormArray(formValue.tags.map(i => this.generateTagFormGroup(i.id, i.name, i)))
    });
  }

  generateTagFormGroup(id: string, name: string, personDetailsTag: PersonDetailsTag = null): FormGroup {
    const formValue = this.generateDefaultValueForTag(id, name);

    if (personDetailsTag) {
      formValue.probability = personDetailsTag.probability;
      formValue.selected = personDetailsTag.selected;
    }

    return new FormGroup({
      id: new FormControl(id),
      name: new FormControl(name),
      probability: new FormControl(formValue.probability),
      selected: new FormControl(formValue.selected)
    });
  }

  generateDefaultValue(): PersonDetails {
    return {
      name: '',
      description: '',
      thumbnail: null,
      iterations: []
    };
  }

  generateDefaultValueForIteration(): PersonDetailsIteration {
    return {
      name: '',
      duration: '',
      tasks: []
    };
  }

  generateDefaultValueForTask(): PersonDetailsTask {
    return {
      id: '',
      probability: '',
      tags: []
    };
  }

  generateDefaultValueForTag(id: string, name: string): PersonDetailsTag {
    return {
      id,
      name,
      probability: ProbabilityRange.Low,
      selected: false
    };
  }
}
