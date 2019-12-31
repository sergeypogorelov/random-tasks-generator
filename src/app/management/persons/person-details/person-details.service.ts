import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { ProbabilityRange } from '../../../core/enums/probability-range.enum';

import { Tag } from '../../../core/interfaces/tag/tag.interface';
import { Person } from '../../../core/interfaces/person/person.interface';
import { PersonIteration } from '../../../core/interfaces/person/person-iteration.interface';
import { PersonIterationTask } from '../../../core/interfaces/person/person-iteration-task.interface';
import { PersonIterationTag } from '../../../core/interfaces/person/person-iteration-tag.interface';

import { PersonModel } from './interfaces/person-model.interface';
import { PersonIterationModel } from './interfaces/person-iteration-model.interface';
import { PersonTaskModel } from './interfaces/person-task-model.interface';
import { PersonTagModel } from './interfaces/person-tag-model.interface';

@Injectable()
export class PersonDetailsService {
  castModelToDto(model: PersonModel): Person {
    if (!model) {
      throw new Error('Model is not specified.');
    }

    const result: Person = {
      name: model.name,
      description: model.description,
      thumbnail: model.thumbnail,
      startDate: model.startDate,
      iterations: model.iterations.map(i => this.castIterationModelToDto(i))
    };

    return result;
  }

  castIterationModelToDto(iterationModel: PersonIterationModel): PersonIteration {
    if (!iterationModel) {
      throw new Error('Iteration model is not specified.');
    }

    const result: PersonIteration = {
      name: iterationModel.name,
      duration: +iterationModel.duration,
      tasks: iterationModel.tasks.map(i => this.castTaskModelToDto(i))
    };

    return result;
  }

  castTaskModelToDto(taskModel: PersonTaskModel): PersonIterationTask {
    if (!taskModel) {
      throw new Error('Task model is not specified.');
    }

    const result: PersonIterationTask = {
      taskId: +taskModel.id,
      probability: +taskModel.probability,
      tags: taskModel.tags.map(i => this.castTagModelToDto(i))
    };

    return result;
  }

  castTagModelToDto(tagModel: PersonTagModel): PersonIterationTag {
    if (!tagModel) {
      throw new Error('Tag model is not specified.');
    }

    const result: PersonIterationTag = {
      tagId: +tagModel.id,
      probability: tagModel.probability,
      selected: tagModel.selected
    };

    return result;
  }

  castDtoToModel(person: Person, allTags: Tag[]): PersonModel {
    if (!person) {
      throw new Error('Person is not specified.');
    }

    const result: PersonModel = {
      name: person.name,
      description: person.description,
      thumbnail: person.thumbnail,
      startDate: person.startDate,
      iterations: person.iterations.map(i => this.castIterationDtoToModel(i, allTags))
    };

    return result;
  }

  castIterationDtoToModel(iteration: PersonIteration, allTags: Tag[]): PersonIterationModel {
    if (!iteration) {
      throw new Error('Iteration is not specified.');
    }

    const result: PersonIterationModel = {
      name: iteration.name,
      duration: `${iteration.duration}`,
      tasks: iteration.tasks.map(i => this.castTaskDtoToModel(i, allTags))
    };

    return result;
  }

  castTaskDtoToModel(task: PersonIterationTask, allTags: Tag[]): PersonTaskModel {
    if (!task) {
      throw new Error('Task is not specified.');
    }

    const result: PersonTaskModel = {
      id: `$${task.taskId}`,
      probability: `${task.probability}`,
      tags: task.tags.map(i => this.castTagDtoToModel(i, allTags))
    };

    return result;
  }

  castTagDtoToModel(tag: PersonIterationTag, allTags: Tag[]): PersonTagModel {
    if (!tag) {
      throw new Error('Tag is not specified.');
    }

    const realTag = allTags.find(i => i.id === tag.tagId);
    if (!realTag) {
      throw new Error(`Cannot map the tag by its id. The tag id is '${tag.tagId}'.`);
    }

    const result: PersonTagModel = {
      id: `${realTag.id}`,
      name: realTag.name,
      probability: tag.probability,
      selected: tag.selected
    };

    return result;
  }

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
      startDate: new FormControl(formValue.startDate, [Validators.required]),
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
      startDate: '',
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
