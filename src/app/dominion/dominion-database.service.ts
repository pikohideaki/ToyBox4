import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { UtilitiesService } from '../utilities.service';
import { CardProperty } from './card-property';
import { PlayerName } from './player-name';
import { GameResult } from './game-result';
import { UserInfo } from '../user-info';
import { RandomizerGroup } from './randomizer-group';
import { GameRoom } from './online-game/game-room';
import { GameState } from './online-game/game-state';



@Injectable()
export class DominionDatabaseService {
  public randomizerGroupList$: Observable<{ id: string, selected: false, data: RandomizerGroup }[]>;
  public userInfoList$:        Observable<UserInfo[]>;
  public DominionSetNameList$: Observable<string[]>;
  public cardPropertyList$:    Observable<CardProperty[]>;
  public playersNameList$:     Observable<PlayerName[]>;
  public scoringList$:         Observable<number[][]>;
  public gameResultList$:      Observable<GameResult[]>;
  public gameRoomList$:        Observable<GameRoom[]>;
  public gameStateList$:       Observable<GameState[]>;


  constructor(
    private afDatabase: AngularFireDatabase,
  ) {
    this.randomizerGroupList$
      = this.afDatabase.list('/randomizerGroupList', { preserveSnapshot: true })
          .map( snapshots => snapshots.map( e => ({
                  id: e.key,
                  selected: false,
                  data: new RandomizerGroup( e.val() )
                })) );

    this.userInfoList$
      = this.afDatabase.list('/userInfoList')
          .map( list => list.map( e => new UserInfo(e) ) );

    this.DominionSetNameList$
      = this.afDatabase.list( '/data/DominionSetNameList' )
          .map( list => list.map( e => e.$value ) );

    this.cardPropertyList$
      = this.afDatabase.list( '/data/cardPropertyList' )
          .map( list => list.map( e => new CardProperty(e) ) );

    this.playersNameList$
      = this.afDatabase.list( '/data/playersNameList' )
          .map( list => list.map( e => new PlayerName(e) ) );


    this.scoringList$ = this.afDatabase.list( '/data/scoringList' );

    this.gameResultList$ = Observable.combineLatest(
        this.afDatabase.list( '/data/gameResultList', { preserveSnapshot: true } ),
        this.afDatabase.list( '/data/scoringList' ),
        (gameResultListSnapShots, scoringList: number[][]) => {
              const gameResultList = gameResultListSnapShots.map( e => new GameResult( e.key, e.val() ) );
              gameResultList.forEach( (gr, index) => {
                gr.setScores( scoringList );
                gr.no = index + 1;
              } );
              return gameResultList;
            } );

  this.gameRoomList$
    = this.afDatabase.list( '/onlineGameState', { preserveSnapshot: true } )
        .map( snapshots => snapshots.map( e => new GameState( e.key, e.val() ) ) );

  this.gameStateList$
    = this.afDatabase.list( '/onlineGameRooms', { preserveSnapshot: true } )
        .map( snapshots => snapshots.map( e => new GameRoom( e.key, e.val() ) ) );

  }


  addRandomizerGroup( newGroup ) {
    return this.afDatabase.list('/randomizerGroupList').push( newGroup );
  }

  removeRandomizerGroup( groupID ) {
    return this.afDatabase.list('/randomizerGroupList').remove( groupID );
  }

  updateUserInfo( uid, newUser ) {
    return this.afDatabase.object(`/userInfoList/${uid}`).set( newUser );
  }

  updateUserGroupID( groupID, uid ) {
    return this.afDatabase.object(`/userInfoList/${uid}/myRandomizerGroupID`).set( groupID );
  }

  addGameResult( gameResult: GameResult ) {
    const grObj = {
      date    : gameResult.date.toString(),
      place   : gameResult.place,
      players : gameResult.players.map( pl => ({
          name      : pl.name,
          VP        : pl.VP,
          lessTurns : pl.lessTurns,
        }) ),
      memo                : gameResult.memo,
      selectedDominionSet : gameResult.selectedDominionSet,
      selectedCardsID     : {
        Prosperity      : gameResult.selectedCardsID.Prosperity,
        DarkAges        : gameResult.selectedCardsID.DarkAges,
        KingdomCards10  : gameResult.selectedCardsID.KingdomCards10,
        BaneCard        : gameResult.selectedCardsID.BaneCard,
        EventCards      : gameResult.selectedCardsID.EventCards,
        Obelisk         : gameResult.selectedCardsID.Obelisk,
        LandmarkCards   : gameResult.selectedCardsID.LandmarkCards,
        BlackMarketPile : gameResult.selectedCardsID.BlackMarketPile,
      }
    };

    return this.afDatabase.list('/data/gameResultList').push( grObj );
  }

  removeGameResult( key: string ) {
    return this.afDatabase.list( `/data/gameResultList/${key}` ).remove();
  }
}
