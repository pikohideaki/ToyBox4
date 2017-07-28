import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MySyncGroupService } from './my-sync-group.service';


@Injectable()
export class BlackMarketPileShuffledService {

  private BlackMarketPileShuffledSource = new BehaviorSubject<{ cardIndex: number, faceUp: boolean }[]>([]);
  public BlackMarketPileShuffled$ = this.BlackMarketPileShuffledSource.asObservable();

  constructor(
    private mySyncGroup: MySyncGroupService
  ) {
    this.mySyncGroup.BlackMarketPileShuffled$().subscribe( val => {
      if ( !val ) return;
      this.BlackMarketPileShuffledSource.next( val );
    });
  }


  changeBlackMarketPileShuffled( newValue: { cardIndex: number, faceUp: boolean }[] ) {
    this.BlackMarketPileShuffledSource.next( newValue );
    this.mySyncGroup.setBlackMarketPileShuffled( newValue );
  }
}
