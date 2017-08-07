import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { MdDialog, MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AngularFireAuth } from 'angularfire2/auth';


import { MyUtilitiesService } from '../../../my-utilities.service';
import { DominionDatabaseService } from '../../dominion-database.service';

import { MySyncGroupService } from '../my-sync-group.service';
import { SelectedDominionSetService } from '../selected-dominion-set.service';
import { SelectedCardsService } from '../selected-cards.service';
import { NewGameResultService } from '../new-game-result.service';

import { GameResult } from '../../game-result';
import { SelectedCards } from '../../selected-cards';
import { PlayerResult } from '../player-result';
import { CardProperty } from '../../card-property';

import { SubmitGameResultDialogComponent } from '../../submit-game-result-dialog/submit-game-result-dialog.component';


@Component({
  selector: 'app-add-game-result',
  templateUrl: './add-game-result.component.html',
  styleUrls: [
    '../../../my-data-table/my-data-table.component.css',
    './add-game-result.component.css'
  ]
})
export class AddGameResultComponent implements OnInit, OnDestroy {

  private alive = true;
  getDataDone = false;

  private DominionSetToggleValues: boolean[] = [];
  private cardPropertyList: CardProperty[];
  private selectedCards: SelectedCards = new SelectedCards();

  date: Date = new Date( Date.now() );
  place = '';
  memo = '';
  startPlayerName = '';
  playersGameResult: PlayerResult[] = [];

  places: string[] = [];

  newGameResultDialogOpened$: Observable<boolean>;


  constructor(
    private utils: MyUtilitiesService,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private database: DominionDatabaseService,
    private mySyncGroup: MySyncGroupService,
    private selectedCardsService: SelectedCardsService,
    private selectedDominionSetService: SelectedDominionSetService,
    private newGameResultService: NewGameResultService
  ) {
    const playersGameResult$ = this.database.playersNameList$
      .map( list => list.map( player => new PlayerResult(player.name) ) );

    Observable.combineLatest(
        this.selectedCardsService.selectedCards$,
        this.database.cardPropertyList$,
        this.database.gameResultList$,
        playersGameResult$,
        ( selectedCards,
          cardPropertyList,
          gameResultList,
          playersGameResult ) => ({
            selectedCards             : selectedCards,
            cardPropertyList          : cardPropertyList,
            gameResultList            : gameResultList,
            playersGameResult         : playersGameResult,
          }) )
      .takeWhile( () => this.alive )
      .subscribe( value => {
        this.selectedCards = value.selectedCards;
        this.cardPropertyList = value.cardPropertyList;

        this.places = this.utils.uniq( value.gameResultList.map( e => e.place ) )
                                .filter( e => e !== '' );

        this.playersGameResult = value.playersGameResult;

        this.newGameResultService.playerResultsSelectedMerged$
          .takeWhile( () => this.alive )
          .subscribe( val => this.playersGameResult[ val.playerIndex ].selected = val.value );

        this.newGameResultService.playerResultsVPMerged$
          .takeWhile( () => this.alive )
          .subscribe( val => this.playersGameResult[ val.playerIndex ].VP = val.value );

        this.newGameResultService.playerResultsLessTurnsMerged$
          .takeWhile( () => this.alive )
          .subscribe( val => this.playersGameResult[ val.playerIndex ].lessTurns = val.value );

        this.getDataDone = true;
      });


    this.selectedDominionSetService.selectedDominionSetMerged$
      .takeWhile( () => this.alive )
      .subscribe( value => this.DominionSetToggleValues[ value.index ] = value.checked );

    this.newGameResultService.place$
      .takeWhile( () => this.alive )
      .subscribe( val => this.place = val );

    this.newGameResultService.memo$
      .takeWhile( () => this.alive )
      .subscribe( val => this.memo = val );

    this.newGameResultService.startPlayerName$
      .takeWhile( () => this.alive )
      .subscribe( val => this.startPlayerName = val );

    this.newGameResultDialogOpened$ = this.mySyncGroup.newGameResultDialogOpened$();
  }


  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private selectedPlayers(): any[] {
    return this.playersGameResult.filter( player => player.selected );
  }

