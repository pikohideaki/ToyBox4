import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdTooltipModule, MdDialog, MdSnackBar } from '@angular/material';

import { UtilitiesService } from '../../../utilities.service';
import { GameRoom } from '../game-room';
import { GameRoomsService } from '../game-rooms.service';
import { SignInToGameRoomDialogComponent } from '../sign-in-to-game-room-dialog/sign-in-to-game-room-dialog.component';
import { DominionDatabaseService } from '../../dominion-database.service';
import { CardProperty } from '../../card-property';
import { SelectedCards } from '../../selected-cards';
import { MyUserInfoService } from '../../../my-user-info.service';
import { GameState } from '../game-state';
import { GameStateService } from '../game-state.service';


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
  BlackMarketPileShuffled: { cardIndex: number, faceUp: boolean }[] = [];

  constructor(
    private utils: UtilitiesService,
    private database: DominionDatabaseService,
    private gameRoomsService: GameRoomsService,
    private gameStateService: GameStateService,
    public snackBar: MdSnackBar,
    public dialog: MdDialog,
    private myUserInfo: MyUserInfoService
  ) {
    this.myUserInfo.DominionSetToggleValuesForOnlineGame$
      .takeWhile( () => this.alive )
      .subscribe( val => this.newRoom.DominionSetToggleValues = val );

    this.myUserInfo.numberOfPlayersForOnlineGame$
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
    this.myUserInfo.setNumberOfPlayersForOnlineGame( this.newRoom.numberOfPlayers );
  }
  decrement() {
    this.newRoom.numberOfPlayers--;
    this.myUserInfo.setNumberOfPlayersForOnlineGame( this.newRoom.numberOfPlayers );
  }

  DominionSetToggleValuesOnChange( value: { index: number, checked: boolean } ) {
    this.newRoom.DominionSetToggleValues[ value.index ] = value.checked;
    this.myUserInfo.setDominionSetsSelectedForOnlineGame( this.newRoom.DominionSetToggleValues );
  }

  newGame() {
    const newGameState = new GameState();
    newGameState.setNumberOfPlayers( this.newRoom.numberOfPlayers );
    newGameState.initCards( this.newRoom.selectedCards, this.cardPropertyList );
    newGameState.initDecks();
    this.newRoom.gameStateID = this.gameStateService.addGameState( newGameState ).key;

    const newRoomID = this.gameRoomsService.addGameRoom( this.newRoom ).key;
    this.newRoom.databaseKey = newRoomID;

    this.gameRoomsService.addMember( newRoomID, this.myName );

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
          this.gameRoomsService.removeGameRoomByID( this.newRoom.databaseKey );
          this.gameStateService.removeGameStateByID( this.newRoom.gameStateID );
        } else {
          this.openSnackBar('Successfully signed in!');
        }
      });
  }

  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }
}
