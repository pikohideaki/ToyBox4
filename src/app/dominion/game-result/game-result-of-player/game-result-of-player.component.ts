import { Component, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs/Rx';

import { MyUtilitiesService } from '../../../my-utilities.service';
import { MyDataTableComponent } from '../../../my-data-table/my-data-table.component';

import { GameResult } from '../../game-result';


@Component({
  selector: 'app-game-result-of-player',
  templateUrl: './game-result-of-player.component.html',
  styleUrls: [
    '../../../my-data-table/my-data-table.component.css',
    './game-result-of-player.component.css'
  ]
})
export class GameResultOfPlayerComponent implements OnInit {

  @Input() private gameResultListFiltered$: Observable<GameResult[]>;

  rankOptions: boolean[] = [true, true, true, true, true, false, false ];  // Array.from( new Array(7) ).fill(true).fill( false, 5 );

  GameResultOfEachPlayerForView$: Observable<any>;


  constructor(
    private utils: MyUtilitiesService
  ) {}


  ngOnInit() {
    this.GameResultOfEachPlayerForView$
      = this.gameResultListFiltered$.map( list =>
          this.toGameResultOfEachPlayerForView( this.getGameResultOfEachPlayer(list) ) );

    this.gameResultListFiltered$.subscribe( gameResultListFiltered => {
      const maxNumberOfPlayers = this.utils.maxOfArray( gameResultListFiltered.map( e => e.players.length ) );
      this.rankOptions = Array.from( new Array(7) ).fill(true).fill( false, maxNumberOfPlayers + 1 );
    });
  }


  getGameResultOfEachPlayer( gameResultListFiltered: GameResult[] ) {
    // get all player names
    const playerNamesFiltered = new Set();
    gameResultListFiltered.forEach( gr => gr.players.forEach( player => {
      playerNamesFiltered.add( player.name );
    }));

    // initialize
    const gameResultOfEachPlayer = [];
    playerNamesFiltered.forEach( name => {
      gameResultOfEachPlayer[name] = {
        count        : 0,
        countRank    : [0, 0, 0, 0, 0, 0, 0],
        scoreSum     : 0.0,
        scoreAverage : 0.0,
      };
    } );

    // sum up rank & score of each player
    gameResultListFiltered.forEach( gr => gr.players.forEach( player => {
      gameResultOfEachPlayer[ player.name ].countRank[ player.rank ]++;
      gameResultOfEachPlayer[ player.name ].scoreSum += player.score;
    }));

    // calculate countRank and score average
    this.utils.objectForEach( gameResultOfEachPlayer, playerResult => {
      playerResult.countRank.forEach( e => playerResult.count += e );  // sum of countRank
      playerResult.scoreAverage = playerResult.scoreSum / playerResult.count;
    });

    return gameResultOfEachPlayer;
  }


  toGameResultOfEachPlayerForView( gameResultOfEachPlayer ) {
    // round and sort
    const gameResultOfEachPlayerForView = [];  // reset
    this.utils.objectForEach( gameResultOfEachPlayer, (playerResult, playerName) => {
      gameResultOfEachPlayerForView.push( {
        name         : playerName,
        scoreAverage : this.utils.roundAt( playerResult.scoreAverage, 3 ),
        scoreSum     : this.utils.roundAt( playerResult.scoreSum, 3 ),
        count        : playerResult.count,
        countRank    : playerResult.countRank
      })
    });
    gameResultOfEachPlayerForView.sort( (a, b) => b.scoreAverage - a.scoreAverage );
    return gameResultOfEachPlayerForView;
  }

}
