/**
 * mediate all interaction with fire-database
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';


import { UserInfo                    } from './classes/user-info';
import { CardProperty                } from './classes/card-property';
import { SelectedCards               } from './classes/selected-cards';
import { selectedCardsCheckbox } from './classes/selected-cards-checkbox-values';
import { GameResult                  } from './classes/game-result';
import { PlayerName                  } from './classes/player-name';
import { RandomizerGroup             } from './classes/randomizer-group';
import { GameRoom                    } from './classes/game-room';
import { GameState                   } from './classes/game-state';



@Injectable()
export class FireDatabaseMediatorService {
  private fdPath = {
    userInfoList        : '/userInfoList',
    DominionSetNameList : '/data/DominionSetNameList',
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
  DominionSetNameList$: Observable<string[]>;
  cardPropertyList$:    Observable<CardProperty[]>;
  playersNameList$:     Observable<PlayerName[]>;
  scoringList$:         Observable<number[][]>;
  gameResultList$:      Observable<GameResult[]>;
  randomizerGroupList$: Observable<RandomizerGroup[]>;
  onlineGameRoomList$:  Observable<GameRoom[]>;
  onlineGameStateList$: Observable<GameState[]>;



  /* methods */
  userInfo: {
    set: ( uid, newUser ) => firebase.Promise<void>,
    setProperty: ( uid: string, propertyName: string, value ) => firebase.Promise<void>,
    setGroupID: ( uid, groupID ) => firebase.Promise<void>,
  };

  // playersNameList: {};

  // scoringList: {};

  gameResult: {
    add: ( gameResult: GameResult ) => firebase.database.ThenableReference,
    remove: ( key: string ) => firebase.Promise<void>,
  };

  randomizerGroup: {
    addGroup: ( newGroup: RandomizerGroup ) => firebase.database.ThenableReference,
    removeGroup: ( groupID: string ) => firebase.Promise<void>,
    setValue: ( groupID: string, pathSuffix: string, value ) => firebase.Promise<void>,
    addValue: ( groupID: string, pathSuffix: string, value ) => firebase.database.ThenableReference,
    set: {
      randomizerButtonLocked:       ( groupID: string, value: boolean ) => firebase.Promise<void>,
      DominionSetSelected:          ( groupID: string, index: number, value: boolean ) => firebase.Promise<void>,
      selectedCards:                ( groupID: string, value: SelectedCards ) => firebase.Promise<void>,
      selectedCardsCheckbox:        ( groupID: string, arrayName: string, index: number, value: boolean ) => firebase.Promise<void>,
      resetSelectedCardsCheckbox:   ( groupID: string ) => firebase.Promise<void>,
      BlackMarketPileShuffled:      ( groupID: string, value: { cardIndex: number, faceUp: boolean }[] ) => firebase.Promise<void>,
      BlackMarketPhase:             ( groupID: string, value: number ) => firebase.Promise<void>,
      newGameResultPlayerSelected:  ( groupID: string, playerIndex: number, value: boolean ) => firebase.Promise<void>,
      newGameResultPlayerVP:        ( groupID: string, playerIndex: number, value: number ) => firebase.Promise<void>,
      newGameResultPlayerWinByTurn: ( groupID: string, playerIndex: number, value: boolean ) => firebase.Promise<void>,
      resetVPCalculatorOfPlayer:    ( groupID: string, playerIndex: number, value: boolean ) => firebase.Promise<void>,
      newGameResultPlace:           ( groupID: string, value: string ) => firebase.Promise<void>,
      newGameResultMemo:            ( groupID: string, value: string ) => firebase.Promise<void>,
      startPlayerName:              ( groupID: string, value: string ) => firebase.Promise<void>,
      newGameResultDialogOpened:    ( groupID: string, value: boolean ) => firebase.Promise<void>,
    },
  };

  onlineGameRoom: {
    add: ( newGameRoom: GameRoom ) => firebase.database.ThenableReference,
    remove: ( roomID: string ) => firebase.Promise<void>,
    addMember: ( roomID: string, playerName: string ) => firebase.database.ThenableReference,
    removeMember: ( roomID: string, playerID: string ) => firebase.Promise<void>,
    setWaitingForPlayersValue: ( roomID: string, value: boolean ) => firebase.Promise<void>,
  }

  onlineGameState: {
    add: ( gameState: GameState ) => firebase.database.ThenableReference,
    remove: ( id ) => firebase.Promise<void>,
  };







  constructor(
    private afdb: AngularFireDatabase,
  ) {
    this.userInfoList$
      = this.afdb.list( this.fdPath.userInfoList )
          .map( list => list.map( e => new UserInfo(e) ) );

    this.DominionSetNameList$
      = this.afdb.list( this.fdPath.DominionSetNameList )
          .map( list => list.map( e => e.$value ) );

    this.cardPropertyList$
      = this.afdb.list( this.fdPath.cardPropertyList )
          .map( list => list.map( e => new CardProperty(e) ) );

    this.playersNameList$
      = this.afdb.list( this.fdPath.playersNameList )
          .map( list => list.map( e => new PlayerName(e) ) );

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

    this.userInfo = {
      set: ( uid, newUser ) =>
        this.afdb.object(`${this.fdPath.userInfoList}/${uid}`).set( newUser ),

      setProperty: ( uid: string, propertyName: string, value ) =>
        this.afdb.object( `${this.fdPath.userInfoList}/${uid}/${propertyName}` ).set( value ),

      setGroupID: ( uid, groupID ) =>
        this.afdb.object( `${this.fdPath.userInfoList}/${uid}/myRandomizerGroupID` ).set( groupID ),
    }


    this.randomizerGroup = {
      addGroup: newGroup =>
        this.afdb.list( this.fdPath.randomizerGroupList ).push( newGroup ),

      removeGroup: groupID =>
        this.afdb.list( this.fdPath.randomizerGroupList ).remove( groupID ),

      setValue: ( groupID: string, pathSuffix: string, value ) =>
        this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/${pathSuffix}` ).set( value ),

      addValue: ( groupID: string, pathSuffix: string, value ) =>
        this.afdb.list( `${this.fdPath.randomizerGroupList}/${groupID}/${pathSuffix}` ).push( value ),

      set: {
        randomizerButtonLocked: ( groupID: string, locked: boolean ) =>
          this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/randomizerButtonLocked` )
            .set( locked ),

        DominionSetSelected: ( groupID: string, index: number, value: boolean ) =>
          this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/selectedDominionSet/${index}` )
            .set( value ),

        selectedCards: ( groupID: string, value: SelectedCards ) =>
          this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/selectedCards` )
            .set( value ),

        selectedCardsCheckbox: ( groupID: string, arrayName: string, index: number, value: boolean ) =>
          this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/selectedCardsCheckbox/${arrayName}/${index}` )
            .set( value ),

        resetSelectedCardsCheckbox: ( groupID: string ) =>
          this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/selectedCardsCheckbox` )
            .set( new selectedCardsCheckbox() ),

        BlackMarketPileShuffled: ( groupID: string, value: { cardIndex: number, faceUp: boolean }[] ) =>
          this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/BlackMarketPileShuffled` )
            .set( value ),

        BlackMarketPhase: ( groupID: string, value: number ) =>
          this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/BlackMarketPhase` )
            .set( value ),

        newGameResultPlayerSelected: ( groupID: string, playerIndex: number, value: boolean ) =>
          this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/newGameResult/players/${playerIndex}/selected` )
            .set( value ),

        newGameResultPlayerVP: ( groupID: string, playerIndex: number, value: number ) =>
          this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/newGameResult/players/${playerIndex}/VP` )
            .set( value ),

        newGameResultPlayerWinByTurn: ( groupID: string, playerIndex: number, value: boolean ) =>
          this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/newGameResult/players/${playerIndex}/winByTurn` )
            .set( value ),

        newGameResultPlace: ( groupID: string, value: string ) =>
          this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/newGameResult/place` )
            .set( value ),

        newGameResultMemo: ( groupID: string, value: string ) =>
          this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/newGameResult/memo` )
            .set( value ),

        resetVPCalculatorOfPlayer: ( groupID: string, playerIndex: number, value: boolean ) =>
          this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/resetVPCalculator/${playerIndex}` )
            .set( value ),

        startPlayerName: ( groupID: string, value: string ) =>
          this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/startPlayerName` )
            .set( value ),

        newGameResultDialogOpened: ( groupID: string, value: boolean ) =>
          this.afdb.object( `${this.fdPath.randomizerGroupList}/${groupID}/newGameResultDialogOpened` )
            .set( value ),

        }

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
        }),

      remove: ( key: string ) =>
        this.afdb.list( `${this.fdPath.gameResultList}/${key}` ).remove(),
    }


    this.onlineGameRoom = {
      add: ( newGameRoom: GameRoom ) => {
        const newGameRoomObject = Object(newGameRoom);
        newGameRoomObject.timeStamp = newGameRoomObject.timeStamp.toString();
        delete newGameRoomObject.id;
        return this.afdb.list( this.fdPath.onlineGameRoomsList ).push( newGameRoom );
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
      add: ( gameState: GameState ) =>
        this.afdb.list( this.fdPath.onlineGameStateList ).push( Object(gameState) ),

      remove: ( id ) =>
        this.afdb.list( this.fdPath.onlineGameStateList ).remove( id ),
    }


  }

}
