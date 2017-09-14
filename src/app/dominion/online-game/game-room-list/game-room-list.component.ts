import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdDialog, MdSnackBar } from '@angular/material';

import { UtilitiesService } from '../../../my-library/utilities.service';
import { FireDatabaseMediatorService } from '../../../fire-database-mediator.service';

import { GameRoom } from '../../../classes/game-room';
import { SignInToGameRoomDialogComponent } from '../sign-in-to-game-room-dialog/sign-in-to-game-room-dialog.component';

@Component({
  selector: 'app-game-room-list',
  templateUrl: './game-room-list.component.html',
  styleUrls: ['./game-room-list.component.css']
})
export class GameRoomListComponent implements OnInit, OnDestroy {
  private alive: boolean = true;

  @Input() myName: string;
  gameRoomList: GameRoom[] = [];
  selectedRoomID = '';


  constructor(
    public snackBar: MdSnackBar,
    public dialog: MdDialog,
    private utils: UtilitiesService,
    private database: FireDatabaseMediatorService,
  ) {
    this.database.onlineGameRoomList$
      .map( list => list.reverse() )
      .takeWhile( () => this.alive )
      .subscribe( val => this.gameRoomList = val );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private roomByID( roomID ): GameRoom {
    return this.gameRoomList.find( g => g.databaseKey === roomID );
  }

  signIn( roomID: string ) {
    const dialogRef = this.dialog.open( SignInToGameRoomDialogComponent );
    dialogRef.componentInstance.newRoom = this.roomByID( roomID );
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.disableClose = true;
    const myMemberID = this.database.onlineGameRoom.addMember( roomID, this.myName ).key;

    dialogRef.afterClosed()
      .takeWhile( () => this.alive )
      .subscribe( result => {
        if ( result === 'Cancel Clicked' ) {
          this.database.onlineGameRoom.removeMember( roomID, myMemberID );
        } else {
          this.openSnackBar('Successfully signed in!');
        }
      });

  }

  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }

  roomClicked( clickedRoomID ) {
    if ( this.selectedRoomID === clickedRoomID ) this.selectedRoomID = '';  // toggle
    else this.selectedRoomID = clickedRoomID;
    event.stopPropagation();
  }

  backgroundClicked() {
    this.selectedRoomID = '';
  }

}
