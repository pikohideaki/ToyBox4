import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// Angular Material
import { MaterialModule,
         MdIconModule,
         MdIconRegistry,
         MdDatepickerModule,
         MdNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // md-tab
import 'hammerjs';

// Firebase
import { AngularFireModule         } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule     } from 'angularfire2/auth';
import { environment               } from '../environments/environment';


////////////////////////////////////////////////////////////////////////////////////////////////////

// Home Component
import { AppComponent  } from './app.component';
import { HomeComponent } from './home/home.component';

// MyServices
import { UtilitiesService         } from './utilities.service';
import { MyUserInfoService        } from './my-user-info.service';
import { MyRandomizerGroupService } from './dominion/online-randomizer/my-randomizer-group.service';

// MyComponents
import { AlertDialogComponent      } from './alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent    } from './confirm-dialog/confirm-dialog.component';
import { WaitingSpinnerComponent   } from './waiting-spinner/waiting-spinner.component';
import { AppListComponent          } from './app-list/app-list.component';

// MyDataTable
import { DataTableComponent    } from './data-table/data-table.component';
import { ItemsPerPageComponent } from './data-table/items-per-page/items-per-page.component';
import { PagenationComponent   } from './data-table/pagenation/pagenation.component';
import { ResetButtonComponent  } from './data-table/reset-button/reset-button.component';



// Dominion Service
import { DominionDatabaseService } from './dominion/dominion-database.service';

// Dominion Apps
import { DominionComponent                } from './dominion/dominion.component';

// user admin
import { UserAdminComponent               } from './user-admin/user-admin.component';
import { LoginComponent                   } from './user-admin/login/login.component';
import { SignUpComponent                  } from './user-admin/sign-up/sign-up.component';

// sub component
import { DominionCardImageComponent       } from './dominion/dominion-card-image/dominion-card-image.component';
import { CardImageSizeSliderComponent     } from './dominion/card-image-size-slider/card-image-size-slider.component';
import { MyNameSelectorComponent          } from './dominion/my-name-selector/my-name-selector.component';
import { RandomizerComponent              } from './dominion/randomizer/randomizer.component';
// dominion dialog
import { CardPropertyDialogComponent      } from './dominion/card-property-dialog/card-property-dialog.component';
import { SubmitGameResultDialogComponent  } from './dominion/submit-game-result-dialog/submit-game-result-dialog.component';
import { GameResultDetailDialogComponent  } from './dominion/game-result/game-result-list/game-result-detail-dialog/game-result-detail-dialog.component';

// sub apps
import { RuleBooksComponent               } from './dominion/rule-books/rule-books.component';
import { PlayersComponent                 } from './dominion/players/players.component';
import { ScoringTableComponent            } from './dominion/scoring-table/scoring-table.component';
import { CardPropertyListComponent        } from './dominion/card-property-list/card-property-list.component';

// game result list
import { GameResultComponent              } from './dominion/game-result/game-result.component';
import { GameResultListComponent          } from './dominion/game-result/game-result-list/game-result-list.component';
import { GameResultOfPlayerComponent      } from './dominion/game-result/game-result-of-player/game-result-of-player.component';

// online randomizer
import { OnlineRandomizerComponent        } from './dominion/online-randomizer/online-randomizer.component';
import { AddGameResultComponent           } from './dominion/online-randomizer/add-game-result/add-game-result.component';
import { RandomizerCardImageComponent     } from './dominion/online-randomizer/randomizer-card-image/randomizer-card-image.component';
import { RandomizerSelectCardsComponent   } from './dominion/online-randomizer/randomizer-select-cards/randomizer-select-cards.component';
import { RandomizerGroupListComponent              } from './dominion/online-randomizer/randomizer-group-list/randomizer-group-list.component';
import { BlackMarketPileComponent         } from './dominion/online-randomizer/black-market-pile/black-market-pile.component';
import { VictoryPointsCalculatorComponent } from './dominion/online-randomizer/victory-points-calculator/victory-points-calculator.component';

