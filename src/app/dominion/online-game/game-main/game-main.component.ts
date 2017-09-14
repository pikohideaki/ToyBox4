import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { UtilitiesService } from '../../../my-library/utilities.service';
import { MyUserInfoService } from '../../../my-user-info.service';
import { FireDatabaseMediatorService } from '../../../fire-database-mediator.service';

import { GameRoom     } from '../../../classes/game-room';
import { GameState    } from '../../../classes/game-state';
import { CardProperty } from '../../../classes/card-property';


@Component({
  selector: 'app-game-main',
  templateUrl: './game-main.component.html',
  styleUrls: ['./game-main.component.css']
})
export class GameMainComponent implements OnInit, OnDestroy {
  private alive: boolean = true;
  receiveDataDone: boolean = false;

  myIndex$: Observable<number>;
  myIndex: number;

  roomID$: Observable<string>;
  myGameRoom$: Observable<GameRoom>;
  myGameRoom: GameRoom;

  myGameState$: Observable<GameState>;
  myGameState: GameState;

  cardPropertyList$ = this.database.cardPropertyList$;
  cardPropertyList: CardProperty[];

  json: string;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utils: UtilitiesService,
    private database: FireDatabaseMediatorService,
    private myUserInfo: MyUserInfoService
  ) {
  }

  ngOnInit() {
    this.roomID$ = this.route.paramMap.switchMap( (params: ParamMap) => params.getAll('id') );

    this.myGameRoom$
      = this.database.onlineGameRoomList$.combineLatest(
          this.roomID$,
          (list, id) => list.find( e => e.databaseKey === id ) );

    const myGameStateID$ = this.myGameRoom$.map( (myGameRoom: GameRoom) => myGameRoom.gameStateID );

    this.myGameState$
      = this.database.onlineGameStateList$.combineLatest(
          myGameStateID$,
          (list, id) => list.find( e => e.databaseKey === id ) );

    Observable.combineLatest(
        this.myGameRoom$,
        this.myGameState$,
        this.database.cardPropertyList$,
        (myGameRoom, myGameState, cardPropertyList) => ({
          myGameRoom: myGameRoom,
          myGameState: myGameState,
          cardPropertyList: cardPropertyList,
        }) )
      .takeWhile( () => this.alive )
      .subscribe( val => {
        this.myGameRoom = val.myGameRoom;
        this.myGameState = val.myGameState;
        this.cardPropertyList = val.cardPropertyList;
        console.log( this.myGameRoom, this.myGameState );
        this.receiveDataDone = true;
      });

    this.myIndex$ = Observable.combineLatest(
        this.myGameRoom$,
        this.myUserInfo.name$,
        (myGameRoom, myName) => myGameRoom.players.findIndex( e => e === myName ) )
      .first();

    this.myIndex$
      .takeWhile( () => this.alive )
      .subscribe( val => this.myIndex = val );

    this.startGame();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  onCardClicked( value ) {
    console.log( value );
  }

  sortMyHandCards() {
    if ( !this.receiveDataDone ) return;
    this.myGameState.sortHandCards( this.myIndex );
  }

  startGame() {

  }

}
