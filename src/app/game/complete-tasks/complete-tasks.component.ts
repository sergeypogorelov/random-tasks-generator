import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';

import { Task } from '../../core/interfaces/task/task.interface';
import { Subtask } from '../../core/interfaces/subtask/subtask.interface';
import { TaskModel } from './task-model.interface';

import { TaskService } from '../../core/services/task/task.service';
import { SubtaskService } from '../../core/services/subtask/subtask.service';
import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';
import { GameService } from '../game.service';
import { CompleteTasksPageService } from './complete-tasks-page.service';

@Component({
  selector: 'rtg-complete-tasks',
  styleUrls: ['./complete-tasks.component.scss'],
  templateUrl: './complete-tasks.component.html'
})
export class CompleteTasksComponent implements OnInit {
  tasks: Task[];

  subtasks: Subtask[];

  models: TaskModel[];

  constructor(
    private router: Router,
    private taskService: TaskService,
    private subtaskService: SubtaskService,
    private breadcrumbService: BreadcrumbService,
    private gameService: GameService,
    private completeTasksPageService: CompleteTasksPageService
  ) {}

  ngOnInit() {
    const person = this.gameService.getCurrentPerson();

    if (!person) {
      this.router.navigate([`/${urlFragments.game}`, urlFragments.gameChilds.selectPerson]);
      return;
    }

    const gameTasksToDo = this.gameService.getGameTasksToDo();
    if (gameTasksToDo.length === 0) {
      this.router.navigate([`/${urlFragments.game}`, urlFragments.gameChilds.getTasks]);
      return;
    }

    this.setBreadcrumb();

    this.completeTasksPageService.loadModels().subscribe(i => console.log(i));
  }

  finishButtonClickHandler() {
    this.router.navigate([`${urlFragments.home}`]);
  }

  private setBreadcrumb() {
    this.breadcrumbService.setItems([
      {
        label: linkLabels.gameChilds.selectPerson,
        routerLink: [`/${urlFragments.game}`, urlFragments.gameChilds.selectPerson]
      },
      {
        label: linkLabels.gameChilds.getTasks,
        routerLink: [`/${urlFragments.game}`, urlFragments.gameChilds.getTasks]
      },
      {
        label: linkLabels.gameChilds.completeTasks
      }
    ]);
  }
}
