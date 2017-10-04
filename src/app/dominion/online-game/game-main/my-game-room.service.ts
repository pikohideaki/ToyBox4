import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { UtilitiesService } from '../../../my-library/utilities.service';
import { MyUserInfoService } from '../../../my-user-info.service';
import { FireDatabaseMediatorService } from '../../../fire-database-mediator.service';

import { GameRoom } from '../../../classes/game-room';


@Injectable()
export class MyGameRoomService {

  myGameRoom$: Observable<GameRoom>;

  myIndex$: Observable<number>;

  constructor(
    private utils: UtilitiesService,
    private database: FireDatabaseMediatorService,
    private myUserInfo: MyUserInfoService
  ) {
    this.myGameRoom$
      = this.database.onlineGameRoomList$.combineLatest(
            this.myUserInfo.onlineGame.roomID$,
            (list, id) => (list.find( e => e.databaseKey === id ) || new GameRoom()) )
          .distinctUntilChanged();

    this.myIndex$ = Observable.combineLatest(
        this.myGameRoom$.map( e => e.players ).distinctUntilChanged(),
        this.myUserInfo.name$,
        (players, myName) => players.findIndex( e => e === myName ) )
      .first();
  }


}
