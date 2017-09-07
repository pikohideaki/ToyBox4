import { Component, OnInit, OnDestroy, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { CardProperty          } from '../../../../classes/card-property';
import { GameState, GameCardID } from '../../../../classes/game-state';
import { GameRoom              } from '../../../../classes/game-room';

@Component({
  selector: 'app-turn-player-area',
  templateUrl: './turn-player-area.component.html',
  styleUrls: ['./turn-player-area.component.css']
})
export class TurnPlayerAreaComponent implements OnInit, OnDestroy {
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
