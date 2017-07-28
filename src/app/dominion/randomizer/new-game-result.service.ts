import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { SelectedCards } from '../selected-cards';
import { MyUtilitiesService } from '../../my-utilities.service';
import { DominionDatabaseService } from '../dominion-database.service';
import { MySyncGroupService } from './my-sync-group.service';


@Injectable()
export class NewGameResultService {

  // private dateSource = new BehaviorSubject< Date >( new Date( Date.now() ) );
  // public date$ = this.dateSource.asObservable();

  private placeSource = new ReplaySubject<string>();
  public place$ = this.placeSource.asObservable();

  private memoSource = new ReplaySubject<string>();
  public memo$ = this.memoSource.asObservable();

  private startPlayerNameSource = new ReplaySubject<string>();
  public startPlayerName$ = this.startPlayerNameSource.asObservable();

  private playerResultsSelectedMergedSource
    = new ReplaySubject<{ value: boolean, playerIndex: number }>();
  public playerResultsSelectedMerged$ = this.playerResultsSelectedMergedSource.asObservable();

  private playerResultsVPMergedSource
    = new ReplaySubject<{ value: number, playerIndex: number }>();
  public playerResultsVPMerged$ = this.playerResultsVPMergedSource.asObservable();

  private playerResultsLessTurnsMergedSource
    = new ReplaySubject<{ value: boolean, playerIndex: number }>();
  public playerResultsLessTurnsMerged$ = this.playerResultsLessTurnsMergedSource.asObservable();



  constructor(
    private utils: MyUtilitiesService,
    private database: DominionDatabaseService,
    private mySyncGroup: MySyncGroupService
  ) {
    // this.mySyncGroup.newGameResultDate$().subscribe( val => {
    //   if ( val === undefined || val === null ) return;
    //   this.dateSource.next( val );
    // });

    this.mySyncGroup.newGameResultPlace$().subscribe( val => {
      if ( val === undefined || val === null ) return;
      this.placeSource.next( val );
    });

    this.mySyncGroup.newGameResultMemo$().subscribe( val => {
      if ( val === undefined || val === null ) return;
      this.memoSource.next( val );
    });

    this.mySyncGroup.newGameResultStartPlayerName$().subscribe( val => {
      if ( val === undefined || val === null ) return;
      this.startPlayerNameSource.next( val );
    });

    this.database.playersNameList$
      .subscribe( playersNameList =>
        this.utils.numberSequence( 0, playersNameList.length ).forEach( playerIndex => {
          this.mySyncGroup.newGameResultPlayerSelected$( playerIndex ).subscribe( val => {
            if ( val === undefined || val === null ) return;
            this.playerResultsSelectedMergedSource.next({ value: val, playerIndex: playerIndex });
          });
          this.mySyncGroup.newGameResultPlayerVP$( playerIndex ).subscribe( val => {
            if ( val === undefined || val === null ) return;
            this.playerResultsVPMergedSource.next({ value: val, playerIndex: playerIndex });
          });
          this.mySyncGroup.newGameResultPlayerLessTurns$( playerIndex ).subscribe( val => {
            if ( val === undefined || val === null ) return;
            this.playerResultsLessTurnsMergedSource.next({ value: val, playerIndex: playerIndex });
          });
        })
      );
  }


  // changeDate( newValue ) {
  //   this.dateSource.next( newValue );
  //   this.mySyncGroup.setNewGameResultDate( newValue );
  // }

  changePlace( newValue ) {
    this.placeSource.next( newValue );
    this.mySyncGroup.setNewGameResultPlace( newValue );
  }

  changeMemo( newValue ) {
    this.memoSource.next( newValue );
    this.mySyncGroup.setNewGameResultMemo( newValue );
  }

  changeStartPlayerName( newValue ) {
    this.startPlayerNameSource.next( newValue );
    this.mySyncGroup.setNewGameResultStartPlayerName( newValue );
  }

  changePlayerResultSelected( playerIndex: number, value: boolean ) {
    this.playerResultsSelectedMergedSource.next({ value: value, playerIndex: playerIndex });
    this.mySyncGroup.setNewGameResultPlayerSelected( value, playerIndex );
  }

  changePlayerResultVP( playerIndex: number, value: number ) {
    this.playerResultsVPMergedSource.next({ value: value, playerIndex: playerIndex });
    this.mySyncGroup.setNewGameResultPlayerVP( value, playerIndex );
  }

  changePlayerResultLessTurns( playerIndex: number, value: boolean ) {
    this.playerResultsLessTurnsMergedSource.next({ value: value, playerIndex: playerIndex });
    this.mySyncGroup.setNewGameResultPlayerLessTurns( value, playerIndex );
  }

}
