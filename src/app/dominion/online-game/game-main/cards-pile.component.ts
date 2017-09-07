import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CardProperty             } from '../../../classes/card-property';
import { GameCardID, GameCardData } from '../../../classes/game-state';


@Component({
  selector: 'app-cards-pile',
  template: `
    <app-dominion-card-image
    [faceUp]="faceUp"
    [width]="width"
    [isButton]="isButton"
    [description]="description"
    [card]="card"
    [empty]="empty"
    [returnValueOnClicked]="returnValueOnClicked"
    (cardClicked)="onClicked( $event )" >
  </app-dominion-card-image>
  `,
  styles: [],
})
export class CardsPileComponent implements OnInit {

  @Input() private cardPropertyList: CardProperty[] = [];
  @Input() private gameCardIDarray: GameCardID[] = [];
  @Input() private gameCardData: GameCardData[] = [];

  @Input() public faceUp: boolean = true;
  @Input() public width: number;
  @Input() public isButton: boolean = false;
  @Input() public description: string = '';
  @Input() public empty: boolean = false;

  @Output() private cardClicked = new EventEmitter<any>();

  card: CardProperty;
  returnValueOnClicked = -1;

  constructor() { }

  ngOnInit() {
    this.card = this.cardPropertyList[0];  // default
    if ( this.empty || this.gameCardIDarray === undefined || this.gameCardIDarray.length === 0 ) {
      this.faceUp = false;
      this.empty = true;
    } else if ( this.faceUp ) {
      const topCardID = this.gameCardIDarray[0];
      this.card = this.cardPropertyList[ this.gameCardData[ topCardID ].cardPropertyListIndex ];
      this.returnValueOnClicked = topCardID;
    }
  }

  onClicked( value ) {
    if ( this.isButton ) {
      this.cardClicked.emit( value );
    }
  }
}
