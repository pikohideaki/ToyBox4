import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Observable } from 'rxjs/Rx';


import { UtilitiesService } from '../../../utilities.service';

import { GameRoom } from '../game-room';
import { GameRoomsService } from '../game-rooms.service';

import { GameState } from '../game-state';
import { GameStateService } from '../game-state.service';

import { DominionDatabaseService } from '../../dominion-database.service';
import { CardProperty } from '../../card-property';
import { MyUserInfoService } from '../../../my-user-info.service';


@Component({
  providers: [GameRoomsService, GameStateService, MyUserInfoService],
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

  cardPropertyList: CardProperty[];

  json: string;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public utils: UtilitiesService,
    public database: DominionDatabaseService,
    private gameRoomsService: GameRoomsService,
    private gameStateService: GameStateService,
    private myUserInfo: MyUserInfoService
  ) {
  }

  ngOnInit() {
    this.roomID$ = this.route.paramMap.switchMap( (params: ParamMap) => params.getAll('id') );

    this.myGameRoom$
      = this.gameRoomsService.gameRoomList$.combineLatest(
          this.roomID$,
          (list, id) => list.find( e => e.databaseKey === id ) );

    const myGameStateID$ = this.myGameRoom$.map( (myGameRoom: GameRoom) => myGameRoom.gameStateID );

    this.myGameState$
      = this.gameStateService.gameStateList$.combineLatest(
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
        this.myUserInfo.myName$,
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
