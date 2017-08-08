import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { NgForm } from '@angular/forms';
import { MdDialog, MdSnackBar } from '@angular/material';

import { MyUtilitiesService } from '../../../my-utilities.service';

import { GameRoom } from '../game-room';
import { GameRoomsService } from '../game-rooms.service';
import { SignInToGameRoomDialogComponent } from '../sign-in-to-game-room-dialog/sign-in-to-game-room-dialog.component';

@Component({
  providers: [GameRoomsService],
  selector: 'app-game-room-list',
  templateUrl: './game-room-list.component.html',
  styleUrls: ['./game-room-list.component.css']
})
export class GameRoomListComponent implements OnInit, OnDestroy {
  private alive: boolean = true;

  gameRoomList: GameRoom[] = [];

  signInPassword: string;
  showWrongPasswordAlert = false;

  constructor(
    private router: Router,
    public snackBar: MdSnackBar,
    public dialog: MdDialog,
    public utils: MyUtilitiesService,
    private gameRoomsService: GameRoomsService
  ) {
    this.gameRoomsService.gameRooms$
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
    return this.gameRoomList.find( g => g.id === roomID );
  }

  private resetSignInForm() {
    this.signInPassword = undefined;
  }

  addGameRoom = async () => {
    const dialogRef = this.dialog.open( SignInToGameRoomDialogComponent );
  };


  signIn( roomID: number ) {
    const dialogRef = this.dialog.open( SignInToGameRoomDialogComponent, { data: this.roomByID( roomID ) } );
    dialogRef.afterClosed().subscribe( result => {
      if ( result === 'OK Clicked' ) {
        this.openSnackBar('Successfully signed in!');
      }
    });
  }

  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }

  roomClicked( event, index: number ) {
    this.resetSignInForm();
    this.gameRoomList.forEach( g => g.selected = false );
    this.gameRoomList[index].selected = !this.gameRoomList[index].selected;  // toggle
    event.stopPropagation();
  }

  backgroundClicked() {
    this.resetSignInForm();
    this.gameRoomList.forEach( g => g.selected = false );
  }


}
