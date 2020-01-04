import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';

import { Task } from '../../core/interfaces/task/task.interface';
import { Subtask } from '../../core/interfaces/subtask/subtask.interface';
import { GameTask } from '../game-task.interface';
import { TaskModel } from './task-model.interface';
import { SubtaskModel } from './subtask-model.interface';

import { Utils } from '../../core/helpers/utils.class';

import { TaskService } from '../../core/services/task/task.service';
import { SubtaskService } from '../../core/services/subtask/subtask.service';
import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';
import { GameService } from '../game.service';
import { GetTasksPageService } from './get-tasks-page.service';

const TASK_INDEX_BY_DEFAULT = 0;

@Component({
  selector: 'rtg-get-tasks',
  styleUrls: ['./get-tasks.component.scss'],
  templateUrl: './get-tasks.component.html'
})
export class GetTasksComponent implements OnInit, OnDestroy {
  tasks: Task[];

  subtasks: Subtask[];

  gameTasks: GameTask[];

  gameTaskIndex: number;

  taskModel: TaskModel;

  subtaskModels: SubtaskModel[];

  subs: Subscription[] = [];

  get finishBtnEnabled(): boolean {
    if (!this.tasks || !this.gameTasks) {
      return false;
    }

    return this.gameTasks.every(gameTask => {
      const task = this.tasks.find(i => i.id === gameTask.taskId);
      return gameTask.subtaskIds.length >= task.minCount;
    });
  }

  get nextBtnEnabled(): boolean {
    if (!this.gameTasks) {
      return false;
    }

    return this.gameTaskIndex < this.gameTasks.length - 1;
  }

  get prevBtnEnabled(): boolean {
    if (!this.gameTasks) {
      return false;
    }

    return this.gameTasks.length > 1 && this.gameTaskIndex !== 0;
  }

  get subtasksLeft(): number {
    if (!this.tasks || !this.gameTasks) {
      return null;
    }

    const gameTask = this.gameTasks[this.gameTaskIndex];
    const task = this.tasks.find(i => i.id === gameTask.taskId);

    return task.maxCount - gameTask.subtaskIds.length;
  }

  constructor(
    private router: Router,
    private taskService: TaskService,
    private subtaskService: SubtaskService,
    private breadcrumbService: BreadcrumbService,
    private gameService: GameService,
    private getTasksPageService: GetTasksPageService
  ) {
    this.gameTaskIndex = TASK_INDEX_BY_DEFAULT;
  }

  ngOnInit() {
    const person = this.gameService.getCurrentPerson();

    if (!person) {
      this.router.navigate([`/${urlFragments.game}`, urlFragments.gameChilds.selectPerson]);
      return;
    }

    this.setBreadcrumb();
    this.setGameTasks();

    this.loadAndSetEntities().subscribe(() => this.updateModels());
  }

  ngOnDestroy() {
    this.subs.forEach(i => i.unsubscribe());
  }

  prevBtnClickHandler() {
    this.gameTaskIndex--;

    this.loadAndSetEntities().subscribe(() => this.updateModels());
  }

  nextBtnClickHandler() {
    this.gameTaskIndex++;

    this.loadAndSetEntities().subscribe(() => this.updateModels());
  }

  getBtnClickHandler() {
    this.subs.push(
      this.gameService.generateSubtask(this.gameTaskIndex).subscribe(subtask => {
        if (!subtask) {
          console.error('Cannot generate subtask.');
          return;
        }

        this.setGameTasks();

        this.subtasks.push(subtask);
        this.subtaskModels.push(this.getTasksPageService.castSubtaskDtoToModel(subtask));
      })
    );
  }

  finishButtonClickHandler() {
    this.gameService.setGameTasksToDo(this.gameTasks);
    this.router.navigate([`${urlFragments.game}`, urlFragments.gameChilds.completeTasks]);
  }

  private setBreadcrumb() {
    this.breadcrumbService.setItems([
      {
        label: linkLabels.gameChilds.selectPerson,
        routerLink: [`/${urlFragments.game}`, urlFragments.gameChilds.selectPerson]
      },
      {
        label: linkLabels.gameChilds.getTasks
      }
    ]);
  }

  private setGameTasks() {
    this.gameTasks = this.gameService.getGameTasks();
  }

  private updateModels() {
    const gameTask = this.gameTasks[this.gameTaskIndex];

    const task = this.tasks.find(i => i.id === gameTask.taskId);
    const subtasks = this.subtasks.filter(i => gameTask.subtaskIds.includes(i.id));

    this.taskModel = this.getTasksPageService.castTaskDtoToModel(task);
    this.subtaskModels = subtasks.map(i => this.getTasksPageService.castSubtaskDtoToModel(i));
  }

  private loadAndSetEntities(): Observable<[Task[], Subtask[]]> {
    return forkJoin(this.loadAndSetTasks(), this.loadAndSetSubtasks());
  }

  private loadAndSetTasks(): Observable<Task[]> {
    const ids = this.gameTasks.map(i => i.taskId);
    return this.taskService.getByIds(Utils.arrayDistinct(ids)).pipe(tap(tasks => (this.tasks = tasks)));
  }

  private loadAndSetSubtasks(): Observable<Subtask[]> {
    const ids: number[] = [];
    this.gameTasks.forEach(i => ids.push(...i.subtaskIds));
    return this.subtaskService.getByIds(Utils.arrayDistinct(ids)).pipe(tap(subtasks => (this.subtasks = subtasks)));
  }
}
