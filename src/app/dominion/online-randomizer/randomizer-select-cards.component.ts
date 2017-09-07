import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdDialog } from '@angular/material';

import { UtilitiesService               } from '../../my-library/utilities.service';
import { FireDatabaseMediatorService    } from '../../fire-database-mediator.service';
import { MyRandomizerGroupService       } from './my-randomizer-group.service';
import { SelectedDominionSetService     } from './selected-dominion-set.service';
import { SelectedCardsService           } from './selected-cards.service';
import { BlackMarketPileShuffledService } from './black-market-pile-shuffled.service';

import { SelectedCards               } from '../../classes/selected-cards';
import { selectedCardsCheckbox } from '../../classes/selected-cards-checkbox-values';

import { CardPropertyDialogComponent } from '../pure-components/card-property-dialog/card-property-dialog.component';


@Component({
  selector: 'app-randomizer-select-cards',
  template: `
    <app-randomizer
      [(randomizerButtonLocked)]="randomizerButtonLocked"
      (randomizerButtonLockedChange)="randomizerButtonLockedOnChange( $event )"
      [selectedCards]="selectedCards"
      (selectedCardsChange)="selectedCardsOnChange( $event )"
      (BlackMarketPileShuffledChange)="BlackMarketPileShuffledOnChange( $event )"
      [DominionSetToggleValues]="DominionSetToggleValues"
      (DominionSetToggleIndexValuePairEmitter)="DominionSetToggleValuesOnChange( $event )"
      showSelectedCardsCheckbox="true"
      [selectedCardsCheckbox]="selectedCardsCheckbox"
      (selectedCardsCheckboxIndexValuePairEmitter)="selectedCardsCheckboxOnChange( $event )"
      (selectedCardsCheckboxOnReset)="selectedCardsCheckboxOnReset()" >
    </app-randomizer>
  `,
  styleUrls: [ '../../my-library/data-table/data-table.component.css' ]
})
export class RandomizerSelectCardsComponent implements OnInit, OnDestroy {
  private alive = true;
  receiveDataDone = false;
  DominionSetToggleValues: boolean[] = [];
  selectedCards: SelectedCards = new SelectedCards();
  selectedCardsCheckbox = new selectedCardsCheckbox();
  randomizerButtonLocked = false;


  constructor(
    private utils: UtilitiesService,
    public dialog: MdDialog,
    private database: FireDatabaseMediatorService,
    private myRandomizerGroup: MyRandomizerGroupService,
    private selectedDominionSetService: SelectedDominionSetService,
    private selectedCardsService: SelectedCardsService,
    private BlackMarketService: BlackMarketPileShuffledService
  ) {
    this.myRandomizerGroup.myRandomizerGroup$.map( e => e.randomizerButtonLocked )
      .takeWhile( () => this.alive )
      .subscribe( val => this.randomizerButtonLocked = val );

    this.selectedCardsService.selectedCards$
      .takeWhile( () => this.alive )
      .subscribe( val => this.selectedCards = val );

    this.selectedDominionSetService.selectedDominionSetMerged$
      .takeWhile( () => this.alive )
      .subscribe( val => this.DominionSetToggleValues[ val.index ] = val.checked );

    Object.keys( this.selectedCardsCheckbox ).forEach( arrayName => {
      this.selectedCardsCheckbox[arrayName].forEach( (_, idx) => {
        this.myRandomizerGroup.myRandomizerGroup$.map( e => e.selectedCardsCheckbox[arrayName][idx] )
          .takeWhile( () => this.alive )
          .subscribe( val => this.selectedCardsCheckbox[arrayName][idx] = val )
      } )
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }



  randomizerButtonLockedOnChange( lock: boolean ) {
    this.myRandomizerGroup.setRandomizerButtonLocked( lock );
  }

  selectedCardsOnChange( selectedCards: SelectedCards ) {
    this.selectedCards = new SelectedCards( selectedCards );
    this.selectedCardsService.changeSelectedCards( this.selectedCards );
    this.myRandomizerGroup.addToSelectedCardsHistory( this.selectedCards );
  }

  BlackMarketPileShuffledOnChange( value ) {
    this.BlackMarketService.changeBlackMarketPileShuffled( value );
    this.myRandomizerGroup.setBlackMarketPhase(1);
  }

  DominionSetToggleValuesOnChange( value ) {
    this.selectedDominionSetService.changeSelectedDominionSet( value.checked, value.index );
  }

  selectedCardsCheckboxOnChange( value ) {
    return this.myRandomizerGroup.setSelectedCardsCheckbox( value.category, value.index, value.checked );
  }

  selectedCardsCheckboxOnReset() {
    return this.myRandomizerGroup.resetSelectedCardsCheckbox();
  }

}
