import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { NgForm } from '@angular/forms';
import { MdDialog, MdSnackBar } from '@angular/material';

import { UtilitiesService } from '../../../utilities.service';

import { GameRoom } from '../game-room';
import { GameRoomsService } from '../game-rooms.service';
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

  isSelected = {};

  constructor(
    private router: Router,
    public snackBar: MdSnackBar,
    public dialog: MdDialog,
    public utils: UtilitiesService,
    private gameRoomsService: GameRoomsService
  ) {
    this.gameRoomsService.gameRoomList$
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

  signIn( roomID: number ) {
    const dialogRef = this.dialog.open( SignInToGameRoomDialogComponent );
    dialogRef.componentInstance.newRoom = this.roomByID( roomID );
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.disableClose = true;
    const myMemberID = this.gameRoomsService.addMember( roomID, this.myName ).key;

    dialogRef.afterClosed()
      .takeWhile( () => this.alive )
      .subscribe( result => {
        if ( result === 'Cancel Clicked' ) {
          this.gameRoomsService.removeMemberByID( roomID, myMemberID );
        } else {
          this.openSnackBar('Successfully signed in!');
        }
      });

  }

  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }

  roomClicked( clickedRoomID ) {
    Object.keys( this.isSelected ).filter( key => key !== clickedRoomID )
                                  .forEach( key => this.isSelected[key] = false );
    this.isSelected[clickedRoomID] = !this.isSelected[clickedRoomID];  // toggle
    event.stopPropagation();
  }

  backgroundClicked() {
    Object.keys( this.isSelected ).forEach( key => this.isSelected[key] = false );
  }


}
