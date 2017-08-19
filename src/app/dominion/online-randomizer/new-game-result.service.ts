import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { UtilitiesService } from '../../utilities.service';
import { DominionDatabaseService } from '../dominion-database.service';
import { MyRandomizerGroupService } from './my-randomizer-group.service';


@Injectable()
export class NewGameResultService {

  private placeSource = new ReplaySubject<string>();
  public place$ = Observable.merge(
      this.myRandomizerGroup.newGameResultPlace$(),
      this.placeSource.asObservable() );

  private memoSource = new ReplaySubject<string>();
  public memo$ = Observable.merge(
      this.myRandomizerGroup.newGameResultMemo$(),
      this.memoSource.asObservable() );

  private startPlayerNameSource = new ReplaySubject<string>();
  public startPlayerName$ = Observable.merge(
      this.myRandomizerGroup.newGameResultStartPlayerName$(),
      this.startPlayerNameSource.asObservable() );

  private playerResultsSelectedMergedSource
    = new ReplaySubject<{ value: boolean, playerIndex: number }>();
  public playerResultsSelectedMerged$
    = this.playerResultsSelectedMergedSource.asObservable();

  private playerResultsVPMergedSource
    = new ReplaySubject<{ value: number, playerIndex: number }>();
  public playerResultsVPMerged$
    = this.playerResultsVPMergedSource.asObservable();

  private playerResultsLessTurnsMergedSource
    = new ReplaySubject<{ value: boolean, playerIndex: number }>();
  public playerResultsLessTurnsMerged$
    = this.playerResultsLessTurnsMergedSource.asObservable();

  private resetVictoryPointsCalculatorOfPlayerMergedSource
    = new ReplaySubject<{ value: boolean, playerIndex: number }>();
  public resetVictoryPointsCalculatorOfPlayerMerged$
    = this.resetVictoryPointsCalculatorOfPlayerMergedSource.asObservable();



  constructor(
    private utils: UtilitiesService,
    private database: DominionDatabaseService,
    private myRandomizerGroup: MyRandomizerGroupService
  ) {
    this.database.playersNameList$
      .subscribe( playersNameList =>
        this.utils.numberSequence( 0, playersNameList.length ).forEach( playerIndex => {
          this.myRandomizerGroup.newGameResultPlayerSelected$( playerIndex ).subscribe( val => {
            if ( val === undefined || val === null ) return;
            this.playerResultsSelectedMergedSource.next({ value: val, playerIndex: playerIndex });
          });
          this.myRandomizerGroup.newGameResultPlayerVP$( playerIndex ).subscribe( val => {
            if ( val === undefined || val === null ) return;
            this.playerResultsVPMergedSource.next({ value: val, playerIndex: playerIndex });
          });
          this.myRandomizerGroup.newGameResultPlayerLessTurns$( playerIndex ).subscribe( val => {
            if ( val === undefined || val === null ) return;
            this.playerResultsLessTurnsMergedSource.next({ value: val, playerIndex: playerIndex });
          });
          this.myRandomizerGroup.resetVictoryPointsCalculatorOfPlayer$( playerIndex ).subscribe( val => {
            if ( val === undefined || val === null ) return;
            this.resetVictoryPointsCalculatorOfPlayerMergedSource.next({ value: val, playerIndex: playerIndex });
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
    this.myRandomizerGroup.setNewGameResultStartPlayerName( newValue );
  }

  changePlayerResultSelected( playerIndex: number, value: boolean ) {
    this.playerResultsSelectedMergedSource.next({ value: value, playerIndex: playerIndex });
    this.myRandomizerGroup.setNewGameResultPlayerSelected( value, playerIndex );
  }

  changePlayerResultVP( playerIndex: number, value: number ) {
    this.playerResultsVPMergedSource.next({ value: value, playerIndex: playerIndex });
    this.myRandomizerGroup.setNewGameResultPlayerVP( value, playerIndex );
  }

  changePlayerResultLessTurns( playerIndex: number, value: boolean ) {
    this.playerResultsLessTurnsMergedSource.next({ value: value, playerIndex: playerIndex });
    this.myRandomizerGroup.setNewGameResultPlayerLessTurns( value, playerIndex );
  }

  changeResetVictoryPointsCalculatorOfPlayerMerged( playerIndex: number, value: boolean ) {
    this.resetVictoryPointsCalculatorOfPlayerMergedSource.next({ value: value, playerIndex: playerIndex });
    this.myRandomizerGroup.setResetVictoryPointsCalculatorOfPlayer( value, playerIndex );
  }

}
