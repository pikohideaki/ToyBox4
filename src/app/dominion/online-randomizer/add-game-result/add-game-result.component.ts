import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';


import { UtilitiesService } from '../../../my-library/utilities.service';
import { FireDatabaseMediatorService } from '../../../fire-database-mediator.service';

import { MyRandomizerGroupService } from '../my-randomizer-group.service';

import { CardProperty  } from '../../../classes/card-property';
import { GameResult    } from '../../../classes/game-result';
import { PlayerResult  } from '../../../classes/player-result';
import { SelectedCards } from '../../../classes/selected-cards';
import { SelectedCardsCheckbox } from '../../../classes/selected-cards-checkbox-values';

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

  private selectedExpansions: string[] = [];
  private cardPropertyList: CardProperty[];
  private selectedCards: SelectedCards = new SelectedCards();

  date: Date = new Date( Date.now() );
  place = '';
  memo = '';
  startPlayerName = '';
  playerResults: PlayerResult[] = [];
  private selectedPlayers: PlayerResult[] = [];

  places: string[] = [];

  numberOfPlayersOK$: Observable<boolean>;

  newGameResultDialogOpened$: Observable<boolean>;

  @Output() goToVPcalcTab = new EventEmitter<void>();


  constructor(
    private utils: UtilitiesService,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private database: FireDatabaseMediatorService,
    private myRandomizerGroup: MyRandomizerGroupService,
  ) {
    Observable.combineLatest(
        this.myRandomizerGroup.selectedCards$,
        this.database.cardPropertyList$,
        this.database.gameResultList$,
        ( selectedCards, cardPropertyList, gameResultList ) => ({
            selectedCards             : selectedCards,
            cardPropertyList          : cardPropertyList,
            gameResultList            : gameResultList,
        }))
      .takeWhile( () => this.alive )
      .subscribe( value => {
        this.selectedCards = value.selectedCards;
        this.cardPropertyList = value.cardPropertyList;
        this.places = this.utils.uniq( value.gameResultList.map( e => e.place ).filter( e => e !== '' ) );
        this.receiveDataDone = true;
      });

    Observable.combineLatest(
        this.database.expansionsNameList$,
        this.myRandomizerGroup.isSelectedExpansions$,
        (expansionsNameList, isSelectedExpansions) =>
          expansionsNameList.filter( (_, i) => isSelectedExpansions[i] ) )
      .takeWhile( () => this.alive )
      .subscribe( val => this.selectedExpansions = val );

    this.myRandomizerGroup.newGameResult.place$
      .takeWhile( () => this.alive )
      .subscribe( val => this.place = val );

    this.myRandomizerGroup.newGameResult.memo$
      .takeWhile( () => this.alive )
      .subscribe( val => this.memo = val );

    this.myRandomizerGroup.startPlayerName$
      .takeWhile( () => this.alive )
      .subscribe( val => this.startPlayerName = val );

    this.myRandomizerGroup.newGameResult.players$
      .takeWhile( () => this.alive )
      .subscribe( val => this.playerResults = val );

    const selectedPlayers$
      = this.myRandomizerGroup.newGameResult.players$.map( list => list.filter( e => e.selected ) );
    selectedPlayers$
      .takeWhile( () => this.alive )
      .subscribe( val => this.selectedPlayers = val );


    this.numberOfPlayersOK$
      = selectedPlayers$.map( selectedPlayers =>
          ( 2 <= selectedPlayers.length && selectedPlayers.length <= 6 ) );

    this.newGameResultDialogOpened$ = this.myRandomizerGroup.newGameResultDialogOpened$;
  }


  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }

  changePlace( place: string ) {
    this.myRandomizerGroup.setNewGameResultPlace( place );
  }

  changeMemo( memo: string ) {
    this.myRandomizerGroup.setNewGameResultMemo( memo );
  }

  changeStartPlayerName( playerName: string ) {
    this.myRandomizerGroup.setStartPlayerName( playerName );
  }


  changePlayersResultSelected( playerId: string, value: boolean ) {
    this.myRandomizerGroup.setStartPlayerName('');
    this.myRandomizerGroup.setNewGameResultPlayerSelected( playerId, value );
  }

  // changePlayersResultVP( playerId: string, value: number ) {
  //   this.myRandomizerGroup.setNewGameResultPlayerVP( playerId, value );
  // }

  changePlayersResultWinByTurn( playerId: string, value: boolean ) {
    this.myRandomizerGroup.setNewGameResultPlayerWinByTurn( playerId, value );
  }




  selectStartPlayer(): void {
    if ( this.selectedPlayers.length === 0 ) return;
    this.startPlayerName = this.utils.getRandomValue( this.selectedPlayers ).name;
    this.myRandomizerGroup.setStartPlayerName( this.startPlayerName );
  }


  submitGameResult(): void {
    this.myRandomizerGroup.setNewGameResultDialogOpened(true);
    const dialogRef = this.dialog.open( SubmitGameResultDialogComponent );

    const indexToID = cardIndex => this.cardPropertyList[cardIndex].cardID;
    const newGameResult = new GameResult( null, {
      no         :  0,
      dateString : this.date.toString(),
      place      : this.place,
      memo       : this.memo,
      selectedExpansions : this.selectedExpansions,
      selectedCardsID : {
        Prosperity      : this.selectedCards.Prosperity,
        DarkAges        : this.selectedCards.DarkAges,
        KingdomCards10  : this.selectedCards.KingdomCards10 .map( indexToID ),
        BaneCard        : this.selectedCards.BaneCard       .map( indexToID ),
        EventCards      : this.selectedCards.EventCards     .map( indexToID ),
        Obelisk         : this.selectedCards.Obelisk        .map( indexToID ),
        LandmarkCards   : this.selectedCards.LandmarkCards  .map( indexToID ),
        BlackMarketPile : this.selectedCards.BlackMarketPile.map( indexToID ),
      },
      players : this.selectedPlayers.map( pl => ({
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
        this.myRandomizerGroup.resetSelectedCards();
        this.myRandomizerGroup.resetSelectedCardsCheckbox();
        this.playerResults.forEach( player => {
          this.myRandomizerGroup.setNewGameResultPlayerVP( player.id, 0 );
          this.myRandomizerGroup.setNewGameResultPlayerWinByTurn( player.id, false );
        });
        this.myRandomizerGroup.setNewGameResultMemo('');
        this.myRandomizerGroup.setStartPlayerName('');
        this.myRandomizerGroup.resetVPCalculator();
        this.openSnackBar();
      }
    });
  }


  private openSnackBar() {
    this.snackBar.open( 'Successfully Submitted!', undefined, { duration: 3000 } );
  }


  goToVPcalcTabClicked() {
    this.goToVPcalcTab.emit();
  }
}
