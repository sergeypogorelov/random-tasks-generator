import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { RtgDbSchema } from '../../interfaces/rtg-db-schema.interface';
import { GameResult } from '../../interfaces/game-result/game-result.interface';

import { IdbService } from '../../../idb/services/idb/idb.service';

@Injectable()
export class GameResultService {
  constructor(private idbService: IdbService) {}

  getById(id: number): Observable<GameResult> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.get('game-result', id)));
  }

  insert(gameResult: GameResult): Observable<GameResult> {
    if (!gameResult) {
      throw new Error('Game result is not specified.');
    }

    return this.idbService
      .openDB<RtgDbSchema>()
      .pipe(mergeMap(db => db.add('game-result', gameResult)))
      .pipe(mergeMap(id => this.getById(id)));
  }
}
