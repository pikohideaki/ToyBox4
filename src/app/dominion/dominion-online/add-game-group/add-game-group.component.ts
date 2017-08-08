import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdTooltipModule, MdDialog, MdSnackBar } from '@angular/material';

import { MyUtilitiesService } from '../../../my-utilities.service';

import { GameRoom } from '../game-room';
import { GameRoomsService } from '../game-rooms.service';
import { SignInToGameRoomDialogComponent } from '../sign-in-to-game-room-dialog/sign-in-to-game-room-dialog.component';

// selectCards
import { MySyncGroupService } from '../../randomizer/my-sync-group.service';
import { SelectedDominionSetService } from '../../randomizer/selected-dominion-set.service';
import { SelectedCardsService } from '../../randomizer/selected-cards.service';
import { BlackMarketPileShuffledService } from '../../randomizer/black-market-pile-shuffled.service';


@Component({
  providers: [
    MySyncGroupService,
    SelectedDominionSetService,
    SelectedCardsService,
    BlackMarketPileShuffledService,
  ],
  selector: 'app-add-game-group',
  templateUrl: './add-game-group.component.html',
  styleUrls: [ './add-game-group.component.css' ]
})
export class AddGameGroupComponent implements OnInit, OnDestroy {
  private alive: boolean = true;

  newRoom: GameRoom = new GameRoom();
  myName: string;

  constructor(
    private utils: MyUtilitiesService,
    private gameRoomsService: GameRoomsService,
    public snackBar: MdSnackBar,
    public dialog: MdDialog
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }


  increment() { this.newRoom.numberOfPlayers++; }
  decrement() { this.newRoom.numberOfPlayers--; }

  newGame() {
    const dialogRef = this.dialog.open( SignInToGameRoomDialogComponent, { data: this.newRoom } );
    dialogRef.afterClosed().subscribe( result => {
      if ( result === 'OK Clicked' ) {
        this.gameRoomsService.addGameRoom( this.newRoom );
        this.openSnackBar('Successfully signed in!');
      }
    });
  }


  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }
}
