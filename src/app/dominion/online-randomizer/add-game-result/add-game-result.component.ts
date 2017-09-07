import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';


import { UtilitiesService } from '../../../my-library/utilities.service';
import { FireDatabaseMediatorService } from '../../../fire-database-mediator.service';

import { MyRandomizerGroupService } from '../my-randomizer-group.service';
import { SelectedDominionSetService } from '../selected-dominion-set.service';
import { SelectedCardsService } from '../selected-cards.service';
import { NewGameResultService } from '../new-game-result.service';

import { CardProperty  } from '../../../classes/card-property';
import { GameResult    } from '../../../classes/game-result';
import { PlayerResult  } from '../../../classes/player-result';
import { SelectedCards } from '../../../classes/selected-cards';

import { SubmitGameResultDialogComponent } from '../../submit-game-result-dialog/submit-game-result-dialog.component';


@Component({
  selector: 'app-add-game-result',
  templateUrl: './add-game-result.component.html',
  styleUrls: [
    '../../../my-library/data-table/data-table.component.css',
    './add-game-result.component.css'
  ]
})
export class AddGameResultComponent implements OnInit, OnDestroy {

  private alive = true;
  receiveDataDone = false;

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
    private utils: UtilitiesService,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private database: FireDatabaseMediatorService,
    private myRandomizerGroup: MyRandomizerGroupService,
    private selectedCardsService: SelectedCardsService,
    private selectedDominionSetService: SelectedDominionSetService,
    private newGameResultService: NewGameResultService
  ) {
    const playersGameResult$ = this.database.playersNameList$
      .map( list => list.map( player => new PlayerResult( player.name ) ) );

    Observable.combineLatest(
        this.selectedCardsService.selectedCards$,
        this.database.cardPropertyList$,
        this.database.gameResultList$,
        playersGameResult$,
        ( selectedCards, cardPropertyList, gameResultList, playersGameResult ) => ({
            selectedCards             : selectedCards,
            cardPropertyList          : cardPropertyList,
            gameResultList            : gameResultList,
            playersGameResult         : playersGameResult,
        }))
      .takeWhile( () => this.alive )
      .subscribe( value => {
        this.selectedCards = value.selectedCards;
        this.cardPropertyList = value.cardPropertyList;

        this.places = this.utils.uniq( value.gameResultList.map( e => e.place ) )
                                .filter( e => e !== '' );

        this.playersGameResult = value.playersGameResult;

        // this.newGameResultService.playerResultsSelectedMerged$
        //   .takeWhile( () => this.alive )
        //   .subscribe( val => this.playersGameResult[ val.playerIndex ].selected = val.value );

        // this.newGameResultService.playerResultsVPMerged$
        //   .takeWhile( () => this.alive )
        //   .subscribe( val => this.playersGameResult[ val.playerIndex ].VP = val.value );

        // this.newGameResultService.playerResultsWinByTurnMerged$
        //   .takeWhile( () => this.alive )
        //   .subscribe( val => this.playersGameResult[ val.playerIndex ].winByTurn = val.value );

        this.receiveDataDone = true;
      });

    this.newGameResultService.playerResultsSelectedMerged$.combineLatest(
          playersGameResult$,
          (playerResultsSelectedMerged, _) => playerResultsSelectedMerged )
      .takeWhile( () => this.alive )
      .subscribe( val => this.playersGameResult[ val.playerIndex ].selected = val.value );

    this.newGameResultService.playerResultsVPMerged$.combineLatest(
          playersGameResult$,
          (playerResultsVPMerged, _) => playerResultsVPMerged )
      .takeWhile( () => this.alive )
      .subscribe( val => this.playersGameResult[ val.playerIndex ].VP = val.value );

    this.newGameResultService.playerResultsWinByTurnMerged$.combineLatest(
        playersGameResult$,
        (playerResultsWinByTurnMerged, _) => playerResultsWinByTurnMerged )
      .takeWhile( () => this.alive )
      .subscribe( val => this.playersGameResult[ val.playerIndex ].winByTurn = val.value );


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

    this.newGameResultDialogOpened$ = this.myRandomizerGroup.myRandomizerGroup$.map( e => e.newGameResultDialogOpened );
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

  changePlayersResultWinByTurn( playerName: string, value: boolean ) {
    this.newGameResultService.changePlayerResultWinByTurn( this.playerIndexFromName( playerName ), value )
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

    this.myRandomizerGroup.setNewGameResultDialogOpened(true);
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
                winByTurn : pl.winByTurn,
                rank      : 1,
                score     : 0,
              }) ),
    });

    dialogRef.componentInstance.newGameResult = newGameResult;

    dialogRef.afterClosed().subscribe( result => {
      this.myRandomizerGroup.setNewGameResultDialogOpened(false);
      if ( result === 'OK Clicked' ) {
        this.playersGameResult.forEach( player => {
          this.changePlayersResultVP( player.name, 0 );
          this.changePlayersResultWinByTurn( player.name, false );
        });

        this.changeMemo('');
        this.changeStartPlayerName('');
        this.playersGameResult.forEach( (_, playerIndex) =>
          this.newGameResultService.changeresetVPCalculatorOfPlayerMerged( playerIndex, true ) );
        this.openSnackBar();
      }
    });
  }


  private openSnackBar() {
    this.snackBar.open( 'Successfully Submitted!', undefined, { duration: 3000 } );
  }

}
