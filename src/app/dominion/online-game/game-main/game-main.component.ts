import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { UtilitiesService, Stopwatch } from '../../../my-library/utilities.service';
import { MyUserInfoService } from '../../../my-user-info.service';
import { FireDatabaseMediatorService } from '../../../fire-database-mediator.service';
import { MyGameRoomService  } from './my-game-room.service';
import { MyGameStateService } from './my-game-state.service';
import { GameLoopService } from './game-loop.service';
import { ManipCardFunctionsService } from './manip-card-functions.service';

import { CardProperty } from '../../../classes/card-property';
import { GameRoom } from '../../../classes/game-room';
import {
    TurnInfo,
    CommonCardData$$,
    CardDataForPlayer$$,
    PlayersCards,
    BasicCards,
    KingdomCards,
   } from '../../../classes/game-state';


@Component({
  providers: [
    MyGameRoomService,
    MyGameStateService,
    GameLoopService,
    ManipCardFunctionsService,
  ],
  selector: 'app-game-main',
  templateUrl: './game-main.component.html',
  styleUrls: ['./game-main.component.css']
})
export class GameMainComponent implements OnInit, OnDestroy {
  private alive: boolean = true;
  receiveDataDone$: Observable<boolean>;

  myIndex$: Observable<number>;
  myIndex: number;

  cardPropertyList$ = this.database.cardPropertyList$;
  chatOpened$:  Observable<boolean> = this.myUserInfo.onlineGame.chatOpened$;
  myGameRoom$:  Observable<GameRoom>;
  turnInfo$:    Observable<TurnInfo>;
  itsMyTurn$:   Observable<boolean>;

  commonCardData$$:  CommonCardData$$;
  cardDataForMe$$:   CardDataForPlayer$$;

  turnPlayersCards$: Observable<PlayersCards>;
  playersCards$:     Observable<PlayersCards[]>;
  BasicCards$:       Observable<BasicCards>;
  KingdomCards$:     Observable<KingdomCards>;
  TrashPile$:        Observable<number[]>;
  turnPlayerIndex$:  Observable<number>;


  constructor(
    private utils: UtilitiesService,
    private database: FireDatabaseMediatorService,
    private myUserInfo: MyUserInfoService,
    private myGameRoomService: MyGameRoomService,
    private myGameStateService: MyGameStateService,
    private manipCard: ManipCardFunctionsService,
    private gameLoopService: GameLoopService,
  ) {
  }

  ngOnInit() {
    this.myGameRoom$ = this.myGameRoomService.myGameRoom$;
    this.myIndex$    = this.myGameRoomService.myIndex$;

    this.turnInfo$         = this.myGameStateService.turnInfo$;
    this.commonCardData$$  = this.myGameStateService.commonCardData$$;
    this.cardDataForMe$$   = this.myGameStateService.cardDataForMe$$;
    this.turnPlayersCards$ = this.myGameStateService.turnPlayersCards$;
    this.playersCards$     = this.myGameStateService.playersCards$;
    this.BasicCards$       = this.myGameStateService.BasicCards$;
    this.KingdomCards$     = this.myGameStateService.KingdomCards$;
    this.TrashPile$        = this.myGameStateService.TrashPile$;
    this.turnPlayerIndex$  = this.myGameStateService.turnPlayerIndex$;

    this.itsMyTurn$ = Observable.combineLatest(
        this.turnPlayerIndex$, this.myIndex$,
        (turnPlayerIndex, myIndex) => (turnPlayerIndex === myIndex) )
      .distinctUntilChanged()
      .startWith( false );

    this.itsMyTurn$.filter( e => e === true )
      .takeWhile( () => this.alive )
      .subscribe( () => this.gameLoopService.startMyTurn() );

    this.receiveDataDone$
      = Observable.combineLatest(
            this.myGameRoomService.myGameRoom$,
            this.database.cardPropertyList$,
            this.myIndex$,
            () => true ).first().delay( new Date( Date.now() + 500 ) )
        .startWith(false);
  }

  ngOnDestroy() {
    this.alive = false;
  }



  async toggleSideNav( sidenav ) {
    this.myUserInfo.setOnlineGameChatOpened( (await sidenav.toggle()).type === 'open' );
  }

  sortMyHandCards() {
    this.manipCard.sortHandCards( this.myIndex );
  }

  onCardClicked( value ) {
    this.gameLoopService.clickedCardIdSource.next( value );
  }

  goToNextPhase() {
    this.gameLoopService.clickedCardIdSource.next( this.gameLoopService.GO_TO_NEXT_PHASE_ID );
  }

  goToNextPlayer() {
    this.gameLoopService.clickedCardIdSource.next( this.gameLoopService.GO_TO_NEXT_PLAYER_ID );
    this.gameLoopService.goToNextPlayerState = true;
  }



  test() { this.gameLoopService.test() }
  faceUpCurse() { this.gameLoopService.faceUpCurse(); }
  faceDownCurse() { this.gameLoopService.faceDownCurse(); }
}
