import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
// import * as firebase from 'firebase/app';

import { MyUtilitiesService } from '../my-utilities.service';

import { CardProperty } from './card-property';
import { PlayerName } from './player-name';
import { GameResult } from './game-result';
import { UserInfo } from '../user-info';
import { SyncGroup } from './randomizer/sync-group';

@Injectable()
export class DominionDatabaseService {

  public syncGroups$:          Observable<{ id: string, selected: false, data: SyncGroup }[]>;
  public userInfo$:            Observable<UserInfo[]>;
  public DominionSetNameList$: Observable<string[]>;
  public cardPropertyList$:    Observable<CardProperty[]>;
  public playersNameList$:     Observable<PlayerName[]>;
  public scoringList$:         Observable<number[][]>;
  public gameResultList$:      Observable<GameResult[]>;



  constructor(
    private afDatabase: AngularFireDatabase,
  ) {
    this.syncGroups$          = this.getSyncGroups$();
    this.userInfo$            = this.getUserInfo$();
    this.DominionSetNameList$ = this.getDominionSetNameList$();
    this.cardPropertyList$    = this.getCardPropertyList$();
    this.playersNameList$     = this.getPlayersNameList$();
    this.scoringList$         = this.getScoringList$();
    this.gameResultList$      = this.getGameResultList$();
  }

  getSyncGroups$() {
    return this.afDatabase.list('/syncGroups', { preserveSnapshot: true })
              .map( snapshots => snapshots.map( e => ({ id: e.key, selected: false, data: new SyncGroup( e.val() ) })) );

  }

  addSyncGroup( newGroup ) {
    return this.afDatabase.list('/syncGroups').push( newGroup );
  }

  removeSyncGroup( groupID ) {
    return this.afDatabase.list('/syncGroups').remove( groupID );
  }


  getUserInfo$() {
    return this.afDatabase.list('/userInfo')
             .map( list => list.map( e => new UserInfo(e) ))
  }

  updateUserInfo( uid, newUser ) {
    return this.afDatabase.object(`/userInfo/${uid}`).set( newUser );
  }

  updateUserGroupID( groupID, uid ) {
    return this.afDatabase.object(`/userInfo/${uid}/DominionGroupID`).set( groupID );
  }


  getDominionSetNameList$() {
    return this.afDatabase.list( '/data/DominionSetNameList' )
                .map( list => list.map( e => e.$value ) );
  }


  getCardPropertyList$() {
    return this.afDatabase.list( '/data/cardPropertyList' )
             .map( list => list.map( val => new CardProperty( val ) ) );
  }


  getPlayersNameList$() {
    return this.afDatabase.list( '/data/playersNameList' )
             .map( list => list.map( e => new PlayerName(e) ) );
  }


  getScoringList$() {
    return this.afDatabase.list( '/data/scoringList' );
  }


  getGameResultList$() {
    return Observable.combineLatest(
          this.afDatabase.list( '/data/gameResultList', { preserveSnapshot: true } ),
          this.afDatabase.list( '/data/scoringList' ),
          (gameResultListSnapShots, scoringList: number[][]) => {
                const gameResultList = gameResultListSnapShots.map( e => new GameResult(e.val(), e.key) );
                gameResultList.forEach( (gr, index) => {
                  gr.setScores( scoringList );
                  gr.no = index + 1;
                } );
                return gameResultList;
              } );
  }

  addGameResult( gameResult ) {
    return this.afDatabase.list('/data/gameResultList').push( gameResult );
  }

  removeGameResult( key: string ) {
    return this.afDatabase.list( `/data/gameResultList/${key}` ).remove();
  }
}
