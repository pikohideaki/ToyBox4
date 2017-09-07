import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { UtilitiesService } from '../../my-library/utilities.service';
import { FireDatabaseMediatorService } from '../../fire-database-mediator.service';
import { GameResult } from '../../classes/game-result';


@Component({
  selector: 'app-submit-game-result-dialog',
  templateUrl: './submit-game-result-dialog.component.html',
  styleUrls: [
    '../../my-library/data-table/data-table.component.css',
    './submit-game-result-dialog.component.css'
  ]
})
export class SubmitGameResultDialogComponent implements OnInit, OnDestroy {
  private alive: boolean = true;

  @Input() newGameResult: GameResult;


  constructor(
    private utils: UtilitiesService,
    private database: FireDatabaseMediatorService
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
    this.database.gameResult.add( this.newGameResult );
  }
}
