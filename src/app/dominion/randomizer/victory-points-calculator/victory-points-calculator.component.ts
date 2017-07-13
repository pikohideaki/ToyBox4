import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CardProperty } from "../../card-property";
import { SelectedCards } from "../../selected-cards";
import { DominionCardImageComponent } from "../../dominion-card-image/dominion-card-image.component";

import { VictoryPointsCalculatorService } from "../victory-points-calculator.service";
import { NumberOfVictoryCards } from "../number-of-victory-cards";


@Component({
  providers: [ VictoryPointsCalculatorService ],
  selector: 'app-victory-points-calculator',
  templateUrl: './victory-points-calculator.component.html',
  styleUrls: ['./victory-points-calculator.component.css']
})
export class VictoryPointsCalculatorComponent implements OnInit, OnChanges {

  @Input() CardPropertyList: CardProperty[];

  @Input() SelectedCards: SelectedCards;  // 存在するもののみ表示

  cardLongSideLength        : number =  70;
  cardLongSideLengthMin     : number =  70;
  cardLongSideLengthDefault : number = 180;
  cardLongSideLengthMax     : number = 280;

  numberOfVictoryCards : NumberOfVictoryCards = new NumberOfVictoryCards();

  VPtotal: number = 0;

  VictoryCards = [ 
    { id: 'Curse'           , maxNumber: 30, display: true, displayIf: 'always' },
    { id: 'Estate'          , maxNumber: 12, display: true, displayIf: 'always' },
    { id: 'Duchy'           , maxNumber: 12, display: true, displayIf: 'always' },
    { id: 'Province'        , maxNumber: 12, display: true, displayIf: 'always' },
    { id: 'Colony'          , maxNumber: 12, display: true, displayIf: 'Prosperity' },
    { id: 'Great_Hall'      , maxNumber: 12, display: true, displayIf: 'isInSupply' },
    { id: 'Nobles'          , maxNumber: 12, display: true, displayIf: 'isInSupply' },
    { id: 'Harem'           , maxNumber: 12, display: true, displayIf: 'isInSupply' },
    { id: 'Farmland'        , maxNumber: 12, display: true, displayIf: 'isInSupply' },
    { id: 'Island'          , maxNumber: 12, display: true, displayIf: 'isInSupply' },
    { id: 'Tunnel'          , maxNumber: 12, display: true, displayIf: 'isInSupply' },
    { id: 'Dame_Josephine'  , maxNumber:  1, display: true, displayIf: 'KnightsIsInSupply' },

    { id: 'Gardens'         , maxNumber: 12, display: true, displayIf: 'isInSupply' },
    { id: 'Duke'            , maxNumber: 12, display: true, displayIf: 'isInSupply' },
    { id: 'Vineyard'        , maxNumber: 12, display: true, displayIf: 'isInSupply' },
    { id: 'Fairgrounds'     , maxNumber: 12, display: true, displayIf: 'isInSupply' },
    { id: 'Silk_Road'       , maxNumber: 12, display: true, displayIf: 'isInSupply' },
    { id: 'Feodum'          , maxNumber: 12, display: true, displayIf: 'isInSupply' },
    { id: 'Distant_Lands'   , maxNumber: 12, display: true, displayIf: 'isInSupply' },

    { id: 'Humble_Castle'   , maxNumber:  2, display: true, displayIf: 'CastlesIsInSupply' },
    { id: 'Crumbling_Castle', maxNumber:  1, display: true, displayIf: 'CastlesIsInSupply' },
    { id: 'Small_Castle'    , maxNumber:  2, display: true, displayIf: 'CastlesIsInSupply' },
    { id: 'Haunted_Castle'  , maxNumber:  1, display: true, displayIf: 'CastlesIsInSupply' },
    { id: 'Opulent_Castle'  , maxNumber:  2, display: true, displayIf: 'CastlesIsInSupply' },
    { id: 'Sprawling_Castle', maxNumber:  1, display: true, displayIf: 'CastlesIsInSupply' },
    { id: 'Grand_Castle'    , maxNumber:  1, display: true, displayIf: 'CastlesIsInSupply' },
    { id: 'Kings_Castle'    , maxNumber:  2, display: true, displayIf: 'CastlesIsInSupply' },
  ];

  OtherVictoryPoints = [
    { id: 'VPtoken', maxNumber: 99999, title: '勝利点トークン' },
  ];

  OtherSettings = [
    { id: 'DeckSize'                     , maxNumber: 99999, display: true, displayIfExists: 'Gardens'    , title: '山札の枚数（庭園）' },
    { id: 'numberOfActionCards'          , maxNumber: 99999, display: true, displayIfExists: 'Vineyard'   , title: 'アクションカードの枚数（ブドウ園）' },
    { id: 'numberOfDifferentlyNamedCards', maxNumber: 99999, display: true, displayIfExists: 'Fairgrounds', title: '異なる名前のカード枚数（品評会）' },
    { id: 'numberOfSilvers'              , maxNumber:    40, display: true, displayIfExists: 'Feodum'     , title: '銀貨の枚数（封土）' },
    // { id: 'Distant_Lands_on_TavernMat'   , maxNumber:    12, title: 'on Tavern mat' },
  ]



  constructor(
    private calc: VictoryPointsCalculatorService
  ) { }

  ngOnInit() {
    this.cardLongSideLength = this.cardLongSideLengthDefault;
  }

  ngOnChanges( change: SimpleChanges ) {
    if ( change.SelectedCards != undefined ) {
      this.displayOnlyThoseInSelectedCards();
    }
  }


  displayOnlyThoseInSelectedCards() {
    const SelectedCards_all = this.SelectedCards.concatAll();
    const isInSupply
      = ( cardID => SelectedCards_all.findIndex( e => cardID == this.CardPropertyList[e].card_ID ) >= 0 );

    this.VictoryCards
      .filter( e => e.displayIf == 'isInSupply' )
      .forEach( e => e.display = isInSupply( e.id ) );

    this.VictoryCards
      .filter( e => e.displayIf == 'Prosperity' )
      .forEach( e => e.display = this.SelectedCards.Prosperity );

    this.VictoryCards
      .filter( e => e.displayIf == 'KnightsIsInSupply' )
      .forEach( e => e.display = isInSupply( 'Knights' ) );

    this.VictoryCards
      .filter( e => e.displayIf == 'CastlesIsInSupply' )
      .forEach( e => e.display = isInSupply( 'Castles' ) );

    this.OtherSettings
      .forEach( e => e.display = isInSupply( e.displayIfExists ) );
  }


  cardIndex( cardID ) {
    return this.CardPropertyList.findIndex( e => e.card_ID == cardID );
  }

  card( cardID ) {
    const index = this.cardIndex(cardID);
    if ( index < 0 ) return;
    return this.CardPropertyList[ index ];
  }


  resetCardLongSideLength() {
    this.cardLongSideLength = 180;
  }

  updateVPtotal() {
    this.VPtotal = this.calc.total( this.numberOfVictoryCards );
    // console.log(this.VPtotal)
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
    this.updateVPtotal();
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
    this.updateVPtotal();
  }

  setValue( VictoryCardID, event ) {
    this.numberOfVictoryCards[ VictoryCardID ] = event.target.valueAsNumber;
    this.updateVPtotal();
  }

  changeCardSize( event ) {
    this.cardLongSideLength = event.value;
  }


  resetNumbers() {
    Object.keys( this.numberOfVictoryCards )
      .forEach( key => this.numberOfVictoryCards[key] = 0 );
    this.VPtotal = this.calc.total( this.numberOfVictoryCards );
  }

}
