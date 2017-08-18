import { Component, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { MyRandomizerGroupService } from './my-randomizer-group.service';
import { SelectedDominionSetService } from './selected-dominion-set.service';
import { SelectedCardsService } from './selected-cards.service';
import { BlackMarketPileShuffledService } from './black-market-pile-shuffled.service';
import { NewGameResultService } from './new-game-result.service';
import { MyUserInfoService } from '../../my-user-info.service';

import { SelectedCards } from '../selected-cards';


@Component({
  providers: [
    MyRandomizerGroupService,
    SelectedDominionSetService,
    SelectedCardsService,
    BlackMarketPileShuffledService,
    NewGameResultService
  ],
  selector: 'app-online-randomizer',
  templateUrl: './online-randomizer.component.html',
  styleUrls: ['./online-randomizer.component.css']
})
export class OnlineRandomizerComponent implements OnInit {
  signedIn$: Observable<boolean>;
  selectedCards$: Observable<SelectedCards>;
  myRandomizerGroupName$: Observable<string>;


  constructor(
    private myRandomizerGroup: MyRandomizerGroupService,
    private selectedCardsService: SelectedCardsService,
    private myUserInfo: MyUserInfoService
  ) {
    this.signedIn$ = this.myUserInfo.signedIn$;
    this.selectedCards$ =  this.selectedCardsService.selectedCards$;
    this.myRandomizerGroupName$ = this.myRandomizerGroup.myRandomizerGroup$().map( e => e.name );
  }

  ngOnInit() {
  }
}
