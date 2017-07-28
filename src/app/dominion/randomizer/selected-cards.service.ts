import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SelectedCards } from '../selected-cards';
import { MySyncGroupService } from './my-sync-group.service';

@Injectable()
export class SelectedCardsService {

  private selectedCardsSource = new BehaviorSubject< SelectedCards >( new SelectedCards() );
  public selectedCards$ = this.selectedCardsSource.asObservable().map( e => new SelectedCards(e) );

  constructor(
    private mySyncGroup: MySyncGroupService
  ) {
    this.mySyncGroup.selectedCards$().subscribe( val => {
      if ( !val ) return;
      this.selectedCardsSource.next( val );
    });
  }


  changeSelectedCards( newSelectedCards: SelectedCards ) {
    this.selectedCardsSource.next( newSelectedCards );
    this.mySyncGroup.setSelectedCards( newSelectedCards );
  }
}
