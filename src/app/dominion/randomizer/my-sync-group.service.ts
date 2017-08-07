/**
 * interact with
 * - selectedCards
 * - newGameResult
 * - RandomizerSelectCardsComponent
 * - SyncGroupsComponent
 *
 * get syncGroups from FireDataBase
 */

import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


import { UserInfo } from '../../user-info';
import { CardProperty } from '../card-property';
import { PlayerName } from '../player-name';
import { SelectedCards } from '../selected-cards';
import { PlayerResult } from './player-result';
import { SyncGroup } from './sync-group';
import { SelectedCardsCheckboxValues } from '../selected-cards-checkbox-values';



@Injectable()
export class MySyncGroupService {

  mySyncGroupID$: Observable<string>;
  mySyncGroupID: string;

  signedIn$: Observable<boolean>;
  signedIn: boolean;

  constructor(
    private afDatabase: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {
    this.mySyncGroupID$ = Observable.combineLatest(
        this.afDatabase.object('/userInfo'),
        this.afAuth.authState,
        (userInfo: UserInfo, me) => ( !me ? '' : userInfo[me.uid].DominionGroupID ) );

    this.mySyncGroupID$.subscribe( val => this.mySyncGroupID = val );

    this.signedIn$ = this.mySyncGroupID$.map( e => !!e );
    this.signedIn$.subscribe( val => this.signedIn = val );
  }


  mySyncGroup$() {
    return this.mySyncGroupID$
        .map( mySyncGroupID => this.afDatabase.object(`/syncGroups/${mySyncGroupID}`) )
        .switch();
  }


  private getObservable( pathSuffix: string, asList: boolean = false ): Observable<any> {
    if ( asList ) {
      return this.mySyncGroupID$
          .map( mySyncGroupID => this.afDatabase.list(`/syncGroups/${mySyncGroupID}/${pathSuffix}`) )
          .switch();
    } else {
      return this.mySyncGroupID$
          .map( mySyncGroupID => this.afDatabase.object(`/syncGroups/${mySyncGroupID}/${pathSuffix}`) )
          .switch();
    }
  }

  private setValue<T>( pathSuffix: string, value: T ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.afDatabase.object( `/syncGroups/${this.mySyncGroupID}/${pathSuffix}` ).set( value );
  }
  private pushValue<T>( pathSuffix: string, value: T ) {
    if ( !this.signedIn ) return Promise.resolve();
    return this.afDatabase.list( `/syncGroups/${this.mySyncGroupID}/${pathSuffix}` ).push( value );
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
