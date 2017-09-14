import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FireDatabaseMediatorService    } from '../../fire-database-mediator.service';
import { VictoryPointsCalculatorService } from './victory-points-calculator.service';

import { CardProperty         } from '../../classes/card-property';
import { SelectedCards        } from '../../classes/selected-cards';
import { NumberOfVictoryCards } from '../../classes/number-of-victory-cards';


@Component({
  providers: [ VictoryPointsCalculatorService ],
  selector: 'app-victory-points-calculator',
  templateUrl: './victory-points-calculator.component.html',
  styleUrls: ['./victory-points-calculator.component.css']
})
export class VictoryPointsCalculatorComponent implements OnInit, OnDestroy {
  private alive: boolean = true;
  receiveDataDone: boolean = false;

  @Input() private selectedCards$: Observable<SelectedCards>;  // 存在するもののみ表示
  @Input() private resetVPCalculator$: Observable<number>;

  VPtotal = 0;
  @Output() VPtotalChange = new EventEmitter<number>();


  cardLongSideLength = 180;

  numberOfVictoryCards: NumberOfVictoryCards = new NumberOfVictoryCards();

  VictoryCards = [
    { id: 'Curse'           , maxNumber: 30, display: true, displayWhen: 'always' },
    { id: 'Estate'          , maxNumber: 12, display: true, displayWhen: 'always' },
    { id: 'Duchy'           , maxNumber: 12, display: true, displayWhen: 'always' },
    { id: 'Province'        , maxNumber: 12, display: true, displayWhen: 'always' },
    { id: 'Colony'          , maxNumber: 12, display: true, displayWhen: 'Prosperity' },
    { id: 'Great_Hall'      , maxNumber: 12, display: true, displayWhen: 'isInSupply' },
    { id: 'Nobles'          , maxNumber: 12, display: true, displayWhen: 'isInSupply' },
    { id: 'Harem'           , maxNumber: 12, display: true, displayWhen: 'isInSupply' },
    { id: 'Farmland'        , maxNumber: 12, display: true, displayWhen: 'isInSupply' },
    { id: 'Island'          , maxNumber: 12, display: true, displayWhen: 'isInSupply' },
    { id: 'Tunnel'          , maxNumber: 12, display: true, displayWhen: 'isInSupply' },
    { id: 'Dame_Josephine'  , maxNumber:  1, display: true, displayWhen: 'KnightsIsInSupply' },
    { id: 'Overgrown_Estate', maxNumber:  1, display: true, displayWhen: 'DarkAges' },

    { id: 'Gardens'         , maxNumber: 12, display: true, displayWhen: 'isInSupply' },
    { id: 'Duke'            , maxNumber: 12, display: true, displayWhen: 'isInSupply' },
    { id: 'Vineyard'        , maxNumber: 12, display: true, displayWhen: 'isInSupply' },
    { id: 'Fairgrounds'     , maxNumber: 12, display: true, displayWhen: 'isInSupply' },
    { id: 'Silk_Road'       , maxNumber: 12, display: true, displayWhen: 'isInSupply' },
    { id: 'Feodum'          , maxNumber: 12, display: true, displayWhen: 'isInSupply' },
    { id: 'Distant_Lands'   , maxNumber: 12, display: true, displayWhen: 'isInSupply' },

    { id: 'Humble_Castle'   , maxNumber:  2, display: true, displayWhen: 'CastlesIsInSupply' },
    { id: 'Crumbling_Castle', maxNumber:  1, display: true, displayWhen: 'CastlesIsInSupply' },
    { id: 'Small_Castle'    , maxNumber:  2, display: true, displayWhen: 'CastlesIsInSupply' },
    { id: 'Haunted_Castle'  , maxNumber:  1, display: true, displayWhen: 'CastlesIsInSupply' },
    { id: 'Opulent_Castle'  , maxNumber:  2, display: true, displayWhen: 'CastlesIsInSupply' },
    { id: 'Sprawling_Castle', maxNumber:  1, display: true, displayWhen: 'CastlesIsInSupply' },
    { id: 'Grand_Castle'    , maxNumber:  1, display: true, displayWhen: 'CastlesIsInSupply' },
    { id: 'Kings_Castle'    , maxNumber:  2, display: true, displayWhen: 'CastlesIsInSupply' },
  ];

