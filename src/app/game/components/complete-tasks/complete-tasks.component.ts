import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';

import { linkLabels } from '../../../core/constants/link-labels';
import { urlFragments } from '../../../core/constants/url-fragments';

import { SubtaskStates } from '../../../core/enums/subtask-states.enum';

import { Task } from '../../../core/interfaces/task/task.interface';
import { Subtask } from '../../../core/interfaces/subtask/subtask.interface';
import { ModalConfirmCallbacksContainer } from '../../../shared/components/modal-confirm/modal-confirm-callbacks-container.interface';
import { TaskModel } from './interfaces/task-model.interface';
import { SubtaskModel } from './interfaces/subtask-model.interface';

import { GameResultService } from '../../../core/services/game-result/game-result.service';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb.service';
import { ModalSubtaskInfoService } from '../../../core/services/modal-subtask-info/modal-subtask-info.service';
import { ModalConfirmService } from '../../../core/services/modal-confirm/modal-confirm.service';
import { GameService } from '../../services/game/game.service';
import { CompleteTasksPageService } from './services/complete-tasks-page.service';

@Component({
  selector: 'rtg-complete-tasks',
  styleUrls: ['./complete-tasks.component.scss'],
  templateUrl: './complete-tasks.component.html'
})
export class CompleteTasksComponent implements OnInit {
  tasks: Task[];

  subtasks: Subtask[];

  models: TaskModel[];

  taskIdSelected: number;

  subtaskIdSelected: number;

  get subtaskButtonsEnabled(): boolean {
    return typeof this.taskIdSelected === 'number' && typeof this.subtaskIdSelected === 'number';
  }

  constructor(
    private router: Router,
    private gameResultService: GameResultService,
    private breadcrumbService: BreadcrumbService,
    private modalConfirmService: ModalConfirmService,
    private gameService: GameService,
    private completeTasksPageService: CompleteTasksPageService,
    private modalSubtaskInfoService: ModalSubtaskInfoService
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

    this.gameService.registerGameStart();

    this.setBreadcrumb();
    this.loadAndSetModels();
  }

  infoBtnClickHandler() {
    const foundTaskModel = this.models.find(i => i.id === this.taskIdSelected);
    const foundSubtraskModel = foundTaskModel.subtasks.find(i => i.id === this.subtaskIdSelected);

    this.modalSubtaskInfoService.createAndShowSubtaskInfoModal('subtask-info', foundSubtraskModel);
  }

  subtaskClickHandler(taskModel: TaskModel, subtaskModel: SubtaskModel) {
    this.taskIdSelected = taskModel.id;
    this.subtaskIdSelected = subtaskModel.id;
  }

  failBtnClickHandler() {
    this.setStateToSelectedSubtask(SubtaskStates.Failed);
  }

  skipBtnClickHandler() {
    this.setStateToSelectedSubtask(SubtaskStates.Skipped);
  }

  completeBtnClickHandler() {
    this.setStateToSelectedSubtask(SubtaskStates.Completed);
  }

  resetBtnClickHandler() {
    this.setStateToSelectedSubtask(SubtaskStates.Untouched);
  }

  finishButtonClickHandler() {
    const callbacks: ModalConfirmCallbacksContainer = {
      confirm: () => {
        this.gameService.registerGameFinish();

        const gameResult = this.completeTasksPageService.castTaskModelsToDto(this.models);
        this.gameResultService
          .insert(gameResult)
          .pipe(mergeMap(() => this.gameService.clearCurrentPerson()))
          .subscribe(() => {
            this.router.navigate([`${urlFragments.home}`]);
          });
      }
    };

    this.modalConfirmService.createAndShowConfirmModal('confirm-game-finish', callbacks);
  }

  generateSubtaskClasses(taskModel: TaskModel, subtaskModel: SubtaskModel) {
    return {
      failed: subtaskModel.state === SubtaskStates.Failed,
      skipped: subtaskModel.state === SubtaskStates.Skipped,
      completed: subtaskModel.state === SubtaskStates.Completed,
      selected: this.taskIdSelected === taskModel.id && this.subtaskIdSelected === subtaskModel.id
    };
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

  private loadAndSetModels() {
    this.completeTasksPageService.loadModels().subscribe(models => {
      this.models = models;
      this.completeTasksPageService.initModelsByState(models);
    });
  }

  private setStateToSelectedSubtask(state: SubtaskStates) {
    if (!state) {
      throw new Error('State is not specified.');
    }

    const foundTaskModel = this.models.find(i => i.id === this.taskIdSelected);
    const foundSubtraskModel = foundTaskModel.subtasks.find(i => i.id === this.subtaskIdSelected);

    foundSubtraskModel.state = state;
  }
}
