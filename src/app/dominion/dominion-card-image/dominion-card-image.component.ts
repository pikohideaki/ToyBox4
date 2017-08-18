import { Component, OnInit, Inject, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

import { CardProperty } from '../card-property';

@Component({
  selector: 'app-dominion-card-image',
  templateUrl: './dominion-card-image.component.html',
  styleUrls: ['./dominion-card-image.component.css']
})
export class DominionCardImageComponent implements OnInit, OnChanges {

  private CARD_IMAGE_DIR = `${this.DOMINION_DATA_DIR}/img/card`;

  sourceDir: string;

  @Input() private card: CardProperty = new CardProperty();
  @Input() public  faceUp: boolean;
  @Input() public  width: number;
  @Input() public  height: number;
  @Input() public  isButton: boolean = false;
  @Input() public  description: string = '';
  @Input() public  empty: boolean = false;

  @Input() private returnValueOnClicked: any = -1;
  @Output() private cardClicked = new EventEmitter<any>();

  public borderRadius: number;


  constructor(
    @Inject('DOMINION_DATA_DIR') private DOMINION_DATA_DIR: string
  ) { }

  ngOnInit() {
  }

  ngOnChanges( changes ) {
    if ( changes.width || changes.height ) {
      if ( this.height !== undefined ) this.setWidth();
      if ( this.width  !== undefined ) this.setHeight();
    }
    this.setBorderRadius();
    if ( changes.faceUp || changes.card || changes.empty ) {
      this.setSourceDir();
    }
  }


  private setSourceDir() {
    if ( this.empty ) {
      this.sourceDir = `${this.CARD_IMAGE_DIR}/empty.png`;
      return;
    }
    if ( this.faceUp ) {
      this.sourceDir = `${this.CARD_IMAGE_DIR}/${this.card.name_eng.replace( / /g , '_' ).replace( /'/g , '' )}@2x.png`;
    } else {
      this.sourceDir = `${this.CARD_IMAGE_DIR}/BlankCard.png`;
    }
  }

  setHeight() {
    if ( !this.faceUp || !this.card.isWideType() ) {
      this.height = this.width * (23 / 15);
    } else {
      this.height = this.width * (15 / 23);  // wide
    }
  }

  setWidth() {
    if ( !this.faceUp || !this.card.isWideType() ) {
      this.width = this.height * (15 / 23);
    } else {
      this.width = this.height * (23 / 15);  // wide
    }
  }

  setBorderRadius() {
    if ( this.width < this.height ) {
      this.borderRadius = (18 / 250) * this.width;
    } else {
      this.borderRadius = (18 / 250) * this.height;
    }
  }

  onClicked() {
    if ( this.isButton ) {
      this.cardClicked.emit( this.returnValueOnClicked );
    }
  }

}