  OtherVictoryPoints = [
    { id: 'VPtoken'         , maxNumber: 99999, title: '勝利点トークン' },
    { id: 'others'          , maxNumber: 99999, title: 'その他' },
    { id: 'othersMinus'     , maxNumber: 99999, title: 'その他（マイナス得点）' },
  ];

  OtherSettings = [
    { id: 'DeckSize'                     , maxNumber: 99999, display: true, displayIfExists: 'Gardens'    , title: '山札の枚数（庭園）' },
    { id: 'numberOfActionCards'          , maxNumber: 99999, display: true, displayIfExists: 'Vineyard'   , title: 'アクションカードの枚数（ブドウ園）' },
    { id: 'numberOfDifferentlyNamedCards', maxNumber: 99999, display: true, displayIfExists: 'Fairgrounds', title: '異なる名前のカード枚数（品評会）' },
    { id: 'numberOfSilvers'              , maxNumber:    40, display: true, displayIfExists: 'Feodum'     , title: '銀貨の枚数（封土）' },
  ]


  private cardPropertyList: CardProperty[] = [];
  private selectedCards: SelectedCards;


  constructor(
    private database: FireDatabaseMediatorService,
    private calc: VictoryPointsCalculatorService,
  ) {
    this.database.cardPropertyList$
      .takeWhile( () => this.alive )
      .subscribe( val => {
        this.cardPropertyList = val;
        this.receiveDataDone = true;
      });
  }

  ngOnInit() {
    this.selectedCards$
      .takeWhile( () => this.alive )
      .subscribe( val => {
        this.selectedCards = val;
        this.displayOnlyThoseInSelectedCards();
      });


    this.resetVPCalculator$
      .takeWhile( () => this.alive )
      .subscribe( () => this.resetNumbers() );

    this.resetNumbers();
  }

  ngOnDestroy() {
    this.alive = false;
  }



  private updateVPtotal() {
    this.VPtotal = this.calc.total( this.numberOfVictoryCards );
    this.VPtotalChange.emit( this.VPtotal );
  }

  private displayOnlyThoseInSelectedCards() {
    const selectedCardsAll = this.selectedCards.concatAll();
    const isInSupply = cardID =>
      selectedCardsAll.map( e => this.cardPropertyList[e].cardID ).includes( cardID );

    this.VictoryCards.forEach( e => { switch ( e.displayWhen ) {
      case 'always'            : e.display = true;  break;
      case 'isInSupply'        : e.display = isInSupply( e.id );  break;
      case 'Prosperity'        : e.display = this.selectedCards.Prosperity;  break;
      case 'DarkAges'          : e.display = this.selectedCards.DarkAges;  break;
      case 'KnightsIsInSupply' : e.display = isInSupply( 'Knights' );  break;
      case 'CastlesIsInSupply' : e.display = isInSupply( 'Castles' );  break;
      default                  : e.display = true;  break;
    } });

    this.OtherSettings.forEach( e => e.display = isInSupply( e.displayIfExists ) );
  }



  private cardIndex( cardID ) {
    return this.cardPropertyList.findIndex( e => e.cardID === cardID );
  }

  card( cardID ) {
    const index = this.cardIndex( cardID );
    if ( index < 0 ) return;
    return this.cardPropertyList[ index ];
  }


  VPperCard( cardID: string ) {
    return this.calc.VPperCard( cardID, this.numberOfVictoryCards );
  }


  decrement( VictoryCardID: string, by: number = 1 ) {
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

  increment( VictoryCardID: string, by: number = 1 ) {
    this.numberOfVictoryCards[ VictoryCardID ] += by;

    const VictoryCardID__ = ( VictoryCardID === 'Distant_Lands_on_TavernMat' ? 'Distant_Lands' : VictoryCardID );
    const max = [].concat( this.VictoryCards,
                           this.OtherVictoryPoints,
                           this.OtherSettings )
                  .find( e => e.id === VictoryCardID__ ).maxNumber;
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

  resetNumbers() {
    Object.keys( this.numberOfVictoryCards )
      .forEach( key => this.numberOfVictoryCards[key] = 0 );
    this.updateVPtotal();
  }

}
