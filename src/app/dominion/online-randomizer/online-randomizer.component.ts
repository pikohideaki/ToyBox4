import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MyUserInfoService } from '../../my-user-info.service';

import { MyRandomizerGroupService } from './my-randomizer-group.service';
import { SelectedDominionSetService } from './selected-dominion-set.service';
import { SelectedCardsService } from './selected-cards.service';
import { BlackMarketPileShuffledService } from './black-market-pile-shuffled.service';
import { NewGameResultService } from './new-game-result.service';

import { SelectedCards } from '../../classes/selected-cards';


@Component({
  providers: [
    MyRandomizerGroupService,
    SelectedDominionSetService,
    SelectedCardsService,
    BlackMarketPileShuffledService,
    NewGameResultService,
  ],
  selector: 'app-online-randomizer',
  templateUrl: './online-randomizer.component.html',
  styleUrls: ['./online-randomizer.component.css']
})
export class OnlineRandomizerComponent implements OnInit {
  signedIn$: Observable<boolean>;
  myRandomizerGroupName$: Observable<string>;
  BlackMarketUsed$: Observable<boolean>;


  constructor(
    private myUserInfo: MyUserInfoService,
    private myRandomizerGroup: MyRandomizerGroupService,
    private selectedCardsService: SelectedCardsService,
  ) {
    this.signedIn$ = this.myUserInfo.signedIn$;
    this.myRandomizerGroupName$ = this.myRandomizerGroup.myRandomizerGroup$.map( e => e.name );
    this.BlackMarketUsed$
      = this.selectedCardsService.selectedCards$.map( e => e.BlackMarketPile.length > 0 );
  }

  ngOnInit() {
  }
}
