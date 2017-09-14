import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FireDatabaseMediatorService } from '../../fire-database-mediator.service';
import { MyUserInfoService } from '../../my-user-info.service';

import { RandomizerGroup       } from '../../classes/randomizer-group';
import { PlayerName            } from '../../classes/player-name';
import { SelectedCards         } from '../../classes/selected-cards';
import { SelectedCardsCheckbox } from '../../classes/selected-cards-checkbox-values';
import { BlackMarketPileCard   } from '../../classes/black-market-pile-card';


@Injectable()
export class MyRandomizerGroupService {
  private myRandomizerGroupID: string = '';

  private myRandomizerGroup$: Observable<RandomizerGroup>
   = Observable.combineLatest(
      this.database.randomizerGroupList$,
      this.myUserInfo.randomizerGroupID$,
      (list, id) => (list.find( e => e.databaseKey === id ) || new RandomizerGroup() ) );

  private signedIn: boolean;


  name$                      = this.myRandomizerGroup$.map( e => e.name                      ).distinctUntilChanged();
  randomizerButtonLocked$    = this.myRandomizerGroup$.map( e => e.randomizerButtonLocked    ).distinctUntilChanged();
  isSelectedExpansions$      = this.myRandomizerGroup$.map( e => e.isSelectedExpansions      ).distinctUntilChanged();
  selectedCards$             = this.myRandomizerGroup$.map( e => e.selectedCards             ).distinctUntilChanged();
  selectedCardsCheckbox$     = this.myRandomizerGroup$.map( e => e.selectedCardsCheckbox     ).distinctUntilChanged();
  BlackMarketPileShuffled$   = this.myRandomizerGroup$.map( e => e.BlackMarketPileShuffled   ).distinctUntilChanged();
  BlackMarketPhase$          = this.myRandomizerGroup$.map( e => e.BlackMarketPhase          ).distinctUntilChanged();
  newGameResult = {
    players$ : this.myRandomizerGroup$.map( e => e.newGameResult.players ).distinctUntilChanged(),
    place$   : this.myRandomizerGroup$.map( e => e.newGameResult.place   ).distinctUntilChanged(),
    memo$    : this.myRandomizerGroup$.map( e => e.newGameResult.memo    ).distinctUntilChanged(),
  };
  newGameResultDialogOpened$ = this.myRandomizerGroup$.map( e => e.newGameResultDialogOpened ).distinctUntilChanged();
  resetVPCalculator$         = this.myRandomizerGroup$.map( e => e.resetVPCalculator         ).distinctUntilChanged();
  startPlayerName$           = this.myRandomizerGroup$.map( e => e.startPlayerName           ).distinctUntilChanged();


  constructor(
    private database: FireDatabaseMediatorService,
    private myUserInfo: MyUserInfoService
  ) {
    this.myUserInfo.randomizerGroupID$.subscribe( val => this.myRandomizerGroupID = val );
    this.myUserInfo.signedIn$.subscribe( val => this.signedIn = val );
  }




  addToSelectedCardsHistory( newSelectedCards: SelectedCards ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
      .addToSelectedCardsHistory( this.myRandomizerGroupID, newSelectedCards );
  }


  setRandomizerButtonLocked( locked: boolean ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
            .set.randomizerButtonLocked( this.myRandomizerGroupID, locked );
  }

  setIsSelectedExpansions( index: number, value: boolean ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
            .set.isSelectedExpansions( this.myRandomizerGroupID, index, value );
  }

  setSelectedCards( newSelectedCards: SelectedCards ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
            .set.selectedCards( this.myRandomizerGroupID, newSelectedCards );
  }

  setSelectedCardsCheckbox( arrayName: string, index: number, value: boolean ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
            .set.selectedCardsCheckbox( this.myRandomizerGroupID, arrayName, index, value );
  }

  resetSelectedCards() {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
            .resetSelectedCards( this.myRandomizerGroupID );
  }

  resetSelectedCardsCheckbox() {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
            .resetSelectedCardsCheckbox( this.myRandomizerGroupID );
  }

  setBlackMarketPileShuffled( BlackMarketPileShuffled: BlackMarketPileCard[] ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
            .set.BlackMarketPileShuffled( this.myRandomizerGroupID, BlackMarketPileShuffled );
  }

  setBlackMarketPhase( BlackMarketPhase: number ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
            .set.BlackMarketPhase( this.myRandomizerGroupID, BlackMarketPhase );
  }

  resetVPCalculator() {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup.resetVPCalculator( this.myRandomizerGroupID );
  }

  setStartPlayerName( value: string ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
            .set.startPlayerName( this.myRandomizerGroupID, value );
  }

  setNewGameResultPlayerSelected( playerId: string, value: boolean ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
            .set.newGameResult.players.selected( this.myRandomizerGroupID, playerId, value );
  }

  setNewGameResultPlayerVP( playerId: string, value: number ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
            .set.newGameResult.players.VP( this.myRandomizerGroupID, playerId, value );
  }

  setNewGameResultPlayerWinByTurn( playerId: string, value: boolean ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
            .set.newGameResult.players.winByTurn( this.myRandomizerGroupID, playerId, value );
  }

  setNewGameResultPlace( value: string ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
            .set.newGameResult.place( this.myRandomizerGroupID, value );
  }

  setNewGameResultMemo( value: string ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
            .set.newGameResult.memo( this.myRandomizerGroupID, value );
  }

  setNewGameResultDialogOpened( value: boolean ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.database.randomizerGroup
            .set.newGameResultDialogOpened( this.myRandomizerGroupID, value );
  }

}
