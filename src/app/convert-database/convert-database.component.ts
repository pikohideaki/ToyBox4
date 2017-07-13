import { Component, OnInit } from '@angular/core';

import { MdDialog, MdSnackBar } from '@angular/material';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MyFirebaseSubscribeService } from "../dominion/my-firebase-subscribe.service";
import { MyUtilitiesService } from '../my-utilities.service';

import { GameResult } from "../dominion/game-result";

import { NumberOfVictoryCards } from "../dominion/randomizer/number-of-victory-cards";

@Component({
  providers: [MyUtilitiesService, MyFirebaseSubscribeService],

  selector: 'app-convert-database',
  templateUrl: './convert-database.component.html',
  styleUrls: ['./convert-database.component.css']
})
export class ConvertDatabaseComponent implements OnInit {

  // GameResultList: GameResult[] = [];

  cardLongSideLength        : number =  70;
  cardLongSideLengthMin     : number =  70;
  cardLongSideLengthDefault : number = 180;
  cardLongSideLengthMax     : number = 280;

  numberOfVictoryCards: NumberOfVictoryCards = new NumberOfVictoryCards();

  VPtotal: number = 0;

  VictoryCards = [ 
    { id: 'Curse'           , maxNumber: 30, display: true },
    { id: 'Estate'          , maxNumber: 12, display: true },
    { id: 'Duchy'           , maxNumber: 12, display: true },
    { id: 'Province'        , maxNumber: 12, display: true },
    { id: 'Colony'          , maxNumber: 12, display: true },
    { id: 'Great_Hall'      , maxNumber: 12, display: true },
    { id: 'Nobles'          , maxNumber: 12, display: true },
    { id: 'Harem'           , maxNumber: 12, display: true },
    { id: 'Farmland'        , maxNumber: 12, display: true },
    { id: 'Island'          , maxNumber: 12, display: true },
    { id: 'Tunnel'          , maxNumber: 12, display: true },
    { id: 'Dame_Josephine'  , maxNumber:  1, display: true },

    { id: 'Gardens'         , maxNumber: 12, display: true },
    { id: 'Duke'            , maxNumber: 12, display: true },
    { id: 'Vineyard'        , maxNumber: 12, display: true },
    { id: 'Fairgrounds'     , maxNumber: 12, display: true },
    { id: 'Silk_Road'       , maxNumber: 12, display: true },
    { id: 'Feodum'          , maxNumber: 12, display: true },
    { id: 'Distant_Lands'   , maxNumber: 12, display: true },

    { id: 'Humble_Castle'   , maxNumber:  2, display: true },
    { id: 'Crumbling_Castle', maxNumber:  1, display: true },
    { id: 'Small_Castle'    , maxNumber:  2, display: true },
    { id: 'Haunted_Castle'  , maxNumber:  1, display: true },
    { id: 'Opulent_Castle'  , maxNumber:  2, display: true },
    { id: 'Sprawling_Castle', maxNumber:  1, display: true },
    { id: 'Grand_Castle'    , maxNumber:  1, display: true },
    { id: 'Kings_Castle'    , maxNumber:  2, display: true },
  ];

  OtherVictoryPoints = [
    { id: 'VPtoken', maxNumber: 99999, title: '勝利点トークン' },
  ];

  OtherSettings = [
    { id: 'DeckSize'                     , maxNumber: 99999, display: true, title: '山札の枚数（庭園）' },
    { id: 'numberOfActionCards'          , maxNumber: 99999, display: true, title: 'アクションカードの枚数（ブドウ園）' },
    { id: 'numberOfDifferentlyNamedCards', maxNumber: 99999, display: true, title: '異なる名前のカード枚数（品評会）' },
    { id: 'numberOfSilvers'              , maxNumber:    40, display: true, title: '銀貨の枚数（封土）' },
    // { id: 'Distant_Lands_on_TavernMat'   , maxNumber:    12, title: 'on Tavern mat' },
  ]


  constructor(
    private utils: MyUtilitiesService,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService
  ) {

  }


  ngOnInit() {
  }

  decrement( VictoryCardID, by: number = 1 ) {
    if ( this.numberOfVictoryCards[ VictoryCardID ] <= 0 ) return;
    this.numberOfVictoryCards[ VictoryCardID ] -= by;

    this.numberOfVictoryCards[ VictoryCardID ]
     = Math.max( 0, this.numberOfVictoryCards[ VictoryCardID ] );

    if ( VictoryCardID === 'Distant_Lands' ) {
      this.numberOfVictoryCards.Distant_Lands_on_TavernMat
        = Math.min( this.numberOfVictoryCards.Distant_Lands,
                    this.numberOfVictoryCards.Distant_Lands_on_TavernMat );
    }
  }

  increment( VictoryCardID, by: number = 1 ) {
    this.numberOfVictoryCards[ VictoryCardID ] += by;

    let VictoryCardID__ = ( VictoryCardID == 'Distant_Lands_on_TavernMat' ? 'Distant_Lands' : VictoryCardID );
    const max = [].concat( this.VictoryCards,
                           this.OtherVictoryPoints,
                           this.OtherSettings )
                  .find( e => e.id == VictoryCardID__ ).maxNumber;
    this.numberOfVictoryCards[ VictoryCardID ]
     = Math.min( max, this.numberOfVictoryCards[ VictoryCardID ] );

    if ( VictoryCardID === 'Distant_Lands_on_TavernMat' ) {
      this.numberOfVictoryCards.Distant_Lands
        = Math.max( this.numberOfVictoryCards.Distant_Lands,
                    this.numberOfVictoryCards.Distant_Lands_on_TavernMat );
    }
  }

  setValue( VictoryCardID, event ) {
    this.numberOfVictoryCards[ VictoryCardID ] = event.target.valueAsNumber;
  }


  changeCardSize( event ) {
    this.cardLongSideLength = event.value;
  }

}
