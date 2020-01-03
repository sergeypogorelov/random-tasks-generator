import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';

import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';
import { GameService } from '../game.service';
import { GameStateService } from '../game-state.service';
import { Observable, forkJoin } from 'rxjs';
import { Task } from 'src/app/core/interfaces/task/task.interface';
import { TaskService } from 'src/app/core/services/task/task.service';
import { Subtask } from 'src/app/core/interfaces/subtask/subtask.interface';
import { tap } from 'rxjs/operators';
import { SubtaskService } from 'src/app/core/services/subtask/subtask.service';

@Component({
  selector: 'rtg-get-tasks',
  styleUrls: ['./get-tasks.component.scss'],
  templateUrl: './get-tasks.component.html'
})
export class GetTasksComponent implements OnInit {
  tasks: Task[];

  subtasks: Subtask[];

  constructor(
    private router: Router,
    private taskService: TaskService,
    private subtaskService: SubtaskService,
    private breadcrumbService: BreadcrumbService,
    private gameService: GameService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit() {
    const person = this.gameService.getCurrentPerson();

    if (!person) {
      this.router.navigate([`/${urlFragments.game}`, urlFragments.gameChilds.selectPerson]);
      return;
    }

    this.setBreadcrumb();
    const gameTasks = this.gameService.getGameTasks();
    console.log(gameTasks);
  }

  finishButtonClickHandler() {
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

  private loadAndSetEntities(): Observable<[Task[], Subtask[]]> {
    return forkJoin(this.loadAndSetTasks(), this.loadAndSetSubtasks());
  }

  private loadAndSetTasks(): Observable<Task[]> {
    return this.taskService.getAll().pipe(tap(tasks => (this.tasks = tasks)));
  }

  private loadAndSetSubtasks(): Observable<Subtask[]> {
    return this.subtaskService.getAllSubtasks().pipe(tap(subtasks => (this.subtasks = subtasks)));
  }
}
