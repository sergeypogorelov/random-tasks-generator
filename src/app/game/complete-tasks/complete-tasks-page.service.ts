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
