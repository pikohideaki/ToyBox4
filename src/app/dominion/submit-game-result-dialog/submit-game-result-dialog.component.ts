import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MdDialogRef } from '@angular/material';

import { MyUtilitiesService } from '../../my-utilities.service';

import { DominionDatabaseService } from '../dominion-database.service';

import { GameResult } from '../game-result';
import { CardProperty } from '../card-property';
import { SelectedCards } from '../selected-cards';

@Component({
  selector: 'app-submit-game-result-dialog',
  templateUrl: './submit-game-result-dialog.component.html',
  styleUrls: [
    '../../my-data-table/my-data-table.component.css',
    './submit-game-result-dialog.component.css'
  ]
})
export class SubmitGameResultDialogComponent implements OnInit, OnDestroy {

  private alive: boolean = true;
  @Input() newGameResult: GameResult;

  constructor(
    public dialogRef: MdDialogRef<SubmitGameResultDialogComponent>,
    private utils: MyUtilitiesService,
    private database: DominionDatabaseService
  ) {
  }

  ngOnInit() {
    this.database.scoringList$
      .takeWhile( () => this.alive )
      .subscribe( defaultScores => {
        this.newGameResult.rankPlayers();
        this.newGameResult.setScores( defaultScores );
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }


  submitGameResult() {
    const grObj = {
      date    : this.newGameResult.date.toString(),
      place   : this.newGameResult.place,
      players : this.newGameResult.players.map( pl => ({
          name      : pl.name,
          VP        : pl.VP,
          lessTurns : pl.lessTurns,
        }) ),
      memo                : this.newGameResult.memo,
      selectedDominionSet : this.newGameResult.selectedDominionSet,
      selectedCardsID     : {
        Prosperity      : this.newGameResult.selectedCardsID.Prosperity,
        DarkAges        : this.newGameResult.selectedCardsID.DarkAges,
        KingdomCards10  : this.newGameResult.selectedCardsID.KingdomCards10,
        BaneCard        : this.newGameResult.selectedCardsID.BaneCard,
        EventCards      : this.newGameResult.selectedCardsID.EventCards,
        Obelisk         : this.newGameResult.selectedCardsID.Obelisk,
        LandmarkCards   : this.newGameResult.selectedCardsID.LandmarkCards,
        BlackMarketPile : this.newGameResult.selectedCardsID.BlackMarketPile,
      }
    };

    this.database.addGameResult( grObj );
  }
}
