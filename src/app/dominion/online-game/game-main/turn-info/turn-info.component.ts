import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-turn-info',
  templateUrl: './turn-info.component.html',
  styleUrls: ['./turn-info.component.css']
})
export class TurnInfoComponent implements OnInit {

  @Input() turnInfo: {
    action: number,
    buy:    number,
    coin:   number,
  } = {
    action: 0,
    buy:    0,
    coin:   0,
  };

  constructor() { }

  ngOnInit() {
  }

}
