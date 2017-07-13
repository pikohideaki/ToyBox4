import { Component, OnInit, Input } from '@angular/core';

import { MdDialog } from '@angular/material';

import { MyUtilitiesService } from '../../../my-utilities.service';

import { CardProperty } from "../../card-property";
import { SelectedCards } from "../../selected-cards";
import { DominionCardImageComponent } from "../../dominion-card-image/dominion-card-image.component";
import { CardPropertyDialogComponent } from '../../card-property-dialog/card-property-dialog.component';


@Component({
  selector: 'app-randomizer-card-image',
  templateUrl: './randomizer-card-image.component.html',
  styleUrls: ['./randomizer-card-image.component.css']
})
export class RandomizerCardImageComponent implements OnInit {

  @Input() longSideLength: number = 140;

  @Input() CardPropertyList: CardProperty[];

  @Input() SelectedCards: SelectedCards = new SelectedCards(); 

  Platinum: { data: CardProperty, checked: boolean };
  Colony  : { data: CardProperty, checked: boolean };



  constructor(
    private utils: MyUtilitiesService,
    public dialog: MdDialog,
  ) { }

  ngOnInit() {
    this.Platinum = {
      checked : false,
      data  : this.CardPropertyList.find( e => e.card_ID === "Platinum" )
    }
    this.Colony = {
      checked : false,
      data  : this.CardPropertyList.find( e => e.card_ID === "Colony" )
    }
  }


  cardInfoButtonClicked( cardIndex ) {
    const selectedCardForView = this.CardPropertyList[cardIndex].transform();
    const dialogRef = this.dialog.open( CardPropertyDialogComponent );
    dialogRef.componentInstance.card = selectedCardForView;
  }

}
