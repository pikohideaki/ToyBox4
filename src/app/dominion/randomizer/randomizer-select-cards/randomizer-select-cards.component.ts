import { Component, OnInit, OnDestroy, Input } from '@angular/core';

// import { Observable } from 'rxjs/Observable';
// import 'rxjs/rx';
import { Observable } from 'rxjs/Rx';

import { MdDialog } from '@angular/material';

import { MyUtilitiesService } from '../../../my-utilities.service';
import { DominionDatabaseService } from '../../dominion-database.service';

import { MySyncGroupService } from '../my-sync-group.service';
import { SelectedDominionSetService } from '../selected-dominion-set.service';
import { SelectedCardsService } from '../selected-cards.service';
import { BlackMarketPileShuffledService } from '../black-market-pile-shuffled.service';

import { AlertDialogComponent } from '../../../alert-dialog/alert-dialog.component';

import { MyDataTableComponent } from '../../../my-data-table/my-data-table.component';
import { CardProperty } from '../../card-property';
import { SelectedCards } from '../../selected-cards';
import { SelectedCardsCheckboxValues } from '../../selected-cards-checkbox-values';
import { SyncGroup } from '../sync-group';
import { UserInfo } from '../../../user-info';

import { CardPropertyDialogComponent } from '../../card-property-dialog/card-property-dialog.component';


@Component({
  selector: 'app-randomizer-select-cards',
  templateUrl: './randomizer-select-cards.component.html',
  styleUrls: [
    '../../../my-data-table/my-data-table.component.css',
    './randomizer-select-cards.component.css'
  ]
})
export class RandomizerSelectCardsComponent implements OnInit, OnDestroy {
  private alive = true;
  getDataDone = false;

  @Input() showCheckbox: boolean = true;

  cardPropertyList: CardProperty[] = [];

  DominionSetNameList: string[] = [];
  DominionSetToggleValues: boolean[] = [];

  selectedCards: SelectedCards = new SelectedCards();
  selectedCardsCheckboxValues = new SelectedCardsCheckboxValues();

  randomizerButtonLocked = false;

  constructor(
    private utils: MyUtilitiesService,
    public dialog: MdDialog,
    private database: DominionDatabaseService,
    private mySyncGroup: MySyncGroupService,
    private selectedDominionSetService: SelectedDominionSetService,
    private selectedCardsService: SelectedCardsService,
    private BlackMarketService: BlackMarketPileShuffledService
  ) {
    Observable.combineLatest(
        this.database.cardPropertyList$,
        this.database.DominionSetNameList$,
        (cardPropertyList, DominionSetNameList) => ({
          cardPropertyList    : cardPropertyList,
          DominionSetNameList : DominionSetNameList
        }) )
      .takeWhile( () => this.alive )
      .subscribe( val => {
        this.cardPropertyList    = val.cardPropertyList;
        this.DominionSetNameList = val.DominionSetNameList;
        this.getDataDone = true;
      });

    this.mySyncGroup.randomizerButtonLocked$()
      .takeWhile( () => this.alive )
      .subscribe( val => this.randomizerButtonLocked = val );

    this.selectedCardsService.selectedCards$
      .takeWhile( () => this.alive )
      .subscribe( val => this.selectedCards = val );

    this.selectedDominionSetService.selectedDominionSetMerged$
      .takeWhile( () => this.alive )
      .subscribe( val => this.DominionSetToggleValues[ val.index ] = val.checked );

    Object.keys( this.selectedCardsCheckboxValues ).forEach( arrayName => {
      this.selectedCardsCheckboxValues[arrayName].forEach( (_, idx) => {
        this.mySyncGroup.selectedCardsCheckboxValues$( arrayName, idx )
          .takeWhile( () => this.alive )
          .subscribe( val => this.selectedCardsCheckboxValues[arrayName][idx] = val )
      } )
    })
  }

  ngOnInit() {
  }


  ngOnDestroy() {
    this.alive = false;
  }



  toggleRandomizerButton( lock: boolean ) {
    this.randomizerButtonLocked = lock;
    this.mySyncGroup.setRandomizerButtonLocked( lock );
  }

  randomizerClicked() {
    if ( this.DominionSetToggleValues.every( selected => !selected ) ) return;

    this.toggleRandomizerButton(true);

    const [valid, result] = this.randomizer();
    if ( !valid ) {
      // alert
      const dialogRef = this.dialog.open( AlertDialogComponent );
      dialogRef.componentInstance.message
        = `サプライが足りません．セットの選択数を増やしてください．`;
      return;
    }

    this.selectedCards.set( result );
    this.selectedCardsService.changeSelectedCards( this.selectedCards );
    this.mySyncGroup.addToSelectedCardsHistory( this.selectedCards );

    this.selectedCardsCheckboxValues.clear();
    this.mySyncGroup.setSelectedCardsCheckboxValuesAll( this.selectedCardsCheckboxValues );

    const BlackMarketPileShuffled
      = this.utils.shuffle( this.selectedCards.BlackMarketPile )
                  .map( e => ({ cardIndex: e, faceUp: false }) );
    this.BlackMarketService.changeBlackMarketPileShuffled( BlackMarketPileShuffled )
    this.mySyncGroup.setBlackMarketOperationPhase(1);
  }


  toggleDominionSetList( checked: boolean, index: number ) {
    this.selectedDominionSetService.changeSelectedDominionSet( checked, index );
  }


