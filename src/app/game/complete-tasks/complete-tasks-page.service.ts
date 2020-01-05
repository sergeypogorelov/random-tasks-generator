import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, forkJoin, of } from 'rxjs';

import { Task } from '../../core/interfaces/task/task.interface';
import { Subtask } from '../../core/interfaces/subtask/subtask.interface';
import { TaskModel } from './task-model.interface';
import { SubtaskModel } from './subtask-model.interface';

import { FileReaderHelper } from '../../core/helpers/filer-reader/file-reader-helper.class';

import { TaskService } from 'src/app/core/services/task/task.service';
import { SubtaskService } from 'src/app/core/services/subtask/subtask.service';
import { GameService } from '../game.service';
import { Utils } from 'src/app/core/helpers/utils.class';
import { mergeMap } from 'rxjs/operators';
import { SubtaskStates } from 'src/app/core/enums/subtask-states.enum';
import { GameSubtaskMarked } from '../game-subtask-marked.interface';
import { GameTaskMarked } from '../game-task-marked.interface';
import { GameResult } from 'src/app/core/interfaces/game-result/game-result.interface';

@Injectable()
export class CompleteTasksPageService {
  constructor(
    private domSanitizer: DomSanitizer,
    private taskService: TaskService,
    private subtaskService: SubtaskService,
    private gameService: GameService
  ) {}

  loadModels(): Observable<TaskModel[]> {
    const gameTasksToDo = this.gameService.getGameTasksToDo();

    const taskIds = Utils.arrayDistinct(gameTasksToDo.map(i => i.taskId));

    const subtaskIdsNotFlat = gameTasksToDo.map(i => i.subtaskIds);
    const subtaskIds = Utils.arrayDistinct(Utils.arrayFlat(subtaskIdsNotFlat));

    return forkJoin(this.taskService.getByIds(taskIds), this.subtaskService.getByIds(subtaskIds)).pipe(
      mergeMap(results => {
        const tasks = results[0];
        const subtasks = results[1];

        const newResults = gameTasksToDo.map(gameTask => {
          const modelId = gameTask.id;
          const foundTask = tasks.find(i => i.id === gameTask.taskId);
          const foundSubtasks = gameTask.subtaskIds.map(id => subtasks.find(i => i.id === id));

          return this.castTaskDtoToModel(modelId, foundTask, foundSubtasks);
        });

        return of(newResults);
      })
    );
  }

  initModelsByState(models: TaskModel[]) {
    if (!models) {
      throw new Error('Models are not specified.');
    }

    const tasksMarked = this.gameService.getTasksMarked();

    for (const model of models) {
      const taskMarked = tasksMarked.find(i => i.id === model.id);

      if (taskMarked) {
        for (const subtaskMarked of taskMarked.subtasks) {
          const modelSubtask = model.subtasks.find(i => i.id === subtaskMarked.id);

          if (modelSubtask) {
            modelSubtask.state = subtaskMarked.state;
          }
        }
      }
    }

    const newTasksMarked = models.map(i => this.castTaskModelToTaskMarked(i));

    this.gameService.setTasksMarked(newTasksMarked);
  }

  castTaskModelToTaskMarked(model: TaskModel): GameTaskMarked {
    const result: GameTaskMarked = {
      id: model.id,
      taskId: model.taskId,
      subtasks: model.subtasks.map(i => this.castSubtaskModelToSubtaskMarked(i))
    };

    return result;
  }

  castSubtaskModelToSubtaskMarked(model: SubtaskModel): GameSubtaskMarked {
    const result: GameSubtaskMarked = {
      id: model.id,
      state: model.state
    };

    return result;
  }

  castTaskModelsToDto(models: TaskModel[]): GameResult {
    let index = 0;

    const subtasksNotFlat = models.map(model =>
      model.subtasks.map(i => ({ index: index++, subtaskId: i.id, subtaskState: i.state }))
    );

    const result: GameResult = {
      personId: this.gameService.getCurrentPerson().id,
      startDate: new Date(this.gameService.getStartDate()),
      finishDate: new Date(this.gameService.getFinishDate()),
      subtasks: Utils.arrayFlat(subtasksNotFlat)
    };

    return result;
  }

  castTaskDtoToModel(modelId: number, task: Task, subtasks: Subtask[]): TaskModel {
    const thumbnailDateUrl = FileReaderHelper.arrayBufferToDataUrl(task.thumbnail.arrayBuffer, task.thumbnail.type);
    const thumbnailSafeUrl = this.domSanitizer.bypassSecurityTrustUrl(thumbnailDateUrl);

    const result: TaskModel = {
      id: modelId,
      taskId: task.id,
      name: task.name,
      description: task.description,
      subtasks: subtasks.map(i => this.castSubtaskDtoToModel(i)),
      thumbnailDateUrl,
      thumbnailSafeUrl
    };

    return result;
  }

  castSubtaskDtoToModel(subtask: Subtask): SubtaskModel {
    const thumbnailDateUrl = FileReaderHelper.arrayBufferToDataUrl(
      subtask.thumbnail.arrayBuffer,
      subtask.thumbnail.type
    );
    const thumbnailSafeUrl = this.domSanitizer.bypassSecurityTrustUrl(thumbnailDateUrl);

    const result: SubtaskModel = {
      id: subtask.id,
      name: subtask.name,
      description: subtask.description,
      thumbnailDateUrl,
      thumbnailSafeUrl,
      state: SubtaskStates.Untouched
    };

    return result;
  }
}
