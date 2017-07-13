import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { MdDialog, MdSnackBar } from '@angular/material';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { MyFirebaseSubscribeService } from '../../my-firebase-subscribe.service';

import { MyUtilitiesService } from '../../../my-utilities.service';
import { PlayerName } from '../../player-name';
import { GameResult } from '../../game-result';
import { SelectedCards } from '../../selected-cards';
import { SubmitGameResultDialogComponent } from '../../submit-game-result-dialog/submit-game-result-dialog.component';
import { CardProperty } from '../../card-property';


@Component({
  providers: [MyUtilitiesService, MyFirebaseSubscribeService],
  selector: 'app-add-game-result',
  templateUrl: './add-game-result.component.html',
  styleUrls: [
    '../../../my-data-table/my-data-table.component.css',
    './add-game-result.component.css'
  ]
})
export class AddGameResultComponent implements OnInit, OnDestroy {

  subscriptions = [];

  httpGetDone = false;


  date: Date;

  place = '';
  places: string[] = [];
  stateCtrl: FormControl;
  filteredPlaces: any;

  GameResultList: GameResult[] = [];

  startPlayerName = '';
  memo = '';


  @Input() DominionSetList: { name: string, selected: boolean }[] = [];
  @Input() CardPropertyList: CardProperty[];
  @Input() SelectedCards: SelectedCards = new SelectedCards();

  PlayersNameList: PlayerName[] = [];
  gameResultOfPlayers: {
      name: string,
      selected: boolean,
      VP: number,
      lessTurns: boolean,
    }[] = [];


  newGameResult: GameResult;


  signedIn: boolean;
  mySyncGroupID;

  constructor(
    private utils: MyUtilitiesService,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private afDatabaseService: MyFirebaseSubscribeService,
    private afDatabase: AngularFireDatabase,
    public afAuth: AngularFireAuth
  ) {

    const me$ = this.afAuth.authState;

    this.subscriptions.push(
      me$.subscribe( me => {
        this.signedIn = !!me;
        if ( !this.signedIn ) { return; }

        const myID = me.uid;
        this.subscriptions.push(
          this.afDatabase.object(`/userInfo/${myID}/dominionGroupID`).subscribe( val => {
            this.mySyncGroupID = val.$value;
            if ( !this.mySyncGroupID ) { return; }

            this.subscriptions.push(
              afdb_PlayersNameList.subscribe( val => {
                this.PlayersNameList = this.afDatabaseService.convertAs( val, 'PlayersNameList' );
                this.initializePlayers();
                this.setSubscribers();
              } )
            );

          })
        );
      } )
    );



    this.date = new Date( Date.now() );

    this.stateCtrl = new FormControl();

    const afdb_PlayersNameList = afDatabase.list( '/data/PlayersNameList' );
    const afdb_ScoringList     = afDatabase.list( '/data/ScoringList' );
    const afdb_GameResultList  = afDatabase.list( '/data/GameResultList', { preserveSnapshot: true } );

    Promise.all([
      afdb_PlayersNameList.first().toPromise(),
      afdb_ScoringList.first().toPromise(),
      afdb_GameResultList.first().toPromise(),
    ])
    .then( () => this.httpGetDone = true );


    this.subscriptions.push(
      afdb_ScoringList.subscribe( val => {
        const ScoringList = this.afDatabaseService.convertAs( val, 'ScoringList' );
        this.subscriptions.push(
          afdb_GameResultList.subscribe( value => {
            this.GameResultList = this.afDatabaseService.convertAs( value, 'GameResultList', ScoringList );
            this.places = this.utils.uniq( this.GameResultList.map( e => e.place ) )
                                    .filter( e => e !== '' );

            this.filteredPlaces = this.stateCtrl.valueChanges
                  .startWith(null)
                  .map( name => this.filterPlaces(name) );
          } )
        );
      } )
    );

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach( e => e.unsubscribe() );
  }


  filterPlaces( val: string ): string[] {
    return val ? this.places.filter( s => this.utils.submatch( s, val, true ) )
           : this.places;
  }

