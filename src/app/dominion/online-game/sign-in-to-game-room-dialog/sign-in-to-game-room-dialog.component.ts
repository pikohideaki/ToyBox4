import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { MdDialog, MdDialogRef } from '@angular/material';

import { GameRoom } from '../game-room';

import { GameRoomsService } from '../game-rooms.service';

@Component({
  providers: [GameRoomsService],
  selector: 'app-sign-in-to-game-room-dialog',
  templateUrl: './sign-in-to-game-room-dialog.component.html',
  styleUrls: ['./sign-in-to-game-room-dialog.component.css']
})
export class SignInToGameRoomDialogComponent implements OnInit, OnDestroy {
  private alive: boolean = true;

  @Input() newRoom: GameRoom;
  @Input() dialogRef;
  players$: Observable<string[]>;


  constructor(
    private router: Router,
    public dialog: MdDialog,
    private gameRooms: GameRoomsService
  ) { }

  ngOnInit() {
    this.gameRooms.gameRoomList$
      .map( list => list.findIndex( room => room.databaseKey === this.newRoom.databaseKey ) )
      .filter( result => result === -1 )  // selecting room has removed
      .takeWhile( () => this.alive )
      .subscribe( () => this.dialogRef.close() );

    this.players$ = this.gameRooms.gameRoomList$.map( list =>
        ( list.find( e => e.databaseKey === this.newRoom.databaseKey ) || new GameRoom() ).players )

    this.players$
      .filter( players => this.playerCompleted( players.length ) )
      .takeWhile( () => this.alive )
      .subscribe( () => {
        this.gameRooms.setWaitingForPlayersValue( this.newRoom.databaseKey, false );
        setTimeout( () => {
          this.router.navigate( ['/dominion/online-game-main', this.newRoom.databaseKey] );
          this.dialogRef.close();
        }, 3000);
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  playerCompleted( numberOfPlayers: number ): boolean {
    return ( numberOfPlayers >= this.newRoom.numberOfPlayers );
  }

}
