import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SelectedCards } from '../../classes/selected-cards';

import { MyRandomizerGroupService } from './my-randomizer-group.service';


@Injectable()
export class SelectedCardsService {

  private selectedCardsSource = new BehaviorSubject< SelectedCards >( new SelectedCards() );
  public selectedCards$ = this.selectedCardsSource.asObservable().map( e => new SelectedCards(e) );

  constructor(
    private myRandomizerGroup: MyRandomizerGroupService
  ) {
    this.myRandomizerGroup.myRandomizerGroup$.map( e => e.selectedCards )
    .subscribe( val => {
      if ( !val ) return;
      this.selectedCardsSource.next( val );
    });
  }


  changeSelectedCards( newSelectedCards: SelectedCards ) {
    this.selectedCardsSource.next( newSelectedCards );
    this.myRandomizerGroup.setSelectedCards( newSelectedCards );
  }
}
