import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdDialog } from '@angular/material';

import { UtilitiesService } from '../../my-library/utilities.service';
import { FireDatabaseMediatorService } from '../../fire-database-mediator.service';
import { RandomizerService } from './randomizer.service';

import { AlertDialogComponent } from '../../my-library/alert-dialog/alert-dialog.component';
import { CardPropertyDialogComponent } from '../pure-components/card-property-dialog/card-property-dialog.component';

import { CardProperty          } from '../../classes/card-property';
import { SelectedCards         } from '../../classes/selected-cards';
import { SelectedCardsCheckbox } from '../../classes/selected-cards-checkbox-values';
import { BlackMarketPileCard   } from '../../classes/black-market-pile-card';


@Component({
  providers: [RandomizerService],
  selector: 'app-randomizer',
  templateUrl: './randomizer.component.html',
  styleUrls: [
    '../../my-library/data-table/data-table.component.css',
    './randomizer.component.css'
  ]
})
export class RandomizerComponent implements OnInit {

  /* settings */
  @Input() showSelectedCardsCheckbox: boolean = false;
  @Input() implementedOnly: boolean = false;


  @Input()  randomizerButtonLocked: boolean;
  @Output() randomizerButtonLockedChange = new EventEmitter<boolean>();

  @Input()  isSelectedExpansions: boolean[] = [];
  @Output() isSelectedExpansionsPartEmitter
    = new EventEmitter<{ index: number, checked: boolean }>();

  @Input()  selectedCards: SelectedCards;
  @Output() selectedCardsChange = new EventEmitter<SelectedCards>();

  @Input()  selectedCardsCheckbox: SelectedCardsCheckbox
    = new SelectedCardsCheckbox();
  @Output() selectedCardsCheckboxPartEmitter
    = new EventEmitter<{ category: string, index: number, checked: boolean }>();
  @Output() selectedCardsCheckboxOnReset = new EventEmitter<void>();

  @Input()  BlackMarketPileShuffled: BlackMarketPileCard[] = [];
  @Output() BlackMarketPileShuffledChange
    = new EventEmitter<BlackMarketPileCard[]>();



  constructor(
    private utils: UtilitiesService,
    public dialog: MdDialog,
    private randomizer: RandomizerService,
  ) {
  }

  ngOnInit() {
  }


  lockRandomizerButton( lock: boolean ) {
    this.randomizerButtonLocked = lock;
    this.randomizerButtonLockedChange.emit( lock );
  }


  selectedCardsCheckboxOnChange( value: { category: string, index: number, checked: boolean } ) {
    this.selectedCardsCheckboxPartEmitter.emit( value );
  }

  expansionToggleOnChange( value: { index: number, checked: boolean } ) {
    this.isSelectedExpansionsPartEmitter.next( value );
  }

  expansionsToggleIsEmpty(): boolean {
    return this.isSelectedExpansions.every( selected => !selected );
  }


  randomizerClicked() {
    if ( this.expansionsToggleIsEmpty() ) return;

    this.lockRandomizerButton(true);

    const result = this.randomizer.selectCards( this.implementedOnly, this.isSelectedExpansions );
    if ( !result.valid ) {
      const dialogRef = this.dialog.open( AlertDialogComponent );
      dialogRef.componentInstance.message = `サプライが足りません．セットの選択数を増やしてください．`;
      return;
    }

    this.selectedCards = new SelectedCards( result.selectedCards );
    this.selectedCardsChange.emit( this.selectedCards );

    this.selectedCardsCheckbox.clear();
    this.selectedCardsCheckboxOnReset.emit();

    const BlackMarketPileShuffled
      = this.utils.getShuffled( this.selectedCards.BlackMarketPile )
                  .map( e => ({ cardIndex: e, faceUp: false }) );
    this.BlackMarketPileShuffledChange.emit( BlackMarketPileShuffled );
  }

}