  private setSubscribers() {
    for ( let i = 0; i < this.gameResultOfPlayers.length; ++i ) {
      Object.keys( this.gameResultOfPlayers[i] ).forEach( property => {

        this.subscriptions.push(
          this.afDatabase.object(`/syncGroups/${this.mySyncGroupID}/gameResultOfPlayers/${i}/${property}`)
          .subscribe( val => this.gameResultOfPlayers[i][property] = val.$value )
        );
      })
    }

    this.subscriptions.push(
      this.afDatabase.object(`/syncGroups/${this.mySyncGroupID}/gameResultOfPlayers/startPlayerName`)
      .subscribe( val => this.startPlayerName = val.$value )
    );
  }


  private initializePlayers(): void {
    this.gameResultOfPlayers = this.PlayersNameList.map( player => {
      return {
        name      : player.name,
        selected  : false,
        VP        : 0,
        lessTurns : false,
      } } );

    if ( this.signedIn && this.mySyncGroupID !== '' ) {
      this.afDatabase.object( `/syncGroups/${this.mySyncGroupID}/gameResultOfPlayers`)
        .set( this.gameResultOfPlayers );
    }
  }

  selectedPlayers(): any[] {
    return this.gameResultOfPlayers.filter( player => player.selected );
  }


  selectStartPlayer(): void {
    if ( this.selectedPlayers().length < 1 ) { return; }
    this.startPlayerName = this.utils.getRandomValue( this.selectedPlayers() ).name;
    this.afDatabase.object(`/syncGroups/${this.mySyncGroupID}/gameResultOfPlayers/startPlayerName`).set( this.startPlayerName );
  }


  playerNumOK(): boolean {
    return ( 2 <= this.selectedPlayers().length && this.selectedPlayers().length <= 6 );
  }


  submitGameResult(): void {
    if ( !this.playerNumOK() ) { return; }
    const dialogRef = this.dialog.open( SubmitGameResultDialogComponent );

    this.newGameResult = new GameResult({
      no     : this.GameResultList.length + 1,
      date   : this.date,
      place  : this.place,
      memo   : this.memo,
      DominionSetsSelected : this.DominionSetList.map( e => e.selected ),
      SelectedCardsID      : {
        Prosperity      : this.SelectedCards.Prosperity,
        DarkAges        : this.SelectedCards.DarkAges,
        KingdomCards10  : this.SelectedCards.KingdomCards10 .map( cardIndex => this.CardPropertyList[cardIndex].card_ID ),
        BaneCard        : this.SelectedCards.BaneCard       .map( cardIndex => this.CardPropertyList[cardIndex].card_ID ),
        EventCards      : this.SelectedCards.EventCards     .map( cardIndex => this.CardPropertyList[cardIndex].card_ID ),
        Obelisk         : this.SelectedCards.Obelisk        .map( cardIndex => this.CardPropertyList[cardIndex].card_ID ),
        LandmarkCards   : this.SelectedCards.LandmarkCards  .map( cardIndex => this.CardPropertyList[cardIndex].card_ID ),
        BlackMarketPile : this.SelectedCards.BlackMarketPile.map( cardIndex => this.CardPropertyList[cardIndex].card_ID ),
      },
      players : this.selectedPlayers().map( pl => {
              return {
                name      : pl.name,
                VP        : pl.VP,
                lessTurns : pl.lessTurns,
                rank      : 1,
                score     : 0,
              }
            }),
    });

    dialogRef.componentInstance.newGameResult = this.newGameResult;

    dialogRef.afterClosed().subscribe( result => {
      if ( result === 'OK Clicked' ) {
        this.gameResultOfPlayers.forEach( pl => {
          pl.lessTurns = false;
          pl.VP = 0;
        });

        if ( this.signedIn && this.mySyncGroupID !== '' ) {
          this.afDatabase.object( `/syncGroups/${this.mySyncGroupID}/gameResultOfPlayers`)
            .set( this.gameResultOfPlayers );
        }
        this.memo = '';
        this.startPlayerName = '';
        this.openSnackBar();
      }
    });
  }


  private openSnackBar() {
    this.snackBar.open( 'Successfully Submitted!', undefined, { duration: 3000 } );
  }


  uploadGameResultOfPlayer( playerIndex: number, property: string ) {
    console.log(playerIndex)
    if ( this.signedIn && this.mySyncGroupID !== '' ) {
      this.afDatabase.object( `/syncGroups/${this.mySyncGroupID}/gameResultOfPlayers/${playerIndex}/${property}`)
        .set( this.gameResultOfPlayers[ playerIndex ][ property ] );
    }
  }


}
