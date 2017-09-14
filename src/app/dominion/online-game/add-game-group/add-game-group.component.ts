import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdTooltipModule, MdDialog, MdSnackBar } from '@angular/material';

import { UtilitiesService } from '../../../my-library/utilities.service';
import { MyUserInfoService } from '../../../my-user-info.service';
import { FireDatabaseMediatorService } from '../../../fire-database-mediator.service';

import { SignInToGameRoomDialogComponent } from '../sign-in-to-game-room-dialog/sign-in-to-game-room-dialog.component';

import { CardProperty        } from '../../../classes/card-property';
import { SelectedCards       } from '../../../classes/selected-cards';
import { GameRoom            } from '../../../classes/game-room';
import { GameState           } from '../../../classes/game-state';
import { BlackMarketPileCard } from '../../../classes/black-market-pile-card';


@Component({
  selector: 'app-add-game-group',
  templateUrl: './add-game-group.component.html',
  styleUrls: [ './add-game-group.component.css' ]
})
export class AddGameGroupComponent implements OnInit, OnDestroy {
  private alive: boolean = true;

  // test
  private test = true;
  private KingdomCardsTest = this.utils.numberSequence(7, 10);

  @Input() private myName: string;
  private cardPropertyList: CardProperty[] = [];
  newRoom: GameRoom = new GameRoom();
  selectedCards: SelectedCards = new SelectedCards();
  BlackMarketPileShuffled: BlackMarketPileCard[] = [];

  constructor(
    private utils: UtilitiesService,
    private database: FireDatabaseMediatorService,
    public snackBar: MdSnackBar,
    public dialog: MdDialog,
    private myUserInfo: MyUserInfoService
  ) {
    this.myUserInfo.onlineGame.isSelectedExpansions$
      .takeWhile( () => this.alive )
      .subscribe( val => this.newRoom.isSelectedExpansions = val );

    this.myUserInfo.onlineGame.numberOfPlayers$
      .takeWhile( () => this.alive )
      .subscribe( val => this.newRoom.numberOfPlayers = val );

    this.database.cardPropertyList$
      .takeWhile( () => this.alive )
      .subscribe( val => this.cardPropertyList = val );

    // test
    if ( this.test ) this.newRoom.selectedCards.KingdomCards10 = this.KingdomCardsTest;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }

  formIsValid(): boolean {
    return (this.myName && this.newRoom.selectedCards.KingdomCards10.length > 0);
  }

  increment() {
    this.newRoom.numberOfPlayers++;
    this.myUserInfo.setOnlineGameNumberOfPlayers( this.newRoom.numberOfPlayers );
  }
  decrement() {
    this.newRoom.numberOfPlayers--;
    this.myUserInfo.setOnlineGameNumberOfPlayers( this.newRoom.numberOfPlayers );
  }

  isSelectedExpansionsOnChange( value: { index: number, checked: boolean } ) {
    this.newRoom.isSelectedExpansions[ value.index ] = value.checked;
    this.myUserInfo.setOnlineGameIsSelectedExpansions( this.newRoom.isSelectedExpansions );
  }

  newGame() {
    const newGameState = new GameState();
    newGameState.setNumberOfPlayers( this.newRoom.numberOfPlayers );
    newGameState.initCards( this.newRoom.selectedCards, this.cardPropertyList );
    newGameState.initDecks();
    this.newRoom.gameStateID = this.database.onlineGameState.add( newGameState ).key;

    const newRoomID = this.database.onlineGameRoom.add( this.newRoom ).key;
    this.newRoom.databaseKey = newRoomID;

    this.database.onlineGameRoom.addMember( newRoomID, this.myName );

    console.log( newGameState, this.newRoom )

    const dialogRef = this.dialog.open( SignInToGameRoomDialogComponent );
    dialogRef.componentInstance.newRoom = this.newRoom;
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.disableClose = true;

    dialogRef.afterClosed()
      .takeWhile( () => this.alive )
      .subscribe( result => {
        this.newRoom.players = [];  // reset members
        if ( result === 'Cancel Clicked' ) {
          this.database.onlineGameRoom.remove( this.newRoom.databaseKey );
          this.database.onlineGameState.remove( this.newRoom.gameStateID );
        } else {
          this.openSnackBar('Successfully signed in!');
        }
      });
  }

  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }
}
