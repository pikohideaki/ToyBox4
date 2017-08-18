import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { UtilitiesService } from '../../utilities.service';
import { DominionDatabaseService } from '../dominion-database.service';

import { GameState } from './game-state';


@Injectable()
export class GameStateService {

  public gameStateList$: Observable<GameState[]>;

  constructor(
    private afDatabase: AngularFireDatabase,
    private utils: UtilitiesService,
    private database: DominionDatabaseService
  ) {
    this.gameStateList$
      = this.afDatabase.list( '/onlineGameState', { preserveSnapshot: true } )
          .map( snapshots => snapshots.map( e => new GameState( e.val(), e.key ) ) );
  }


  addGameState( gameState: GameState ) {
    const gameStateObject = Object(gameState);
    return this.afDatabase.list( '/onlineGameState' ).push( gameState );
  }

  removeGameStateByID( id ) {
    return this.afDatabase.list( '/onlineGameState' ).remove( id );
  }

}
