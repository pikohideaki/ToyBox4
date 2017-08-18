import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MyRandomizerGroupService } from './my-randomizer-group.service';


@Injectable()
export class BlackMarketPileShuffledService {

  private BlackMarketPileShuffledSource = new BehaviorSubject<{ cardIndex: number, faceUp: boolean }[]>([]);
  public BlackMarketPileShuffled$ = this.BlackMarketPileShuffledSource.asObservable();

  constructor(
    private myRandomizerGroup: MyRandomizerGroupService
  ) {
    this.myRandomizerGroup.BlackMarketPileShuffled$().subscribe( val => {
      if ( !val ) return;
      this.BlackMarketPileShuffledSource.next( val );
    });
  }


  changeBlackMarketPileShuffled( newValue: { cardIndex: number, faceUp: boolean }[] ) {
    this.BlackMarketPileShuffledSource.next( newValue );
    this.myRandomizerGroup.setBlackMarketPileShuffled( newValue );
  }
}
