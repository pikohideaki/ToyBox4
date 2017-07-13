import { Component, OnInit, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CardProperty } from '../card-property';

@Component({
  selector: 'dominion-card-image',
  templateUrl: './dominion-card-image.component.html',
  styleUrls: ['./dominion-card-image.component.css']
})
export class DominionCardImageComponent implements OnInit, OnChanges {

  private CARD_IMAGE_DIR = `${this.DOMINION_DATA_DIR}/img/card`;


  @Input() card: CardProperty;
  @Input() faceUp: boolean;
  @Input() width: number;
  @Input() height: number;
  @Input() isButton: boolean;
  @Input() description: string;


  wideCardTypes = [ 'イベント', 'ランドマーク' ];

  sourceDir: string;

  constructor(
    @Inject('DOMINION_DATA_DIR') private DOMINION_DATA_DIR: string
  ) { }

  ngOnInit() {
    this.setWidth();
    this.setHeight();
    this.setSourceDir();
  }

  ngOnChanges( changes ) {
    if ( changes.width || changes.height ) {
      if ( this.height !== undefined ) this.setWidth();
      if ( this.width  !== undefined ) this.setHeight();
    }
    if ( changes.faceUp || changes.card ) {
      this.setSourceDir();
    }
  }


  private setSourceDir() {
    if ( this.faceUp ) {
      this.sourceDir = `${this.CARD_IMAGE_DIR}/${this.card.name_eng.replace( / /g , '_' ).replace( /'/g , '' )}@2x.png`;
    } else {
      this.sourceDir = `${this.CARD_IMAGE_DIR}/BlankCard.png`;
    }
  }

  setHeight() {
    if ( this.wideCardTypes.findIndex( e => e == this.card.card_type ) != -1 ) {
      this.height = this.width * 75 / 115;  // wide
    } else {
      this.height = this.width * 115 / 75;
    }
  }

  setWidth() {
    if ( this.wideCardTypes.findIndex( e => e == this.card.card_type ) != -1  ) {
      this.width = this.height * 115 / 75;  // wide
    } else {
      this.width = this.height * 75 / 115;
    }
  }

}
