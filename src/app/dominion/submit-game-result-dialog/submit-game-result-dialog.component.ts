import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { UtilitiesService } from '../../utilities.service';
import { DominionDatabaseService } from '../dominion-database.service';
import { GameResult } from '../game-result';
import { CardProperty } from '../card-property';
import { SelectedCards } from '../selected-cards';

@Component({
  selector: 'app-submit-game-result-dialog',
  templateUrl: './submit-game-result-dialog.component.html',
  styleUrls: [
    '../../data-table/data-table.component.css',
    './submit-game-result-dialog.component.css'
  ]
})
export class SubmitGameResultDialogComponent implements OnInit, OnDestroy {

  private alive: boolean = true;
  @Input() newGameResult: GameResult;

  constructor(
    public dialogRef: MdDialogRef<SubmitGameResultDialogComponent>,
    private utils: UtilitiesService,
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
    this.database.addGameResult( this.newGameResult );
  }
}
