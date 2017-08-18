import { Component, OnInit } from '@angular/core';
import { GameRoomsService } from './game-rooms.service';
import { GameStateService } from './game-state.service';

@Component({
  providers: [GameRoomsService, GameStateService],
  selector: 'app-online-game',
  templateUrl: './online-game.component.html',
  styleUrls: ['./online-game.component.css']
})
export class OnlineGameComponent implements OnInit {

  myName: string;

  constructor() { }

  ngOnInit() {
  }

}
