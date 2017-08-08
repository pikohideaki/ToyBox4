import { Component, OnInit } from '@angular/core';
import { GameRoomsService } from './game-rooms.service';

@Component({
  providers: [GameRoomsService],
  selector: 'app-dominion-online',
  templateUrl: './dominion-online.component.html',
  styleUrls: ['./dominion-online.component.css']
})
export class DominionOnlineComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
