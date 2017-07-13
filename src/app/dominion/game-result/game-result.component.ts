import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Rx';

import { MyUtilitiesService } from '../../my-utilities.service';
import { MyFirebaseSubscribeService } from "../my-firebase-subscribe.service";
import { GameResult } from "../game-result";


@Component({
  providers: [MyFirebaseSubscribeService],
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.css']
})
export class GameResultComponent implements OnInit, OnDestroy {

  subscriptions = [];

  httpGetDone: boolean = false;
  GameResultList: GameResult[] = [];
  GameResultListFiltered: GameResult[] = [];

  playerNumOptions: { playerNum: number, selected: boolean }[] = [];

  dateBegin: Date;
  dateEnd  : Date;


  constructor(
    private utils: MyUtilitiesService,
    afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService
  ) {
    this.dateBegin = new Date();
    this.dateEnd   = new Date();

    const ScoringList$ = afDatabase.list( '/data/ScoringList' );
    const GameResultList$ = afDatabase.list( '/data/GameResultList', { preserveSnapshot: true } );

    Promise.all([
      ScoringList$.first().toPromise(),
      GameResultList$.first().toPromise(),
    ]).then( () => this.httpGetDone = true );

    this.subscriptions.push(
      ScoringList$.subscribe( val => {
        let ScoringList = this.afDatabaseService.convertAs( val, "ScoringList" );

        this.subscriptions.push(
          GameResultList$.subscribe( val => {
            this.GameResultList = this.afDatabaseService.convertAs( val, "GameResultList", ScoringList );

            this.playerNumOptions
              = this.utils.uniq( this.GameResultList.map( e => e.players.length ).sort() )
                          .map( v => { return { playerNum: v, selected: true }; } );
            this.resetFilter();
          } )
        );
      })
    );
  }



  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach( e => e.unsubscribe() );
  }



  filterGameResultList() {
    let playerNumIsSelected = {};
    this.playerNumOptions.forEach( e => playerNumIsSelected[e.playerNum] = e.selected );

    this.GameResultListFiltered = this.GameResultList.filter(
      gr => (    this.utils.getMidnightOfDate( gr.date ) >= this.dateBegin
              && this.utils.getMidnightOfDate( gr.date ) <= this.dateEnd
              && playerNumIsSelected[gr.players.length] )
    );
  }

  latestResult() {
    let latestDate = new Date( this.utils.back( this.GameResultList.map( e => e.date ) ) );
    this.dateEnd   = this.utils.getMidnightOfDate( latestDate );
    this.dateBegin = this.utils.getMidnightOfDate( latestDate );
    this.filterGameResultList();
  }

  resetFilter() {
    // set default values (don't use setDate() to avoid letting ngModel sleep)
    this.dateBegin = this.utils.getMidnightOfDate( this.utils.front( this.GameResultList.map( e => e.date ) ) );
    this.dateEnd   = this.utils.getMidnightOfDate( this.utils.back ( this.GameResultList.map( e => e.date ) ) );
    this.playerNumOptions.forEach( e => e.selected = true );
    this.filterGameResultList();
  }
}