// dominion online
import { OnlineGameComponent          } from './dominion/online-game/online-game.component';
import { GameRoomListComponent            } from './dominion/online-game/game-room-list/game-room-list.component';
import { AddGameGroupComponent            } from './dominion/online-game/add-game-group/add-game-group.component';
import { SignInToGameRoomDialogComponent  } from './dominion/online-game/sign-in-to-game-room-dialog/sign-in-to-game-room-dialog.component';
import { GameMainComponent } from './dominion/online-game/game-main/game-main.component';
import { ChatComponent } from './dominion/online-game/game-main/chat/chat.component';
import { ManipDataComponent } from './manip-data/manip-data.component';
import { SharedAreaComponent } from './dominion/online-game/game-main/shared-area/shared-area.component';
import { CardsPileComponent } from './dominion/online-game/game-main/cards-pile/cards-pile.component';
import { TurnPlayerAreaComponent } from './dominion/online-game/game-main/turn-player-area/turn-player-area.component';
import { OtherPlayerAreaComponent } from './dominion/online-game/game-main/other-player-area/other-player-area.component';
import { TurnInfoComponent } from './dominion/online-game/game-main/turn-info/turn-info.component';



////////////////////////////////////////////////////////////////////////////////////////////////////


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DataTableComponent,
    WaitingSpinnerComponent,
    ItemsPerPageComponent,
    PagenationComponent,
    ResetButtonComponent,
    AppListComponent,
    DominionComponent,
    CardPropertyDialogComponent,
    CardPropertyListComponent,
    DominionCardImageComponent,
    GameResultComponent,
    SubmitGameResultDialogComponent,
    GameResultListComponent,
    GameResultOfPlayerComponent,
    PlayersComponent,
    RandomizerComponent,
    AddGameResultComponent,
    RandomizerCardImageComponent,
    RuleBooksComponent,
    ConfirmDialogComponent,
    RandomizerSelectCardsComponent,
    RandomizerGroupListComponent,
    BlackMarketPileComponent,
    ScoringTableComponent,
    UserAdminComponent,
    LoginComponent,
    SignUpComponent,
    AlertDialogComponent,
    VictoryPointsCalculatorComponent,
    CardImageSizeSliderComponent,
    GameResultDetailDialogComponent,
    OnlineGameComponent,
    GameRoomListComponent,
    AddGameGroupComponent,
    SignInToGameRoomDialogComponent,
    MyNameSelectorComponent,
    OnlineRandomizerComponent,
    GameMainComponent,
    ChatComponent,
    ManipDataComponent,
    SharedAreaComponent,
    CardsPileComponent,
    TurnPlayerAreaComponent,
    OtherPlayerAreaComponent,
    TurnInfoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpModule,
    RouterModule.forRoot( [
      { component: HomeComponent             , path: '' },
      { component: DominionComponent         , path: 'dominion' },
      { component: CardPropertyListComponent , path: 'dominion/cardlist' },
      { component: RuleBooksComponent        , path: 'dominion/rulebooks' },
      { component: GameResultComponent       , path: 'dominion/gameresult' },
      { component: PlayersComponent          , path: 'dominion/players' },
      { component: ScoringTableComponent     , path: 'dominion/scoring' },
      { component: OnlineRandomizerComponent , path: 'dominion/online-randomizer' },
      { component: OnlineGameComponent   , path: 'dominion/online-game' },
      { component: GameMainComponent         , path: 'dominion/online-game-main/:id' },
      { component: UserAdminComponent        , path: 'user_admin' },
      { component: ManipDataComponent        , path: 'manip-data' },
    ], { useHash: true } ),
    MaterialModule,
    MdDatepickerModule,
    MdNativeDateModule,
    AngularFireModule.initializeApp(environment.firebase, 'DominionApps'), // imports firebase/app needed for everything
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
  ],
  providers: [
    { provide: 'DATA_DIR', useValue: 'assets' },
    { provide: 'DOMINION_DATA_DIR', useValue: 'assets' },
    { provide: 'HOST_NAME', useValue: 'http://dominion.piko-apps.info/' },
    { provide: 'FIREBASE_DATA_URL', useValue: 'https://dominionapps.firebaseio.com/data' },
    UtilitiesService,
    MyUserInfoService,
    DominionDatabaseService,
    MyRandomizerGroupService,
  ],
  /* for dialog, snackbar */
  entryComponents: [
      CardPropertyDialogComponent,
      SubmitGameResultDialogComponent,
      AlertDialogComponent,
      ConfirmDialogComponent,
      GameResultDetailDialogComponent,
      SignInToGameRoomDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
