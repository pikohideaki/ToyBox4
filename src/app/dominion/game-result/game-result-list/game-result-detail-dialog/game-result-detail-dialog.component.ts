import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { MdDialog } from '@angular/material';

import { GameResult } from '../../../game-result';
import { SelectedCards } from '../../../selected-cards';
import { CardProperty } from '../../../card-property';

import { DominionDatabaseService } from '../../../dominion-database.service';

import { CardPropertyDialogComponent } from '../../../card-property-dialog/card-property-dialog.component';


@Component({
  selector: 'app-game-result-detail-dialog',
  templateUrl: './game-result-detail-dialog.component.html',
  styleUrls: [
    '../../../../data-table/data-table.component.css',
    './game-result-detail-dialog.component.css'
  ]
})
export class GameResultDetailDialogComponent implements OnInit, OnDestroy {
  private alive = true;

  cardPropertyList: CardProperty[] = [];

  @Input() gameResult: GameResult;
  @Input() selectedCards: SelectedCards = new SelectedCards();

  DominionSetToggleValues: boolean[] = [];

  constructor(
    public dialog: MdDialog,
    private database: DominionDatabaseService
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

    this.DominionSetToggleValues = this.gameResult.selectedDominionSet;
  }

  ngOnDestroy() {
    this.alive = false;
  }


  cardInfoButtonClicked( cardIndex ) {
    // const selectedCardForView = this.cardPropertyList[cardIndex].transform();
    const dialogRef = this.dialog.open( CardPropertyDialogComponent );
    dialogRef.componentInstance.card = this.cardPropertyList[cardIndex];
    // dialogRef.componentInstance.card = selectedCardForView;
  }
}
