import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { UtilitiesService } from '../../utilities.service';
import { DominionDatabaseService } from '../dominion-database.service';
import { GameRoom } from './game-room';


@Injectable()
export class GameRoomsService {
  public gameRoomList$: Observable<GameRoom[]>;


  constructor(
    private afDatabase: AngularFireDatabase,
    private utils: UtilitiesService,
    private database: DominionDatabaseService
  ) {
    this.gameRoomList$ = this.database.gameRoomList$;
  }


  addGameRoom( newGameRoom: GameRoom ) {
    const newGameRoomObject = Object(newGameRoom);
    newGameRoomObject.timeStamp = newGameRoomObject.timeStamp.toString();
    delete newGameRoomObject.id;
    return this.afDatabase.list( '/onlineGameRooms' ).push( newGameRoom );
  }

  removeGameRoomByID( roomID ) {
    return this.afDatabase.list( '/onlineGameRooms' ).remove( roomID );
  }

  addMember( roomID, playerName ) {
    return this.afDatabase.list(`/onlineGameRooms/${roomID}/players`).push( playerName );
  }

  removeMemberByID( roomID, playerID ) {
    return this.afDatabase.list(`/onlineGameRooms/${roomID}/players`).remove( playerID );
  }

  setWaitingForPlayersValue( roomID, value: boolean ) {
    return this.afDatabase.object(`/onlineGameRooms/${roomID}/waitingForPlayers`).set( value );
  }

}
