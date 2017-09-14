/**
 * mediate all interaction with fire-database
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';


import { UserInfo              } from './classes/user-info';
import { CardProperty          } from './classes/card-property';
import { SelectedCards         } from './classes/selected-cards';
import { SelectedCardsCheckbox } from './classes/selected-cards-checkbox-values';
import { GameResult            } from './classes/game-result';
import { PlayerName            } from './classes/player-name';
import { RandomizerGroup       } from './classes/randomizer-group';
import { GameRoom              } from './classes/game-room';
import { GameState             } from './classes/game-state';
import { BlackMarketPileCard   } from './classes/black-market-pile-card';



@Injectable()
export class FireDatabaseMediatorService {
  private fdPath = {
    userInfoList        : '/userInfoList',
    expansionsNameList  : '/data/expansionsNameList',
    cardPropertyList    : '/data/cardPropertyList',
    playersNameList     : '/data/playersNameList',
    scoringList         : '/data/scoringList',
    gameResultList      : '/data/gameResultList',
    randomizerGroupList : '/randomizerGroupList',
    onlineGameStateList : '/onlineGameStateList',
    onlineGameRoomsList : '/onlineGameRoomsList',
  };

  /* observables */
  userInfoList$:        Observable<UserInfo[]>;
  expansionsNameList$:  Observable<string[]>;
  cardPropertyList$:    Observable<CardProperty[]>;
  playersNameList$:     Observable<PlayerName[]>;
  scoringList$:         Observable<number[][]>;
  gameResultList$:      Observable<GameResult[]>;
  randomizerGroupList$: Observable<RandomizerGroup[]>;
  onlineGameRoomList$:  Observable<GameRoom[]>;
  onlineGameStateList$: Observable<GameState[]>;



  /* methods */
  userInfo: {
    setUserInfo: ( uid: string, newUser: UserInfo ) => firebase.Promise<void>,
    set: {
      name:              ( uid: string, value: string ) => firebase.Promise<void>,
      randomizerGroupID: ( uid: string, value: string ) => firebase.Promise<void>,
      onlineGame: {
        isSelectedExpansions: ( uid: string, value: boolean[] ) => firebase.Promise<void>,
        numberOfPlayers:      ( uid: string, value: number    ) => firebase.Promise<void>,
        roomID:               ( uid: string, value: string    ) => firebase.Promise<void>,
        gameStateID:          ( uid: string, value: string    ) => firebase.Promise<void>,
      }
    }
  };

  // playersNameList: {};

  // scoringList: {};

  gameResult: {
    add:    ( gameResult: GameResult ) => firebase.database.ThenableReference,
    remove: ( key: string )            => firebase.Promise<void>,
  };

  randomizerGroup: {
    addGroup:    ( newGroup: RandomizerGroup ) => firebase.database.ThenableReference,
    removeGroup: ( groupID: string )           => firebase.Promise<void>,
    set: {
      randomizerButtonLocked:  ( groupID: string, value: boolean )                                   => firebase.Promise<void>,
      isSelectedExpansions:    ( groupID: string, index: number, value: boolean )                    => firebase.Promise<void>,
      selectedCards:           ( groupID: string, value: SelectedCards )                             => firebase.Promise<void>,
      selectedCardsCheckbox:   ( groupID: string, arrayName: string, index: number, value: boolean ) => firebase.Promise<void>,
      BlackMarketPileShuffled: ( groupID: string, value: BlackMarketPileCard[] )                     => firebase.Promise<void>,
      BlackMarketPhase:        ( groupID: string, value: number )                                    => firebase.Promise<void>,
      startPlayerName:           ( groupID: string, value: string  ) => firebase.Promise<void>,
      newGameResultDialogOpened: ( groupID: string, value: boolean ) => firebase.Promise<void>,
      newGameResult: {
        players: {
          selected:  ( groupID: string, playerId: string, value: boolean ) => firebase.Promise<void>,
          VP:        ( groupID: string, playerId: string, value: number  ) => firebase.Promise<void>,
          winByTurn: ( groupID: string, playerId: string, value: boolean ) => firebase.Promise<void>,
        },
        place: ( groupID: string, value: string ) => firebase.Promise<void>,
        memo:  ( groupID: string, value: string ) => firebase.Promise<void>,
      },
    },
    addToSelectedCardsHistory: ( groupID: string, value: SelectedCards ) => firebase.database.ThenableReference,
    resetSelectedCards: ( groupID: string ) => firebase.Promise<void>,
    resetSelectedCardsCheckbox: ( groupID: string ) => firebase.Promise<void>,
    resetVPCalculator: ( groupID: string ) => firebase.Promise<void>,
  };

  onlineGameRoom: {
    add:                       ( newGameRoom: GameRoom )              => firebase.database.ThenableReference,
    remove:                    ( roomID: string )                     => firebase.Promise<void>,
    addMember:                 ( roomID: string, playerName: string ) => firebase.database.ThenableReference,
    removeMember:              ( roomID: string, playerID: string )   => firebase.Promise<void>,
    setWaitingForPlayersValue: ( roomID: string, value: boolean )     => firebase.Promise<void>,
  }

  onlineGameState: {
    add: ( gameState: GameState ) => firebase.database.ThenableReference,
    remove: ( id: string ) => firebase.Promise<void>,
  };







  constructor(
    private afdb: AngularFireDatabase,
  ) {
    this.userInfoList$
      = this.afdb.list( this.fdPath.userInfoList, { preserveSnapshot: true } )
          .map( snapshots => snapshots.map( e => new UserInfo( e.key, e.val() ) ) );

    this.expansionsNameList$
      = this.afdb.list( this.fdPath.expansionsNameList )
          .map( list => list.map( e => e.$value ) );

    this.cardPropertyList$
      = this.afdb.list( this.fdPath.cardPropertyList )
          .map( list => list.map( e => new CardProperty(e) ) );

    this.playersNameList$
      = this.afdb.list( this.fdPath.playersNameList, { preserveSnapshot: true } )
          .map( snapshots => snapshots.map( e => new PlayerName( e.key, e.val() ) ) );

    this.scoringList$
      = this.afdb.list( this.fdPath.scoringList );

    this.gameResultList$
      = Observable.combineLatest(
          this.afdb.list( this.fdPath.gameResultList, { preserveSnapshot: true } ),
          this.afdb.list( this.fdPath.scoringList ),
          (gameResultListSnapShots, scoringList: number[][]) => {
              const gameResultList = gameResultListSnapShots.map( e => new GameResult( e.key, e.val() ) );
              gameResultList.forEach( (gr, index) => {
                gr.setScores( scoringList );
                gr.no = index + 1;
              } );
              return gameResultList;
            } );

    this.randomizerGroupList$
      = this.afdb.list( this.fdPath.randomizerGroupList, { preserveSnapshot: true })
          .map( snapshots => snapshots.map( e => new RandomizerGroup( e.key, e.val() ) ) );

    this.onlineGameRoomList$
      = this.afdb.list( this.fdPath.onlineGameRoomsList, { preserveSnapshot: true } )
          .map( snapshots => snapshots.map( e => new GameState( e.key, e.val() ) ) );

    this.onlineGameStateList$
      = this.afdb.list( this.fdPath.onlineGameStateList, { preserveSnapshot: true } )
          .map( snapshots => snapshots.map( e => new GameRoom( e.key, e.val() ) ) );



    /*** methods ***/

    const userInfoSetProperty = ( uid: string, pathPrefix: string, value: any ) => {
      if ( !uid ) throw new Error('uid is empty')
      return this.afdb.object( `${this.fdPath.userInfoList}/${uid}/${pathPrefix}` )
                      .set( value );
    };

    this.userInfo = {
      setUserInfo: ( uid: string, newUser: UserInfo ) => {
        const newUserObj = JSON.parse( JSON.stringify(newUser) );
        delete newUserObj.databaseKey;
        return this.afdb.object(`${this.fdPath.userInfoList}/${uid}`).set( newUserObj );
      },

      set: {
        name: ( uid: string, value: string ) =>
          userInfoSetProperty( uid, 'name', value ),

        randomizerGroupID: ( uid: string, value: string ) =>
          userInfoSetProperty( uid, 'randomizerGroupID', value ),

        onlineGame: {
          isSelectedExpansions: ( uid: string, value: boolean[] ) =>
            userInfoSetProperty( uid, 'onlineGame/isSelectedExpansions', value ),

          numberOfPlayers: ( uid: string, value: number ) =>
            userInfoSetProperty( uid, 'onlineGame/numberOfPlayers', value ),

          roomID: ( uid: string, value: string ) =>
            userInfoSetProperty( uid, 'onlineGame/roomID', value ),

          gameStateID: ( uid: string, value: string ) =>
            userInfoSetProperty( uid, 'onlineGame/gameStateID', value ),
        }
      }
    }



    const randomizerGroupSetValue = ( groupID: string, pathPrefix: string, value: any ) => {
      if ( !groupID ) throw new Error('groupID is empty');
      return this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/${pathPrefix}` )
                      .set( value );
    };
    const randomizerGroupPushValue = ( groupID: string, pathPrefix: string, value: any ) => {
      if ( !groupID ) throw new Error('groupID is empty');
      return this.afdb.list( `${this.fdPath.randomizerGroupList}/${groupID}/${pathPrefix}` )
                      .push( value );
    };

    this.randomizerGroup = {
      addGroup: ( newGroup: RandomizerGroup ) => {
        const newGroupObj = JSON.parse( JSON.stringify( newGroup ) );  // deep copy
        newGroupObj.dateString = newGroup.date.toString();
        delete newGroupObj.date;
        delete newGroupObj.databaseKey;
        newGroupObj.newGameResult.players = {};
        console.log(newGroup.newGameResult.players)
        newGroup.newGameResult.players.forEach( e =>
            newGroupObj.newGameResult.players[e.id] = {
              name      : e.name,
              selected  : e.selected,
              VP        : e.VP,
              winByTurn : e.winByTurn,
            } );
        return this.afdb.list( this.fdPath.randomizerGroupList ).push( newGroupObj );
      },

      removeGroup: ( groupID: string ) =>
        this.afdb.list( this.fdPath.randomizerGroupList ).remove( groupID ),

      set: {
        randomizerButtonLocked: ( groupID: string, locked: boolean ) =>
          randomizerGroupSetValue( groupID, 'randomizerButtonLocked', locked ),

        isSelectedExpansions: ( groupID: string, index: number, value: boolean ) =>
          randomizerGroupSetValue( groupID, `isSelectedExpansions/${index}`, value ),

        selectedCards: ( groupID: string, value: SelectedCards ) =>
          randomizerGroupSetValue( groupID, 'selectedCards', value ),

        selectedCardsCheckbox: ( groupID: string, arrayName: string, index: number, value: boolean ) => {
          switch (arrayName) {
            case 'KingdomCards10' :
            case 'BaneCard' :
            case 'EventCards' :
            case 'LandmarkCards' :
            case 'Obelisk' :
            case 'BlackMarketPile' :
              return randomizerGroupSetValue( groupID, `selectedCardsCheckbox/${arrayName}/${index}`, value );

            default :
              console.error( `at fire-database-mediator.service::randomizerGroup::selectedCardsCheckbox : '${arrayName}' is not allowed `);
              return Promise.resolve();
          }
        },

        BlackMarketPileShuffled: ( groupID: string, value: BlackMarketPileCard[] ) =>
          randomizerGroupSetValue( groupID, 'BlackMarketPileShuffled', value ),

        BlackMarketPhase: ( groupID: string, value: number ) =>
          randomizerGroupSetValue( groupID, 'BlackMarketPhase', value ),

        startPlayerName: ( groupID: string, value: string ) =>
          randomizerGroupSetValue( groupID, `startPlayerName`, value ),

        newGameResultDialogOpened: ( groupID: string, value: boolean ) =>
          randomizerGroupSetValue( groupID, `newGameResultDialogOpened`, value ),

        newGameResult: {
          players: {
            selected: ( groupID: string, playerId: string, value: boolean ) =>
              randomizerGroupSetValue( groupID, `newGameResult/players/${playerId}/selected`, value ),

            VP: ( groupID: string, playerId: string, value: number ) =>
              randomizerGroupSetValue( groupID, `newGameResult/players/${playerId}/VP`, value ),

            winByTurn: ( groupID: string, playerId: string, value: boolean ) =>
              randomizerGroupSetValue( groupID, `newGameResult/players/${playerId}/winByTurn`, value ),
          },
          place: ( groupID: string, value: string ) =>
            randomizerGroupSetValue( groupID, `newGameResult/place`, value ),
          memo:  ( groupID: string, value: string ) =>
            randomizerGroupSetValue( groupID, `newGameResult/memo`, value ),
        },
      },

      addToSelectedCardsHistory: ( groupID: string, value: SelectedCards ) =>
        randomizerGroupPushValue( groupID, 'selectedCardsHistory', value ),

      resetSelectedCards: ( groupID: string ) =>
        randomizerGroupSetValue( groupID, 'selectedCards', new SelectedCards() ),

      resetSelectedCardsCheckbox: ( groupID: string ) =>
        randomizerGroupSetValue( groupID, 'selectedCardsCheckbox', new SelectedCardsCheckbox() ),

      resetVPCalculator: ( groupID: string ) =>
        randomizerGroupSetValue( groupID, 'resetVPCalculator', Date.now() ),
    }


    this.gameResult = {
      add: ( gameResult: GameResult ) =>
        this.afdb.list( this.fdPath.gameResultList ).push({
          date    : gameResult.date.toString(),
          place   : gameResult.place,
          players : gameResult.players.map( pl => ({
              name      : pl.name,
              VP        : pl.VP,
              winByTurn : pl.winByTurn,
            }) ),
          memo               : gameResult.memo,
          selectedExpansions : gameResult.selectedExpansions,
          selectedCardsID    : {
            Prosperity      : gameResult.selectedCardsID.Prosperity,
            DarkAges        : gameResult.selectedCardsID.DarkAges,
            KingdomCards10  : gameResult.selectedCardsID.KingdomCards10,
            BaneCard        : gameResult.selectedCardsID.BaneCard,
            EventCards      : gameResult.selectedCardsID.EventCards,
            Obelisk         : gameResult.selectedCardsID.Obelisk,
            LandmarkCards   : gameResult.selectedCardsID.LandmarkCards,
            BlackMarketPile : gameResult.selectedCardsID.BlackMarketPile,
          }
        }),

      remove: ( key: string ) =>
        this.afdb.list( `${this.fdPath.gameResultList}/${key}` ).remove(),
    }



    this.onlineGameRoom = {
      add: ( newGameRoom: GameRoom ) => {
        const newGameRoomObj = JSON.parse( JSON.stringify(newGameRoom) );  // deep copy
        newGameRoomObj.timeStamp = newGameRoomObj.timeStamp.toString();
        delete newGameRoomObj.databaseKey;
        return this.afdb.list( this.fdPath.onlineGameRoomsList ).push( newGameRoomObj );
      },

      remove: ( roomID: string ) =>
        this.afdb.list( this.fdPath.onlineGameRoomsList ).remove( roomID ),

      addMember: ( roomID: string, playerName: string ) =>
        this.afdb.list( `${this.fdPath.onlineGameRoomsList}/${roomID}/players` ).push( playerName ),

      removeMember: ( roomID: string, playerID: string ) =>
        this.afdb.list( `${this.fdPath.onlineGameRoomsList}/${roomID}/players` ).remove( playerID ),

      setWaitingForPlayersValue: ( roomID: string, value: boolean ) =>
        this.afdb.object( `${this.fdPath.onlineGameRoomsList}/${roomID}/waitingForPlayers` ).set( value ),
    }



    this.onlineGameState = {
      add: ( newGameState: GameState ) => {
        const newGameStateObj = JSON.parse( JSON.stringify(newGameState) );  // deep copy
        newGameStateObj.timeStamp = newGameStateObj.timeStamp.toString();
        delete newGameStateObj.databaseKey;
        return this.afdb.list( this.fdPath.onlineGameStateList ).push( newGameStateObj );
      },

      remove: ( id: string ) =>
        this.afdb.list( this.fdPath.onlineGameStateList ).remove( id ),
    }


  }

}
