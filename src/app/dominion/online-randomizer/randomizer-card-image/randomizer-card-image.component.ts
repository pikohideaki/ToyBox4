import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { MdDialog } from '@angular/material';

import { UtilitiesService } from '../../../utilities.service';
import { DominionDatabaseService } from '../../dominion-database.service';

import { SelectedCardsService } from '../selected-cards.service';

import { CardProperty } from '../../card-property';
import { SelectedCards } from '../../selected-cards';
import { DominionCardImageComponent } from '../../dominion-card-image/dominion-card-image.component';
import { CardPropertyDialogComponent } from '../../card-property-dialog/card-property-dialog.component';


@Component({
  providers: [SelectedCardsService],
  selector: 'app-randomizer-card-image',
  templateUrl: './randomizer-card-image.component.html',
  styleUrls: ['./randomizer-card-image.component.css']
})
export class RandomizerCardImageComponent implements OnInit, OnDestroy {

  private alive = true;
  receiveDataDone: boolean = false;

  @Input() longSideLength = 180;

  cardPropertyList: CardProperty[];

  selectedCards: SelectedCards = new SelectedCards();

  // Platinum: { data: CardProperty, checked: boolean };
  // Colony:   { data: CardProperty, checked: boolean };



  constructor(
    private utils: UtilitiesService,
    public dialog: MdDialog,
    private database: DominionDatabaseService,
    private selectedCardsService: SelectedCardsService
  ) { }


  ngOnInit() {
    Observable.combineLatest(
        this.database.cardPropertyList$,
        this.selectedCardsService.selectedCards$,
        (cardPropertyList, selectedCards) => ({
          cardPropertyList : cardPropertyList,
          selectedCards    : selectedCards
        }) )
      .takeWhile( () => this.alive )
      .subscribe( val => {
        this.cardPropertyList = val.cardPropertyList;
        this.selectedCards    = val.selectedCards;
        this.receiveDataDone = true;
      });

    // this.Platinum = {
    //   checked : false,
    //   data  : this.cardPropertyList.find( e => e.cardID === 'Platinum' )
    // }
    // this.Colony = {
    //   checked : false,
    //   data  : this.cardPropertyList.find( e => e.cardID === 'Colony' )
    // }
  }

  ngOnDestroy() {
    this.alive = false;
  }


  cardInfoButtonClicked( cardIndex ) {
    // const selectedCardForView = this.cardPropertyList[cardIndex].transform();
    const dialogRef = this.dialog.open( CardPropertyDialogComponent );
    // dialogRef.componentInstance.card = selectedCardForView;
    dialogRef.componentInstance.card = this.cardPropertyList[cardIndex];
  }

}
