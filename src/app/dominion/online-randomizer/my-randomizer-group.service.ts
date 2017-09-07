import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FireDatabaseMediatorService } from '../../fire-database-mediator.service';
import { MyUserInfoService } from '../../my-user-info.service';

import { RandomizerGroup             } from '../../classes/randomizer-group';
import { PlayerName                  } from '../../classes/player-name';
import { SelectedCards               } from '../../classes/selected-cards';
import { selectedCardsCheckbox } from '../../classes/selected-cards-checkbox-values';


@Injectable()
export class MyRandomizerGroupService {
  private myRandomizerGroupID: string = '';
  myRandomizerGroup$: Observable<RandomizerGroup>;
  signedIn$: Observable<boolean>;
  signedIn: boolean;

  constructor(
    private database: FireDatabaseMediatorService,
    private myUserInfo: MyUserInfoService
  ) {
    this.myUserInfo.myRandomizerGroupID$.subscribe( val => this.myRandomizerGroupID = val );

    this.myUserInfo.signedIn$.subscribe( val => this.signedIn = val );

    this.myRandomizerGroup$ = Observable.combineLatest(
      this.database.randomizerGroupList$,
      this.myUserInfo.myRandomizerGroupID$,
      (list, id) => (list.find( e => e.databaseKey === id ) || new RandomizerGroup() ) );

  }


  addToSelectedCardsHistory( newSelectedCards: SelectedCards ) {
  }


  setRandomizerButtonLocked( locked: boolean ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.set.randomizerButtonLocked( this.myRandomizerGroupID, locked );
  }

  setDominionSetSelected( index: number, value: boolean ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.set.DominionSetSelected( this.myRandomizerGroupID, index, value );
  }

  setSelectedCards( newSelectedCards: SelectedCards ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.set.selectedCards( this.myRandomizerGroupID, newSelectedCards );
  }

  setSelectedCardsCheckbox( arrayName: string, index: number, value: boolean ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.set.selectedCardsCheckbox( this.myRandomizerGroupID, arrayName, index, value );
  }

  resetSelectedCardsCheckbox() {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.set.resetSelectedCardsCheckbox( this.myRandomizerGroupID );
  }

  setBlackMarketPileShuffled( BlackMarketPileShuffled: { cardIndex: number, faceUp: boolean }[] ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.set.BlackMarketPileShuffled( this.myRandomizerGroupID, BlackMarketPileShuffled );
  }

  setBlackMarketPhase( BlackMarketPhase: number ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.set.BlackMarketPhase( this.myRandomizerGroupID, BlackMarketPhase );
  }

  setResetVPCalculatorOfPlayer( playerIndex: number, value: boolean ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.set.resetVPCalculatorOfPlayer( this.myRandomizerGroupID, playerIndex, value );
  }

  setStartPlayerName( value: string ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.set.startPlayerName( this.myRandomizerGroupID, value );
  }

  setNewGameResultPlayerSelected( playerIndex: number, value: boolean ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.set.newGameResultPlayerSelected( this.myRandomizerGroupID, playerIndex, value );
  }

  setNewGameResultPlayerVP( playerIndex: number, value: number ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.set.newGameResultPlayerVP( this.myRandomizerGroupID, playerIndex, value );
  }

  setNewGameResultPlayerWinByTurn( playerIndex: number, value: boolean ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.set.newGameResultPlayerWinByTurn( this.myRandomizerGroupID, playerIndex, value );
  }

  setNewGameResultPlace( value: string ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.set.newGameResultPlace( this.myRandomizerGroupID, value );
  }

  setNewGameResultMemo( value: string ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.set.newGameResultMemo( this.myRandomizerGroupID, value );
  }

  setNewGameResultDialogOpened( value: boolean ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.set.newGameResultDialogOpened( this.myRandomizerGroupID, value );
  }

}
