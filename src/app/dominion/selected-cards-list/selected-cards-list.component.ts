import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdDialog } from '@angular/material';

import { UtilitiesService     } from '../../my-library/utilities.service';

import { FireDatabaseMediatorService } from '../../fire-database-mediator.service';
import { CardPropertyDialogComponent } from '../pure-components/card-property-dialog/card-property-dialog.component';

import { CardProperty          } from '../../classes/card-property';
import { SelectedCards         } from '../../classes/selected-cards';
import { SelectedCardsCheckbox } from '../../classes/selected-cards-checkbox-values';
import { BlackMarketPileCard   } from '../../classes/black-market-pile-card';


@Component({
  selector: 'app-selected-cards-list',
  templateUrl: './selected-cards-list.component.html',
  styleUrls: [
    '../../my-library/data-table/data-table.component.css',
    './selected-cards-list.component.css'
  ]
})
export class SelectedCardsListComponent implements OnInit, OnDestroy {
  private alive = true;
  receiveDataDone: boolean = false;

  cardPropertyList: CardProperty[] = [];

  // settings
  @Input() showSelectedCardsCheckbox: boolean = false;

  // input data
  @Input() selectedCards: SelectedCards;
  @Input() selectedCardsCheckbox: SelectedCardsCheckbox = new SelectedCardsCheckbox();

  @Output() selectedCardsCheckboxPartEmitter
    = new EventEmitter<{ category: string, index: number, checked: boolean }>();


  selectedCardsCategories = [
    { name: 'KingdomCards10' , description: '王国カード' },
    { name: 'BaneCard'       , description: '災いカード（魔女娘用）' },
    { name: 'EventCards'     , description: 'EventCards' },
    { name: 'LandmarkCards'  , description: 'LandmarkCards' },
    { name: 'Obelisk'        , description: 'Obelisk 指定カード' },
    { name: 'BlackMarketPile', description: '闇市場デッキ' },
  ];


  constructor(
    private utils: UtilitiesService,
    public dialog: MdDialog,
    private database: FireDatabaseMediatorService,
  ) {
    this.database.cardPropertyList$
      .takeWhile( () => this.alive )
      .subscribe( val => {
        this.receiveDataDone = true;
        this.cardPropertyList = val;
      } );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }


  selectedCardsCheckboxOnChange( category: string, index: number ) {
    const checked = this.selectedCardsCheckbox[category][index];
    this.selectedCardsCheckboxPartEmitter
      .emit({ category: category, index: index, checked: checked });
  }

  cardInfoButtonClicked( cardIndex: number ) {
    const dialogRef = this.dialog.open( CardPropertyDialogComponent );
    dialogRef.componentInstance.card = this.cardPropertyList[cardIndex];
  }

}
