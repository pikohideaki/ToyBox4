import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { MdDialog, MdDialogRef } from '@angular/material';

import { MyUserInfoService } from '../../../my-user-info.service';
import { FireDatabaseMediatorService } from '../../../fire-database-mediator.service';
import { GameRoom } from '../../../classes/game-room';


@Component({
  selector: 'app-sign-in-to-game-room-dialog',
  templateUrl: './sign-in-to-game-room-dialog.component.html',
  styleUrls: ['./sign-in-to-game-room-dialog.component.css']
})
export class SignInToGameRoomDialogComponent implements OnInit, OnDestroy {
  private alive: boolean = true;

  @Input() newRoom: GameRoom;
  @Input() dialogRef;
  players$: Observable<string[]>;
  selectedExpansions: string[] = [];


  constructor(
    private router: Router,
    public dialog: MdDialog,
    private database: FireDatabaseMediatorService,
    private myUserInfo: MyUserInfoService
  ) { }

  ngOnInit() {
    this.myUserInfo.setOnlineGameRoomID( this.newRoom.databaseKey );
    this.myUserInfo.setOnlineGameStateID( this.newRoom.gameStateID );

    this.database.expansionsNameList$
      .takeWhile( () => this.alive )
      .subscribe( val => this.selectedExpansions = val.filter( (_, i) => this.newRoom.isSelectedExpansions[i] ) );

    this.database.onlineGameRoomList$
      .map( list => list.findIndex( room => room.databaseKey === this.newRoom.databaseKey ) )
      .filter( result => result === -1 )  // selecting room has removed
      .takeWhile( () => this.alive )
      .subscribe( () => this.dialogRef.close() );

    this.players$ = this.database.onlineGameRoomList$.map( list =>
        ( list.find( e => e.databaseKey === this.newRoom.databaseKey ) || new GameRoom() ).players )

    this.players$
      .filter( players => this.playerCompleted( players.length ) )
      .takeWhile( () => this.alive )
      .subscribe( () => {
        this.database.onlineGameRoom.setWaitingForPlayersValue( this.newRoom.databaseKey, false );
        setTimeout( () => {
          this.router.navigate( ['/online-game-main'] );
          this.dialogRef.close();
        }, 1000);
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  playerCompleted( numberOfPlayers: number ): boolean {
    return ( numberOfPlayers >= this.newRoom.numberOfPlayers );
  }

}
