import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { MyUtilitiesService } from '../../my-utilities.service';
import { GameRoom } from './game-room';

@Injectable()
export class GameRoomsService {

  private gameRoomsSource = new BehaviorSubject< GameRoom[] >([]);
  public gameRooms$ = this.gameRoomsSource.asObservable();
  private gameRooms: GameRoom[] = [];

  constructor(
    private utils: MyUtilitiesService,
  ) {
    this.gameRooms$.subscribe( val => this.gameRooms = val );
  }


  changeGameRooms( newGameRooms: GameRoom[] ) {
    this.gameRoomsSource.next( newGameRooms );
    // this.mySyncGroup.setSelectedCards( newSelectedCards );
  }

  addGameRoom( newGameRoom: GameRoom ) {
    this.gameRooms.push( newGameRoom );
    this.changeGameRooms( this.gameRooms );
  }

  removeGameRoom( index: number ) {
    this.utils.removeAt( this.gameRooms, index );
    this.changeGameRooms( this.gameRooms );
  }

}
