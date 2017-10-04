import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { isDevMode } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdTooltipModule, MdDialog, MdSnackBar } from '@angular/material';


import { UtilitiesService } from '../../../my-library/utilities.service';
import { MyUserInfoService } from '../../../my-user-info.service';
import { FireDatabaseMediatorService } from '../../../fire-database-mediator.service';
import { AddGameGroupService } from './add-game-group.service';

import { SignInToGameRoomDialogComponent } from '../sign-in-to-game-room-dialog/sign-in-to-game-room-dialog.component';

import { SelectedCards       } from '../../../classes/selected-cards';
import { GameRoom            } from '../../../classes/game-room';
import { GameState           } from '../../../classes/game-state';
import { BlackMarketPileCard } from '../../../classes/black-market-pile-card';


@Component({
  providers: [AddGameGroupService],
  selector: 'app-add-game-group',
  templateUrl: './add-game-group.component.html',
  styleUrls: [ './add-game-group.component.css' ]
})
export class AddGameGroupComponent implements OnInit, OnDestroy {
  private alive: boolean = true;

  @Input() private myName: string;
  // newRoom: GameRoom = new GameRoom();
  numberOfPlayers: number = 2;
  selectedCards: SelectedCards = new SelectedCards();
  BlackMarketPileShuffled: BlackMarketPileCard[] = [];
  isSelectedExpansions: boolean[] = [];

  constructor(
    public snackBar: MdSnackBar,
    public dialog: MdDialog,
    private utils: UtilitiesService,
    private database: FireDatabaseMediatorService,
    private myUserInfo: MyUserInfoService,
    private addGameGroupService: AddGameGroupService
  ) {
    this.myUserInfo.onlineGame.isSelectedExpansions$
      .takeWhile( () => this.alive )
      .subscribe( val => this.isSelectedExpansions = val );

    this.myUserInfo.onlineGame.numberOfPlayers$
      .takeWhile( () => this.alive )
      .subscribe( val => this.numberOfPlayers = val );


    if ( isDevMode() ) {
      const KingdomCardsTest = this.utils.numberSequence(7, 10);
      this.selectedCards.KingdomCards10 = KingdomCardsTest;
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }


  formIsValid(): boolean {
    return (!!this.myName && this.selectedCards.KingdomCards10.length > 0);
  }

  increment() {
    this.numberOfPlayers++;
    this.myUserInfo.setOnlineGameNumberOfPlayers( this.numberOfPlayers );
  }

  decrement() {
    this.numberOfPlayers--;
    this.myUserInfo.setOnlineGameNumberOfPlayers( this.numberOfPlayers );
  }

  isSelectedExpansionsOnChange( value: { index: number, checked: boolean } ) {
    this.isSelectedExpansions[ value.index ] = value.checked;
    this.myUserInfo.setOnlineGameIsSelectedExpansions( this.isSelectedExpansions );
  }

  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }

  async makeNewGameRoom() {
    const newRoom = this.addGameGroupService.init(
        this.numberOfPlayers,
        this.selectedCards,
        this.BlackMarketPileShuffled,
        this.isSelectedExpansions,
        this.myName );

    // dialog
    const dialogRef = this.dialog.open( SignInToGameRoomDialogComponent );
    dialogRef.componentInstance.newRoom = newRoom;
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.disableClose = true;

    const result = await dialogRef.afterClosed().toPromise();

    // this.newRoom.players = [];  // reset members
    if ( result === 'Cancel Clicked' ) {
      this.database.onlineGameRoom.remove( newRoom.databaseKey );
      this.database.onlineGameState.remove( newRoom.gameStateID );
    } else {
      this.openSnackBar('Successfully signed in!');
    }
  }

}
