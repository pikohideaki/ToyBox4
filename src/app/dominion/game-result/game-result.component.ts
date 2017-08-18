import { Component, OnInit, Inject, OnDestroy, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { UtilitiesService } from '../../utilities.service';
import { DominionDatabaseService } from '../dominion-database.service';
import { GameResult } from '../game-result';


@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.css']
})
export class GameResultComponent implements OnInit, OnDestroy {

  private alive = true;
  receiveDataDone = false;

  private gameResultList: GameResult[];
  gameResultListFiltered$: Observable<GameResult[]>;


  // Observable source
  private dateBeginSource = new BehaviorSubject<Date>( new Date() );
  private dateEndSource   = new BehaviorSubject<Date>( new Date() );
  private numberOfPlayersCheckedSource
    = new BehaviorSubject<{ numberOfPlayers: number, checked: boolean }[]>(
      this.utils.numberSequence( 2, 5 ).map( i => ({ numberOfPlayers: i, checked: (i <= 4) }))
    );  // [2:true, 3:true, 4:true, 5:true, 6:true]

  // Observable stream
  dateBegin$ = this.dateBeginSource.asObservable();
  dateEnd$   = this.dateEndSource.asObservable();
  numberOfPlayersChecked$ = this.numberOfPlayersCheckedSource.asObservable();


  constructor(
    private utils: UtilitiesService,
    private database: DominionDatabaseService
  ) {
    this.database.gameResultList$
      .takeWhile( () => this.alive )
      .subscribe( gameResultList => {
        this.receiveDataDone = true;
        this.gameResultList = gameResultList;  // extract current value
        this.resetFormControls( gameResultList );
      });


    this.gameResultListFiltered$
      = Observable.combineLatest(
          this.database.gameResultList$,
          this.dateBegin$,
          this.dateEnd$,
          this.numberOfPlayersChecked$,
          ( gameResultList: GameResult[],
            dateBegin: Date,
            dateEnd: Date,
            numberOfPlayersChecked ) =>
                this.filterGameResultList( gameResultList,
                  {
                    dateBegin: dateBegin,
                    dateEnd: dateEnd,
                    numberOfPlayersChecked: numberOfPlayersChecked
                  }) );

  }


  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }



  private filterFunction( gameResult: GameResult, filterBy ): boolean {
    const mDate = this.utils.getMidnightOfDate( gameResult.date );
    return (    mDate >= filterBy.dateBegin
             && mDate <= filterBy.dateEnd
             && filterBy.numberOfPlayersChecked
                 .find( e => e.numberOfPlayers === gameResult.players.length )
                 .checked );
  }

  private filterGameResultList( gameResultList: GameResult[], filterBy ) {
    return ( gameResultList ? gameResultList.filter( gr => this.filterFunction( gr, filterBy ) )
                            : gameResultList );
  }



  // service command
  changeDateBegin( date: Date ) { this.dateBeginSource.next(date); }
  changeDateEnd( date: Date ) { this.dateEndSource.next(date); }
  changeNumberOfPlayersChecked( numberOfPlayersChecked ) {
    this.numberOfPlayersCheckedSource.next( numberOfPlayersChecked );
  }


  private setDateToLatest( gameResultList: GameResult[] ) {
    if ( gameResultList.length === 0 ) return;
    const latestDate = this.utils.getMidnightOfDate( this.utils.back( gameResultList ).date );
    this.changeDateBegin( latestDate );
    this.changeDateEnd( latestDate );
  }

  latestResultClicked() {
    this.setDateToLatest( this.gameResultList );
  }



  private resetFormControls( gameResultList: GameResult[] ) {
    if ( gameResultList.length === 0 ) return;
    const dateBegin = this.utils.getMidnightOfDate( this.utils.front( gameResultList ).date );
    const dateEnd   = this.utils.getMidnightOfDate( this.utils.back ( gameResultList ).date );
    const numberOfPlayersOptions
      = this.utils.uniq( gameResultList.map( e => e.players.length ) )
                  .sort( (a, b) => a - b )
                  .map( num => ({ numberOfPlayers: num, checked: true }) )
    this.changeDateBegin( dateBegin );
    this.changeDateEnd( dateEnd );
    this.changeNumberOfPlayersChecked( numberOfPlayersOptions );
  }

  resetAllClicked() {
    this.resetFormControls( this.gameResultList );
  }


  numberOfPlayersOnCheck( checked, numberOfPlayers ) {
    const numberOfPlayersChecked = this.numberOfPlayersCheckedSource.value;
    numberOfPlayersChecked.find( e => e.numberOfPlayers === numberOfPlayers ).checked = checked;
    this.changeNumberOfPlayersChecked( numberOfPlayersChecked )
  }

}
