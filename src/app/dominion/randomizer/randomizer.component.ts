import { Component, OnInit, Input } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AngularFireAuth } from 'angularfire2/auth';


import { MySyncGroupService } from './my-sync-group.service';
import { SelectedDominionSetService } from './selected-dominion-set.service';
import { SelectedCardsService } from './selected-cards.service';
import { BlackMarketPileShuffledService } from './black-market-pile-shuffled.service';
import { NewGameResultService } from './new-game-result.service';
import { UserInfoService } from '../user-info.service';

import { SelectedCards } from '../selected-cards';


@Component({
  providers: [
    MySyncGroupService,
    SelectedDominionSetService,
    SelectedCardsService,
    BlackMarketPileShuffledService,
    NewGameResultService,
    UserInfoService
  ],
  selector: 'app-randomizer',
  templateUrl: './randomizer.component.html',
  styleUrls: ['./randomizer.component.css']
})
export class RandomizerComponent implements OnInit {

  private alive = true;
  mySyncGroupID$: Observable<string>;
  signedIn$: Observable<boolean>;
  mySyncGroupName$: Observable<string>;
  selectedCards$: Observable<SelectedCards>;


  constructor(
    private afAuth: AngularFireAuth,
    private mySyncGroup: MySyncGroupService,
    private selectedCardsService: SelectedCardsService
  ) {
    this.signedIn$ = this.afAuth.authState.map( e => !!e );
    this.selectedCards$ =  this.selectedCardsService.selectedCards$;
    this.mySyncGroupName$ = this.mySyncGroup.mySyncGroup$().map( e => e.name );
  }

  ngOnInit() {
  }
}
