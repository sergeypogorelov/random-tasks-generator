import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { SubtaskStates } from '../../../../core/enums/subtask-states.enum';

import { Task } from '../../../../core/interfaces/task/task.interface';
import { Subtask } from '../../../../core/interfaces/subtask/subtask.interface';
import { GameResult } from '../../../../core/interfaces/game-result/game-result.interface';
import { TaskModel } from '../interfaces/task-model.interface';
import { SubtaskModel } from '../interfaces/subtask-model.interface';
import { GameSubtaskMarked } from '../../../interfaces/game-subtask-marked.interface';
import { GameTaskMarked } from '../../../interfaces/game-task-marked.interface';

import { Utils } from '../../../../core/helpers/utils.class';

import { TaskService } from '../../../../core/services/task/task.service';
import { SubtaskService } from '../../../../core/services/subtask/subtask.service';
import { GameService } from '../../../services/game/game.service';
import { ObjectUrlService } from 'src/app/core/services/object-url/object-url.service';

const TAG = 'complete-tasks-page-service';

@Injectable()
export class CompleteTasksPageService {
  constructor(
    private taskService: TaskService,
    private subtaskService: SubtaskService,
    private objectUrlService: ObjectUrlService,
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
    const imgInfo = this.objectUrlService.createImgUrl(TAG, task.thumbnail);
    const thumbnailDateUrl = imgInfo.dataUrl;
    const thumbnailSafeUrl = imgInfo.safeUrl;

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
    const imgInfo = this.objectUrlService.createImgUrl(TAG, subtask.thumbnail);
    const thumbnailDateUrl = imgInfo.dataUrl;
    const thumbnailSafeUrl = imgInfo.safeUrl;

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

  revokeImgUrls() {
    this.objectUrlService.revokeUrlsByTag(TAG);
  }
}
