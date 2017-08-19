import { Component, OnInit, OnDestroy, Input } from '@angular/core';

// import { Observable } from 'rxjs/Observable';
// import 'rxjs/rx';
import { Observable } from 'rxjs/Rx';

import { MdDialog } from '@angular/material';

import { UtilitiesService } from '../../../utilities.service';
import { DominionDatabaseService } from '../../dominion-database.service';

import { MyRandomizerGroupService } from '../my-randomizer-group.service';
import { SelectedDominionSetService } from '../selected-dominion-set.service';
import { SelectedCardsService } from '../selected-cards.service';
import { BlackMarketPileShuffledService } from '../black-market-pile-shuffled.service';

import { AlertDialogComponent } from '../../../alert-dialog/alert-dialog.component';

import { DataTableComponent } from '../../../data-table/data-table.component';
import { SelectedCards } from '../../selected-cards';
import { SelectedCardsCheckboxValues } from '../../selected-cards-checkbox-values';

import { CardPropertyDialogComponent } from '../../card-property-dialog/card-property-dialog.component';


@Component({
  selector: 'app-randomizer-select-cards',
  templateUrl: './randomizer-select-cards.component.html',
  styleUrls: [
    '../../../data-table/data-table.component.css',
    './randomizer-select-cards.component.css'
  ]
})
export class RandomizerSelectCardsComponent implements OnInit, OnDestroy {
  private alive = true;
  receiveDataDone = false;

  DominionSetToggleValues: boolean[] = [];

  selectedCards: SelectedCards = new SelectedCards();
  selectedCardsCheckboxValues = new SelectedCardsCheckboxValues();

  randomizerButtonLocked = false;

  constructor(
    private utils: UtilitiesService,
    public dialog: MdDialog,
    private database: DominionDatabaseService,
    private myRandomizerGroup: MyRandomizerGroupService,
    private selectedDominionSetService: SelectedDominionSetService,
    private selectedCardsService: SelectedCardsService,
    private BlackMarketService: BlackMarketPileShuffledService
  ) {
    this.myRandomizerGroup.randomizerButtonLocked$()
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
        this.myRandomizerGroup.selectedCardsCheckboxValues$( arrayName, idx )
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
    this.myRandomizerGroup.setBlackMarketOperationPhase(1);
  }

  DominionSetToggleValuesOnChange( value ) {
    this.selectedDominionSetService.changeSelectedDominionSet( value.checked, value.index );
  }

  selectedCardsCheckboxValuesOnChange( value ) {
    return this.myRandomizerGroup.setSelectedCardsCheckboxValues( value.checked, value.category, value.index );
  }

  selectedCardsCheckboxValuesOnReset() {
    this.myRandomizerGroup.setSelectedCardsCheckboxValuesAll( this.selectedCardsCheckboxValues );
  }

}
