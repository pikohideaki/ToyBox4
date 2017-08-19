import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdDialog } from '@angular/material';

import { UtilitiesService } from '../../utilities.service';
import { DominionDatabaseService } from '../dominion-database.service';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';
import { DataTableComponent } from '../../data-table/data-table.component';
import { CardProperty } from '../card-property';
import { SelectedCards } from '../selected-cards';
import { SelectedCardsCheckboxValues } from '../selected-cards-checkbox-values';
import { CardPropertyDialogComponent } from '../card-property-dialog/card-property-dialog.component';


@Component({
  selector: 'app-randomizer',
  templateUrl: './randomizer.component.html',
  styleUrls: [
    '../../data-table/data-table.component.css',
    './randomizer.component.css'
  ]
})
export class RandomizerComponent implements OnInit, OnDestroy {
  private alive = true;
  receiveDataDone = false;

  DominionSetNameList;
  cardPropertyList;

  @Input() forViewing: boolean = false;
  @Input() showSelectedCardsCheckbox: boolean = false;
  @Input() implementedOnly: boolean = false;

  @Input()  randomizerButtonLocked: boolean;
  @Output() randomizerButtonLockedChange = new EventEmitter<boolean>();

  @Input()  selectedCards: SelectedCards;
  @Output() selectedCardsChange = new EventEmitter<SelectedCards>();

  @Input()  DominionSetToggleValues: boolean[] = [];
  @Output() DominionSetToggleValueIndexValuePairEmitter
    = new EventEmitter<{ index: number, checked: boolean }>();

  @Input()  selectedCardsCheckboxValues: SelectedCardsCheckboxValues
    = new SelectedCardsCheckboxValues();
  @Output() selectedCardsCheckboxValueIndexValuePairEmitter
    = new EventEmitter<{ index: number, category: string, checked: boolean }>();
  @Output() selectedCardsCheckboxValuesOnReset = new EventEmitter<void>();

  @Input()  BlackMarketPileShuffled: { cardIndex: number, faceUp: boolean }[] = [];
  @Output() BlackMarketPileShuffledChange
    = new EventEmitter<{ cardIndex: number, faceUp: boolean }[]>();

  constructor(
    private utils: UtilitiesService,
    public dialog: MdDialog,
    private database: DominionDatabaseService,
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
        this.receiveDataDone = true;
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }


  cardInfoButtonClicked( cardIndex: number ) {
    // const selectedCardForView = this.cardPropertyList[cardIndex].transform();
    const dialogRef = this.dialog.open( CardPropertyDialogComponent );
    // dialogRef.componentInstance.card = selectedCardForView;
    dialogRef.componentInstance.card = this.cardPropertyList[cardIndex];
  }

  toggleDominionSetList( checked: boolean, index: number ) {
    this.DominionSetToggleValues[ index ] = checked;
    this.DominionSetToggleValueIndexValuePairEmitter.emit({ checked: checked, index: index });
  }

  toggleRandomizerButton( lock: boolean ) {
    this.randomizerButtonLocked = lock;
    this.randomizerButtonLockedChange.emit( lock );
  }

  selectedCardsCheckboxOnChange( category, index: number ) {
    const checked = this.selectedCardsCheckboxValues[category][index];
    this.selectedCardsCheckboxValueIndexValuePairEmitter
      .emit({ checked: checked, category: category, index: index });
  }

  DominionSetToggleIsEmpty(): boolean {
    return this.DominionSetToggleValues.every( selected => !selected );
  }


  randomizerClicked() {
    if ( this.DominionSetToggleIsEmpty() ) return;

    this.toggleRandomizerButton(true);

    const result = this.randomizer();
    if ( !result.valid ) {
      const dialogRef = this.dialog.open( AlertDialogComponent );
      dialogRef.componentInstance.message = `サプライが足りません．セットの選択数を増やしてください．`;
      return;
    }

    this.selectedCards = new SelectedCards( result.selectedCards );
    this.selectedCardsChange.emit( this.selectedCards );

    this.selectedCardsCheckboxValues.clear();
    this.selectedCardsCheckboxValuesOnReset.emit();

    const BlackMarketPileShuffled
      = this.utils.getShuffled( this.selectedCards.BlackMarketPile )
                  .map( e => ({ cardIndex: e, faceUp: false }) );
    this.BlackMarketPileShuffledChange.emit( BlackMarketPileShuffled );
  }


  private randomizer() {
    const selectedCardsTemp = new SelectedCards();

    // 選択されている拡張セットに含まれているカードすべてをシャッフルし，indexとペアにしたリスト
    const CardsInSelectedSets_Shuffled: { index: number, data: CardProperty }[]
     = this.utils.getShuffled(
        this.cardPropertyList
          .map( (val: CardProperty, index) => ({ index: index, data: val }) )
          .filter( e => e.data.randomizerCandidate )
          .filter( e => !this.implementedOnly || e.data.implemented )
          .filter( e => this.DominionSetNameList
                        .filter( (name, index) => this.DominionSetToggleValues[index] )
                        .findIndex( val => val === e.data.DominionSetName ) >= 0 )
      );

    // 10 Supply KingdomCards10 and Event, LandmarkCards
    while ( selectedCardsTemp.KingdomCards10.length < 10 ) {
      const card = CardsInSelectedSets_Shuffled.pop();
      if ( !card ) return { valid: false, selectedCards: selectedCardsTemp };
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
      if ( CardsInSelectedSets_Shuffled.length <= 0 ) {
        return { valid: false, selectedCards: selectedCardsTemp };
      }
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
        if ( !card ) return { valid: false, selectedCards: selectedCardsTemp }
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

    return { valid: true, selectedCards: selectedCardsTemp };
  }

}