  private playerIndexFromName( playerName: string ) {
    return this.playersGameResult.findIndex( e => e.name === playerName );
  }

  changePlace( place: string ) {
    this.newGameResultService.changePlace( place );
  }

  changeMemo( memo: string ) {
    this.newGameResultService.changeMemo( memo );
  }

  changeStartPlayerName( playerName: string ) {
    this.newGameResultService.changeStartPlayerName( playerName );
  }


  changePlayersResultSelected( playerName: string, value: boolean ) {
    this.changeStartPlayerName( '' );
    this.newGameResultService.changePlayerResultSelected( this.playerIndexFromName( playerName ), value )
  }

  changePlayersResultVP( playerName: string, value: number ) {
    this.newGameResultService.changePlayerResultVP( this.playerIndexFromName( playerName ), value )
  }

  changePlayersResultLessTurns( playerName: string, value: boolean ) {
    this.newGameResultService.changePlayerResultLessTurns( this.playerIndexFromName( playerName ), value )
  }




  selectStartPlayer(): void {
    if ( this.selectedPlayers().length === 0 ) return;
    this.startPlayerName = this.utils.getRandomValue( this.selectedPlayers() ).name;
    this.changeStartPlayerName( this.startPlayerName );
  }


  numberOfPlayersOK(): boolean {
    return ( 2 <= this.selectedPlayers().length && this.selectedPlayers().length <= 6 );
  }


  submitGameResult(): void {
    if ( !this.numberOfPlayersOK() ) return;

    this.mySyncGroup.setNewGameResultDialogOpened(true);
    const dialogRef = this.dialog.open( SubmitGameResultDialogComponent );

    const newGameResult = new GameResult({
      date   : this.date,
      place  : this.place,
      memo   : this.memo,
      selectedDominionSet : this.DominionSetToggleValues,
      selectedCardsID      : {
        Prosperity      : this.selectedCards.Prosperity,
        DarkAges        : this.selectedCards.DarkAges,
        KingdomCards10  : this.selectedCards.KingdomCards10 .map( cardIndex => this.cardPropertyList[cardIndex].cardID ),
        BaneCard        : this.selectedCards.BaneCard       .map( cardIndex => this.cardPropertyList[cardIndex].cardID ),
        EventCards      : this.selectedCards.EventCards     .map( cardIndex => this.cardPropertyList[cardIndex].cardID ),
        Obelisk         : this.selectedCards.Obelisk        .map( cardIndex => this.cardPropertyList[cardIndex].cardID ),
        LandmarkCards   : this.selectedCards.LandmarkCards  .map( cardIndex => this.cardPropertyList[cardIndex].cardID ),
        BlackMarketPile : this.selectedCards.BlackMarketPile.map( cardIndex => this.cardPropertyList[cardIndex].cardID ),
      },
      players : this.selectedPlayers().map( pl => ({
                name      : pl.name,
                VP        : pl.VP,
                lessTurns : pl.lessTurns,
                rank      : 1,
                score     : 0,
              }) ),
    });

    dialogRef.componentInstance.newGameResult = newGameResult;

    dialogRef.afterClosed().subscribe( result => {
      this.mySyncGroup.setNewGameResultDialogOpened(false);
      if ( result === 'OK Clicked' ) {
        this.playersGameResult.forEach( player => {
          this.changePlayersResultVP( player.name, 0 );
          this.changePlayersResultLessTurns( player.name, false );
        });

        this.changeMemo('');
        this.changeStartPlayerName('');
        this.playersGameResult.forEach( (_, playerIndex) =>
          this.newGameResultService.changeResetVictoryPointsCalculatorOfPlayerMerged( playerIndex, true ) );
        this.openSnackBar();
      }
    });
  }


  private openSnackBar() {
    this.snackBar.open( 'Successfully Submitted!', undefined, { duration: 3000 } );
  }


}