  cardInfoButtonClicked( cardIndex ) {
    const selectedCardForView = this.cardPropertyList[cardIndex].transform();
    const dialogRef = this.dialog.open( CardPropertyDialogComponent );
    dialogRef.componentInstance.card = selectedCardForView;
  }

  selectedCardsCheckboxOnChange( category, index ) {
    const checked = this.selectedCardsCheckboxValues[category][index];
    return this.mySyncGroup.setSelectedCardsCheckboxValues( checked, category, index );
  }

  ProsperityChecked( checked: boolean ) {
    this.selectedCards.Prosperity = checked;
    this.selectedCardsService.changeSelectedCards( this.selectedCards );
  }

  DarkAgesChecked( checked: boolean ) {
    this.selectedCards.DarkAges = checked;
    this.selectedCardsService.changeSelectedCards( this.selectedCards );
  }




  private randomizer() {
    // this.selectedCards.reset();  // reset
    const selectedCardsTemp = new SelectedCards();

    // 選択されている拡張セットに含まれているカードすべてをシャッフルし，indexとペアにしたリスト
    const CardsInSelectedSets_Shuffled: { index: number, data: CardProperty }[]
     = this.utils.shuffle(
        this.cardPropertyList
          .map( (val, index) => ({ index: index, data: val }) )
          .filter ( e => e.data.randomizerCandidate )
          .filter( e => this.DominionSetNameList
                        .filter( (name, index) => this.DominionSetToggleValues[index] )
                        .findIndex( val => val === e.data.DominionSetName ) >= 0 )
      );

    // 10 Supply KingdomCards10 and Event, LandmarkCards
    while ( selectedCardsTemp.KingdomCards10.length < 10 ) {
      const card = CardsInSelectedSets_Shuffled.pop();
      if ( !card ) return [false, selectedCardsTemp];
      if ( card.data.category === '王国' ) {
        selectedCardsTemp.KingdomCards10.push( card.index );
      }
      if ( (selectedCardsTemp.EventCards.length + selectedCardsTemp.LandmarkCards.length ) < 2 ) {
        if ( card.data.cardType === 'イベント' ) {
          selectedCardsTemp.EventCards.push( card.index );
        }
        if ( card.data.cardType === 'ランドマーク' ) {
          selectedCardsTemp.LandmarkCards.push( card.index );
        }
      }
    }


    // 繁栄場・避難所場の決定
    selectedCardsTemp.Prosperity = ( this.cardPropertyList[ selectedCardsTemp.KingdomCards10[0] ].DominionSetName === '繁栄' );
    selectedCardsTemp.DarkAges   = ( this.cardPropertyList[ selectedCardsTemp.KingdomCards10[9] ].DominionSetName === '暗黒時代' );


    // 災いカード（収穫祭：魔女娘）
    if ( selectedCardsTemp.KingdomCards10
        .findIndex( e => this.cardPropertyList[e].name_jp === '魔女娘' ) >= 0 ) {
      if ( CardsInSelectedSets_Shuffled.length <= 0 ) return [false, selectedCardsTemp];
      const cardIndex = this.utils.removeIf( CardsInSelectedSets_Shuffled, e => (
               e.data.cost.debt   === 0
            && e.data.cost.potion === 0
            && e.data.cost.coin   >=  2
            && e.data.cost.coin   <=  3 ) ).index;
      selectedCardsTemp.BaneCard = [cardIndex];
    }

    // Black Market (one copy of each Kingdom card not in the supply. 15種類選択を推奨)
    if ( [].concat( selectedCardsTemp.KingdomCards10, selectedCardsTemp.BaneCard )
           .findIndex( e => this.cardPropertyList[e].name_jp === '闇市場' ) >= 0 ) {
      while ( selectedCardsTemp.BlackMarketPile.length < 15 ) {
        const card = CardsInSelectedSets_Shuffled.pop();
        if ( !card ) return [false, selectedCardsTemp];
        if ( card.data.category === '王国' ) {
          selectedCardsTemp.BlackMarketPile.push( card.index );
        }
      }
    }

    // Obelisk (Choose 1 Action Supply Pile)
    if ( selectedCardsTemp.LandmarkCards
        .findIndex( e => this.cardPropertyList[e].name_eng === 'Obelisk' ) >= 0 ) {
      const cardIndex: number = ( () => {
        const supplyUsed: number[] = [].concat( selectedCardsTemp.KingdomCards10, selectedCardsTemp.BaneCard );
        const ObeliskCandidatesActionCards: number[] = this.utils.copy( supplyUsed );
        if ( supplyUsed.findIndex( e => this.cardPropertyList[e].cardType.includes('略奪者') ) >= 0 ) {
          const ruinsIndex: number = this.cardPropertyList.findIndex( e => e.name_jp === '廃墟' );
          ObeliskCandidatesActionCards.unshift( ruinsIndex );
        }
        return this.utils.getRandomValue( supplyUsed );
      } )();
      selectedCardsTemp.Obelisk = [cardIndex];
    }

    selectedCardsTemp.KingdomCards10 .sort( (a, b) => a - b );   // 繁栄場・避難所場の決定後にソート
    selectedCardsTemp.EventCards     .sort( (a, b) => a - b );
    selectedCardsTemp.LandmarkCards  .sort( (a, b) => a - b );
    selectedCardsTemp.BlackMarketPile.sort( (a, b) => a - b );

    return [true, selectedCardsTemp];
  }

}
