import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { PlayerName } from '../player-name';
import { SelectedCards } from '../selected-cards';
import { SelectedCardsCheckboxValues } from '../selected-cards-checkbox-values';
import { MyUserInfoService } from '../../my-user-info.service';


@Injectable()
export class MyRandomizerGroupService {
  myRandomizerGroupID$: Observable<string>;
  myRandomizerGroupID: string;
  signedIn$: Observable<boolean>;
  signedIn: boolean;

  constructor(
    private afDatabase: AngularFireDatabase,
    private myUserInfo: MyUserInfoService
  ) {
    this.myRandomizerGroupID$ = this.myUserInfo.myRandomizerGroupID$;

    this.myRandomizerGroupID$.subscribe( val => this.myRandomizerGroupID = val );

    this.myUserInfo.signedIn$.subscribe( val => this.signedIn = val );
  }


  myRandomizerGroup$() {
    return this.myRandomizerGroupID$
        .map( myRandomizerGroupID => this.afDatabase.object(`/randomizerGroupList/${myRandomizerGroupID}`) )
        .switch();
  }


  private getObservable( pathSuffix: string, asList: boolean = false ): Observable<any> {
    if ( asList ) {
      return this.myRandomizerGroupID$
          .map( myRandomizerGroupID => this.afDatabase.list(`/randomizerGroupList/${myRandomizerGroupID}/${pathSuffix}`) )
          .switch();
    } else {
      return this.myRandomizerGroupID$
          .map( myRandomizerGroupID => this.afDatabase.object(`/randomizerGroupList/${myRandomizerGroupID}/${pathSuffix}`) )
          .switch();
    }
  }

  private setValue<T>( pathSuffix: string, value: T ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.afDatabase.object( `/randomizerGroupList/${this.myRandomizerGroupID}/${pathSuffix}` ).set( value );
  }
  private pushValue<T>( pathSuffix: string, value: T ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.afDatabase.list( `/randomizerGroupList/${this.myRandomizerGroupID}/${pathSuffix}` ).push( value );
  }


  randomizerButtonLocked$(): Observable<boolean> {
    return this.getObservable( 'randomizerButtonLocked' ).map( v => v.$value );
  }
  setRandomizerButtonLocked( randomizerButtonLocked: boolean ) {
    return this.setValue( 'randomizerButtonLocked', randomizerButtonLocked );
  }

  selectedDominionSet$( index?: number ) {
    if ( index === undefined ) {
      return this.getObservable( `selectedDominionSet`, true )
                    .map( list => list.map( v => v.$value ) );
    }
    return this.getObservable( `selectedDominionSet/${index}` ).map( v => v.$value );
  }
  setSelectedDominionSet( value: boolean, index: number ) {
    return this.setValue( `selectedDominionSet/${index}`, value );
  }

  selectedCards$(): Observable<SelectedCards> {
    return this.getObservable( 'selectedCards' ).map( e => new SelectedCards(e) );
  }
  setSelectedCards( newSelectedCards: SelectedCards ) {
    return this.setValue( 'selectedCards', newSelectedCards );
  }
  addToSelectedCardsHistory( newSelectedCards: SelectedCards ) {
    return this.pushValue( 'selectedCardsHistory', newSelectedCards );
  }

  selectedCardsCheckboxValues$( arrayName: string, index: number = 0 ): Observable<boolean> {
    return this.getObservable( `selectedCardsCheckboxValues/${arrayName}/${index}` )
                .map( v => v.$value );
  }
  setSelectedCardsCheckboxValues( value: boolean, arrayName: string, index: number = 0 ) {
    return this.setValue( `selectedCardsCheckboxValues/${arrayName}/${index}`, value );
  }
  setSelectedCardsCheckboxValuesAll( value: SelectedCardsCheckboxValues ) {
    return this.setValue( 'selectedCardsCheckboxValues', value );
  }

  BlackMarketPileShuffled$(): Observable<{ cardIndex: number, faceUp: boolean }[]> {
    return this.getObservable( 'BlackMarketPileShuffled' );
  }
  setBlackMarketPileShuffled( BlackMarketPileShuffled: { cardIndex: number, faceUp: boolean }[] ) {
    return this.setValue( 'BlackMarketPileShuffled', BlackMarketPileShuffled );
  }

  BlackMarketOperationPhase$(): Observable<number> {
    return this.getObservable( 'BlackMarketOperationPhase' ).map( v => v.$value );
  }
  setBlackMarketOperationPhase( BlackMarketOperationPhase: number ) {
    return this.setValue<number>( 'BlackMarketOperationPhase', BlackMarketOperationPhase );
  }

  newGameResultPlayerSelected$( playerIndex: number ): Observable<boolean> {
    return this.getObservable( `newGameResult/players/${playerIndex}/selected` ).map( v => v.$value );
  }
  setNewGameResultPlayerSelected( value: boolean, playerIndex: number ) {
    return this.setValue<boolean>( `newGameResult/players/${playerIndex}/selected`, value );
  }

  newGameResultPlayerVP$( playerIndex: number ): Observable<number> {
    return this.getObservable( `newGameResult/players/${playerIndex}/VP` ).map( v => v.$value );
  }
  setNewGameResultPlayerVP( value: number, playerIndex: number ) {
    return this.setValue<number>( `newGameResult/players/${playerIndex}/VP`, Number(value) );
  }

  newGameResultPlayerLessTurns$( playerIndex: number ): Observable<boolean> {
    return this.getObservable( `newGameResult/players/${playerIndex}/lessTurns` ).map( v => v.$value );
  }
  setNewGameResultPlayerLessTurns( value: boolean, playerIndex: number ) {
    return this.setValue<boolean>( `newGameResult/players/${playerIndex}/lessTurns`, value );
  }

  resetVictoryPointsCalculatorOfPlayer$( playerIndex: number ): Observable<boolean> {
    return this.getObservable( `resetVictoryPointsCalculator/${playerIndex}` ).map( v => v.$value );
  }
  setResetVictoryPointsCalculatorOfPlayer( value: boolean, playerIndex: number ) {
    return this.setValue<boolean>( `resetVictoryPointsCalculator/${playerIndex}`, value );
  }


  newGameResultDate$(): Observable<Date> {
    return this.getObservable( 'newGameResult/date' ).map( v => new Date( v.$value ) );
  }
  setNewGameResultDate( date: Date ) {
    return this.setValue( 'newGameResult/date', date.toString() );
  }

  newGameResultPlace$(): Observable<string> {
    return this.getObservable( 'newGameResult/place' ).map( v => v.$value );
  }
  setNewGameResultPlace( place: string ) {
    return this.setValue( 'newGameResult/place', place );
  }

  newGameResultMemo$(): Observable<string> {
    return this.getObservable( 'newGameResult/memo' ).map( v => v.$value );
  }
  setNewGameResultMemo( memo: string ) {
    return this.setValue( 'newGameResult/memo', memo );
  }

  newGameResultStartPlayerName$(): Observable<string> {
    return this.getObservable( 'newGameResult/startPlayerName' ).map( v => v.$value );
  }
  setNewGameResultStartPlayerName( startPlayerName: string ) {
    return this.setValue( 'newGameResult/startPlayerName', startPlayerName );
  }

  newGameResultDialogOpened$(): Observable<boolean> {
    return this.getObservable( 'newGameResultDialogOpened' ).map( v => v.$value );
  }
  setNewGameResultDialogOpened( newGameResultDialogOpened ) {
    return this.setValue( 'newGameResultDialogOpened', newGameResultDialogOpened );
  }

}
