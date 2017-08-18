import { Component, OnInit, OnDestroy, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { GameState, GameCardID } from '../../game-state';
import { CardProperty } from '../../../card-property';
import { GameRoom } from '../../game-room';

@Component({
  selector: 'app-other-player-area',
  templateUrl: './other-player-area.component.html',
  styleUrls: ['./other-player-area.component.css']
})
export class OtherPlayerAreaComponent implements OnInit, OnDestroy {
  private alive: boolean = true;

  receiveDataDone: boolean = false;

  @Input() private cardPropertyList$: Observable<CardProperty[]>;
  @Input() private myGameState$: Observable<GameState>;
  @Input() private myGameRoom$: Observable<GameRoom>;
  cardPropertyList: CardProperty[];
  myGameState: GameState;
  myGameRoom: GameRoom;

  @Output() private cardClicked = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    Observable.combineLatest(
        this.cardPropertyList$,
        this.myGameState$,
        this.myGameRoom$,
        (cardPropertyList, myGameState, myGameRoom) => ({
          cardPropertyList: cardPropertyList,
          myGameState: myGameState,
          myGameRoom: myGameRoom
        }) )
      .takeWhile( () => this.alive )
      .subscribe( val => {
        this.cardPropertyList = val.cardPropertyList;
        this.myGameState = val.myGameState;
        this.myGameRoom = val.myGameRoom;
        this.receiveDataDone = true;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  onClick( value ) {
    this.cardClicked.emit( value );
  }
}
