import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { UtilitiesService } from '../../utilities.service';
import { GameRoom } from './game-room';

@Injectable()
export class GameRoomsService {

  public gameRoomList$: Observable<GameRoom[]>;

  constructor(
    private afDatabase: AngularFireDatabase,
    private utils: UtilitiesService,
  ) {
    this.gameRoomList$
      = this.afDatabase.list( '/onlineGameRooms', { preserveSnapshot: true } )
          .map( snapshots => snapshots.map( e => new GameRoom( e.val(), e.key ) ) );
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
