import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { MdDialog } from '@angular/material';

import { GameResult    } from '../../../../classes/game-result';
import { SelectedCards } from '../../../../classes/selected-cards';
import { CardProperty  } from '../../../../classes/card-property';

import { FireDatabaseMediatorService } from '../../../../fire-database-mediator.service';

import { CardPropertyDialogComponent } from '../../../pure-components/card-property-dialog/card-property-dialog.component';


@Component({
  selector: 'app-game-result-detail-dialog',
  templateUrl: './game-result-detail-dialog.component.html',
  styleUrls: [
    '../../../../my-library/data-table/data-table.component.css',
    './game-result-detail-dialog.component.css'
  ]
})
export class GameResultDetailDialogComponent implements OnInit, OnDestroy {
  private alive = true;

  cardPropertyList: CardProperty[] = [];

  @Input() gameResult: GameResult = new GameResult();
  @Input() selectedCards: SelectedCards = new SelectedCards();


  constructor(
    public dialog: MdDialog,
    private database: FireDatabaseMediatorService
  ) {
  }

  ngOnInit() {
    const toIndex = ( cardID => this.cardPropertyList.findIndex( e => e.cardID === cardID ) );

    this.database.cardPropertyList$
      .takeWhile( () => this.alive )
      .subscribe( val => {
        this.cardPropertyList = val;

        this.selectedCards.Prosperity      = this.gameResult.selectedCardsID.Prosperity;
        this.selectedCards.DarkAges        = this.gameResult.selectedCardsID.DarkAges;
        this.selectedCards.KingdomCards10  = (this.gameResult.selectedCardsID.KingdomCards10  || []).map( toIndex );
        this.selectedCards.BaneCard        = (this.gameResult.selectedCardsID.BaneCard        || []).map( toIndex );
        this.selectedCards.EventCards      = (this.gameResult.selectedCardsID.EventCards      || []).map( toIndex );
        this.selectedCards.Obelisk         = (this.gameResult.selectedCardsID.Obelisk         || []).map( toIndex );
        this.selectedCards.LandmarkCards   = (this.gameResult.selectedCardsID.LandmarkCards   || []).map( toIndex );
        this.selectedCards.BlackMarketPile = (this.gameResult.selectedCardsID.BlackMarketPile || []).map( toIndex );
      });

  }

  ngOnDestroy() {
    this.alive = false;
  }


  cardInfoButtonClicked( cardIndex: number ) {
    const dialogRef = this.dialog.open( CardPropertyDialogComponent );
    dialogRef.componentInstance.card = this.cardPropertyList[cardIndex];
  }
}
