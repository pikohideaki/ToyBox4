import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdDialog } from '@angular/material';

import { UtilitiesService               } from '../../my-library/utilities.service';
import { FireDatabaseMediatorService    } from '../../fire-database-mediator.service';
import { MyRandomizerGroupService       } from './my-randomizer-group.service';

import { SelectedCards         } from '../../classes/selected-cards';
import { SelectedCardsCheckbox } from '../../classes/selected-cards-checkbox-values';
import { BlackMarketPileCard   } from '../../classes/black-market-pile-card';

import { CardPropertyDialogComponent } from '../pure-components/card-property-dialog/card-property-dialog.component';


@Component({
  selector: 'app-randomizer-select-cards',
  template: `
    <app-randomizer
      [(randomizerButtonLocked)]="randomizerButtonLocked"
      (randomizerButtonLockedChange)="randomizerButtonLockedOnChange( $event )"
      [isSelectedExpansions]="isSelectedExpansions"
      (isSelectedExpansionsPartEmitter)="isSelectedExpansionsOnChange( $event )"
      [selectedCards]="selectedCards"
      (selectedCardsChange)="selectedCardsOnChange( $event )"
      (BlackMarketPileShuffledChange)="BlackMarketPileShuffledOnChange( $event )"
      showSelectedCardsCheckbox="true"
      [selectedCardsCheckbox]="selectedCardsCheckbox"
      (selectedCardsCheckboxPartEmitter)="selectedCardsCheckboxOnChange( $event )"
      (selectedCardsCheckboxOnReset)="selectedCardsCheckboxOnReset()" >
    </app-randomizer>
  `,
  styleUrls: [ '../../my-library/data-table/data-table.component.css' ]
})
export class RandomizerSelectCardsComponent implements OnInit, OnDestroy {
  private alive = true;
  randomizerButtonLocked = false;
  isSelectedExpansions: boolean[] = [];
  selectedCards: SelectedCards = new SelectedCards();
  selectedCardsCheckbox = new SelectedCardsCheckbox();


  constructor(
    private utils: UtilitiesService,
    public dialog: MdDialog,
    private database: FireDatabaseMediatorService,
    private myRandomizerGroup: MyRandomizerGroupService,
  ) {
    this.myRandomizerGroup.randomizerButtonLocked$
      .takeWhile( () => this.alive )
      .subscribe( val => this.randomizerButtonLocked = val );

    this.myRandomizerGroup.isSelectedExpansions$
      .takeWhile( () => this.alive )
      .subscribe( val => this.isSelectedExpansions = val );

    this.myRandomizerGroup.selectedCards$
      .takeWhile( () => this.alive )
      .subscribe( val => this.selectedCards = val );

    this.myRandomizerGroup.selectedCardsCheckbox$
      .takeWhile( () => this.alive )
      .subscribe( val => this.selectedCardsCheckbox = val );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }



  randomizerButtonLockedOnChange( lock: boolean ) {
    this.myRandomizerGroup.setRandomizerButtonLocked( lock );
  }

  isSelectedExpansionsOnChange( value: { index: number, checked: boolean } ) {
    this.myRandomizerGroup.setIsSelectedExpansions( value.index, value.checked );
  }

  selectedCardsOnChange( selectedCards: SelectedCards ) {
    this.selectedCards = new SelectedCards( selectedCards );
    this.myRandomizerGroup.setSelectedCards( this.selectedCards );
    this.myRandomizerGroup.addToSelectedCardsHistory( this.selectedCards );
  }

  BlackMarketPileShuffledOnChange( value: BlackMarketPileCard[] ) {
    this.myRandomizerGroup.setBlackMarketPileShuffled( value );
    this.myRandomizerGroup.setBlackMarketPhase(1);
  }

  selectedCardsCheckboxOnChange( value: { category: string, index: number, checked: boolean } ) {
    return this.myRandomizerGroup.setSelectedCardsCheckbox( value.category, value.index, value.checked );
  }

  selectedCardsCheckboxOnReset() {
    return this.myRandomizerGroup.resetSelectedCardsCheckbox();
  }

}
