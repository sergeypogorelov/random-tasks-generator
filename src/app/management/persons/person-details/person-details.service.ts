import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { ProbabilityRange } from 'src/app/core/enums/probability-range.enum';

import { PersonModel } from './interfaces/person-model.interface';
import { PersonIterationModel } from './interfaces/person-iteration-model.interface';
import { PersonTaskModel } from './interfaces/person-task-model.interface';
import { PersonTagModel } from './interfaces/person-tag-model.interface';

@Injectable()
export class PersonDetailsService {
  generateFormGroup(personModel: PersonModel = null) {
    let formValue = this.generateDefaultValue();

    if (personModel) {
      formValue = {
        ...formValue,
        ...personModel
      };
    }

    return new FormGroup({
      name: new FormControl(formValue.name, [Validators.required]),
      description: new FormControl(formValue.description),
      thumbnail: new FormControl(formValue.thumbnail, [Validators.required]),
      iterations: new FormArray(formValue.iterations.map(i => this.generateIterationFormGroup(i)))
    });
  }

  generateIterationFormGroup(personIterationModel: PersonIterationModel = null): FormGroup {
    let formValue = this.generateDefaultValueForIteration();

    if (personIterationModel) {
      formValue = {
        ...formValue,
        ...personIterationModel
      };
    }

    return new FormGroup({
      name: new FormControl(formValue.name, [Validators.required]),
      duration: new FormControl(formValue.duration, [Validators.required]),
      tasks: new FormArray(formValue.tasks.map(i => this.generateTaskFormGroup(i)))
    });
  }

  generateTaskFormGroup(personTaskModel: PersonTaskModel = null): FormGroup {
    let formValue = this.generateDefaultValueForTask();

    if (personTaskModel) {
      formValue = {
        ...formValue,
        ...personTaskModel
      };
    }

    return new FormGroup({
      id: new FormControl(formValue.id, [Validators.required]),
      probability: new FormControl(formValue.probability, [Validators.required]),
      tags: new FormArray(formValue.tags.map(i => this.generateTagFormGroup(i.id, i.name, i)))
    });
  }

  generateTagFormGroup(id: string, name: string, personTagModel: PersonTagModel = null): FormGroup {
    const formValue = this.generateDefaultValueForTag(id, name);

    if (personTagModel) {
      formValue.probability = personTagModel.probability;
      formValue.selected = personTagModel.selected;
    }

    return new FormGroup({
      id: new FormControl(id),
      name: new FormControl(name),
      probability: new FormControl(formValue.probability),
      selected: new FormControl(formValue.selected)
    });
  }

  generateDefaultValue(): PersonModel {
    return {
      name: '',
      description: '',
      thumbnail: null,
      iterations: []
    };
  }

  generateDefaultValueForIteration(): PersonIterationModel {
    return {
      name: '',
      duration: '',
      tasks: []
    };
  }

  generateDefaultValueForTask(): PersonTaskModel {
    return {
      id: '',
      probability: '',
      tags: []
    };
  }

  generateDefaultValueForTag(id: string, name: string): PersonTagModel {
    return {
      id,
      name,
      probability: ProbabilityRange.Low,
      selected: false
    };
  }
}
