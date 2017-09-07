import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { UtilitiesService } from '../../my-library/utilities.service';
import { FireDatabaseMediatorService } from '../../fire-database-mediator.service';
import { MyRandomizerGroupService } from './my-randomizer-group.service';


@Injectable()
export class NewGameResultService {

  private placeSource = new ReplaySubject<string>();
  public place$ = Observable.merge(
      this.myRandomizerGroup.myRandomizerGroup$.map( e => e.newGameResultPlace ),
      this.placeSource.asObservable() );

  private memoSource = new ReplaySubject<string>();
  public memo$ = Observable.merge(
      this.myRandomizerGroup.myRandomizerGroup$.map( e => e.newGameResultMemo ),
      this.memoSource.asObservable() );

  private startPlayerNameSource = new ReplaySubject<string>();
  public startPlayerName$ = Observable.merge(
      this.myRandomizerGroup.myRandomizerGroup$.map( e => e.startPlayerName ),
      this.startPlayerNameSource.asObservable() );

  private playerResultsSelectedMergedSource
    = new ReplaySubject<{ value: boolean, playerIndex: number }>();
  public playerResultsSelectedMerged$
    = this.playerResultsSelectedMergedSource.asObservable();

  private playerResultsVPMergedSource
    = new ReplaySubject<{ value: number, playerIndex: number }>();
  public playerResultsVPMerged$
    = this.playerResultsVPMergedSource.asObservable();

  private playerResultsWinByTurnMergedSource
    = new ReplaySubject<{ value: boolean, playerIndex: number }>();
  public playerResultsWinByTurnMerged$
    = this.playerResultsWinByTurnMergedSource.asObservable();

  private resetVPCalculatorOfPlayerMergedSource
    = new ReplaySubject<{ value: boolean, playerIndex: number }>();
  public resetVPCalculatorOfPlayerMerged$
    = this.resetVPCalculatorOfPlayerMergedSource.asObservable();



  constructor(
    private utils: UtilitiesService,
    private database: FireDatabaseMediatorService,
    private myRandomizerGroup: MyRandomizerGroupService
  ) {
    this.database.playersNameList$
      .subscribe( playersNameList =>
        this.utils.numberSequence( 0, playersNameList.length ).forEach( playerIndex => {
          // this.myRandomizerGroup.newGameResultPlayerSelected$( playerIndex ).subscribe( val => {
          this.myRandomizerGroup.myRandomizerGroup$.map( e => e.newGameResultPlayers[playerIndex].selected )
          .subscribe( val => {
            if ( val === undefined || val === null ) return;
            this.playerResultsSelectedMergedSource.next({ value: val, playerIndex: playerIndex });
          });

          this.myRandomizerGroup.myRandomizerGroup$.map( e => e.newGameResultPlayers[playerIndex].VP )
          .subscribe( val => {
            if ( val === undefined || val === null ) return;
            this.playerResultsVPMergedSource.next({ value: val, playerIndex: playerIndex });
          });

          this.myRandomizerGroup.myRandomizerGroup$.map( e => e.newGameResultPlayers[playerIndex].winByTurn )
          .subscribe( val => {
            if ( val === undefined || val === null ) return;
            this.playerResultsWinByTurnMergedSource.next({ value: val, playerIndex: playerIndex });
          });

          this.myRandomizerGroup.myRandomizerGroup$.map( e => e.resetVPCalculatorOfPlayer[playerIndex] )
          .subscribe( val => {
            if ( val === undefined || val === null ) return;
            this.resetVPCalculatorOfPlayerMergedSource.next({ value: val, playerIndex: playerIndex });
          });
        })
      );
  }


  changePlace( newValue: string ) {
    this.placeSource.next( newValue );
    this.myRandomizerGroup.setNewGameResultPlace( newValue );
  }

  changeMemo( newValue: string ) {
    this.memoSource.next( newValue );
    this.myRandomizerGroup.setNewGameResultMemo( newValue );
  }

  changeStartPlayerName( newValue: string ) {
    this.startPlayerNameSource.next( newValue );
    this.myRandomizerGroup.setStartPlayerName( newValue );
  }

  changePlayerResultSelected( playerIndex: number, value: boolean ) {
    this.playerResultsSelectedMergedSource.next({ value: value, playerIndex: playerIndex });
    this.myRandomizerGroup.setNewGameResultPlayerSelected( playerIndex, value );
  }

  changePlayerResultVP( playerIndex: number, value: number ) {
    this.playerResultsVPMergedSource.next({ value: value, playerIndex: playerIndex });
    this.myRandomizerGroup.setNewGameResultPlayerVP( playerIndex, value );
  }

  changePlayerResultWinByTurn( playerIndex: number, value: boolean ) {
    this.playerResultsWinByTurnMergedSource.next({ value: value, playerIndex: playerIndex });
    this.myRandomizerGroup.setNewGameResultPlayerWinByTurn( playerIndex, value );
  }

  changeresetVPCalculatorOfPlayerMerged( playerIndex: number, value: boolean ) {
    this.resetVPCalculatorOfPlayerMergedSource.next({ value: value, playerIndex: playerIndex });
    this.myRandomizerGroup.setResetVPCalculatorOfPlayer( playerIndex, value );
  }

}
