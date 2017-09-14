import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { DominionCardImageComponent  } from '../pure-components/dominion-card-image/dominion-card-image.component';
import { FireDatabaseMediatorService } from '../../fire-database-mediator.service';
import { MyRandomizerGroupService    } from './my-randomizer-group.service';
import { MyUserInfoService           } from '../../my-user-info.service';

import { CardProperty  } from '../../classes/card-property';
import { SelectedCards } from '../../classes/selected-cards';
import { PlayerName    } from '../../classes/player-name';


@Component({
  selector: 'app-online-victory-points-calculator',
  template: `
    <div class="bodyWithPadding">
      <app-my-name-selector></app-my-name-selector>
      <hr>
      <app-victory-points-calculator *ngIf="!!myPlayerId"
        [selectedCards$]="selectedCards$"
        [resetVPCalculator$]="resetVPCalculator$"
        (VPtotalChange)="VPtotalOnChange( $event )">
      </app-victory-points-calculator>
    </div>
  `,
  styles: [],
})
export class OnlineVictoryPointsCalculatorComponent implements OnInit, OnDestroy {
  private alive: boolean = true;

  selectedCards$: Observable<SelectedCards>;  // 存在するもののみ表示
  resetVPCalculator$: Observable<number>;

  myPlayerId: string = '';



  constructor(
    private myUserInfo: MyUserInfoService,
    private database: FireDatabaseMediatorService,
    private myRandomizerGroup: MyRandomizerGroupService,
  ) {
    this.selectedCards$ = this.myRandomizerGroup.selectedCards$;

    const myPlayerId$ = Observable.combineLatest(
        this.database.playersNameList$,
        this.myUserInfo.name$,
        (playersNameList, myName) =>
          ( playersNameList.find( e => e.name === myName ) || new PlayerName() ).databaseKey );

    myPlayerId$
      .takeWhile( () => this.alive )
      .subscribe( val => this.myPlayerId = val );

    this.resetVPCalculator$ = this.myRandomizerGroup.resetVPCalculator$;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }

  VPtotalOnChange( VPtotal: number ) {
    if ( !this.myPlayerId ) return;
    this.myRandomizerGroup.setNewGameResultPlayerVP( this.myPlayerId, VPtotal );
  }

}
