import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { UtilitiesService } from '../../../my-library/utilities.service';
import { FireDatabaseMediatorService } from '../../../fire-database-mediator.service';
import { MyUserInfoService } from '../../../my-user-info.service';

import { MyRandomizerGroupService } from '../my-randomizer-group.service';

import { SelectedCards         } from '../../../classes/selected-cards';
import { RandomizerGroup       } from '../../../classes/randomizer-group';
import { UserInfo              } from '../../../classes/user-info';
import { PlayerResult          } from '../../../classes/player-result';
import { SelectedCardsCheckbox } from '../../../classes/selected-cards-checkbox-values';
import { BlackMarketPileCard   } from '../../../classes/black-market-pile-card';


@Component({
  selector: 'app-randomizer-group-list',
  templateUrl: './randomizer-group-list.component.html',
  styleUrls: ['./randomizer-group-list.component.css']
})
export class RandomizerGroupListComponent implements OnInit, OnDestroy {
  private alive = true;

  @Input() private sidenav;
  randomizerGroupList: RandomizerGroup[] = [];
  newGroupName: string;
  newGroupPassword: string;
  signInPassword: string;
  showWrongPasswordAlert = false;
  selectedGroupID = '';

  groupIdToUserNames: {};


  constructor(
    public snackBar: MdSnackBar,
    public utils: UtilitiesService,
    private myUserInfo: MyUserInfoService,
    private database: FireDatabaseMediatorService,
    private myRandomizerGroup: MyRandomizerGroupService,
  ) {
    this.database.randomizerGroupList$
      .takeWhile( () => this.alive )
      .subscribe( val => this.randomizerGroupList = val )

    const groupIdToUserNames$
      = Observable.combineLatest(
            this.database.randomizerGroupList$,
            this.database.userInfoList$,
            (randomizerGroupList, userInfoList) => {
              const mapObj = {};
              randomizerGroupList.forEach( group =>
                mapObj[ group.databaseKey ]
                  = userInfoList.filter( user => user.randomizerGroupID === group.databaseKey )
                                .map( user => user.name ) )
              return mapObj;
            });

    groupIdToUserNames$
      .takeWhile( () => this.alive )
      .subscribe( val => this.groupIdToUserNames = val );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }


  private signInPasswordIsValid( groupID ): boolean {
    const isValid = ( this.signInPassword === this.randomizerGroupList.find( g => g.databaseKey === groupID ).password );
    this.showWrongPasswordAlert = !isValid;
    return isValid;
  }

  private hasNoMember( groupID: string ): boolean {
    return this.groupIdToUserNames[ groupID ].length === 0;
  }

  private removeMemberEmptyGroup() {
    const promises
      = this.randomizerGroupList
            .filter( g => this.hasNoMember( g.databaseKey ) )
            .map( g => this.database.randomizerGroup.removeGroup( g.databaseKey ) )
    return Promise.all( promises );
  }

  private resetAddGroupForm() {
    this.newGroupName = undefined;
    this.newGroupPassword = undefined;
  }

  private resetSignInForm() {
    this.signInPassword = undefined;
  }

  addRandomizerGroup = async () => {
    const expansionsNameList
      = await this.database.expansionsNameList$.first().toPromise();
    const isSelectedExpansionsInit = expansionsNameList.map( _ => true );

    const playersNameList
      = await this.database.playersNameList$.first().toPromise();

    const playerResults = {};
    playersNameList.forEach( e => playerResults[ e.databaseKey ] = {
        name      : e.name,
        selected  : false,
        VP        : 0,
        winByTurn : false,
    });

    const newRandomizerGroup = new RandomizerGroup( null, {
        name:                      this.newGroupName,
        password:                  this.newGroupPassword,
        dateString:                new Date( Date.now() ).toString(),
        randomizerButtonLocked:    false,
        isSelectedExpansions:      isSelectedExpansionsInit,
        selectedCards:             new SelectedCards(),
        selectedCardsCheckbox:     new SelectedCardsCheckbox(),
        BlackMarketPileShuffled:   [],
        BlackMarketPhase:          0,
        newGameResult: {
          players: playerResults,
          place:   '',
          memo:    '',
        },
        newGameResultDialogOpened: false,
        resetVPCalculator:         0,
        startPlayerName:           '',
    });

    const ref = await this.database.randomizerGroup.addGroup( newRandomizerGroup );
    const groupID = ref.key;
    await this.myUserInfo.setRandomizerGroupID( groupID );
    await this.removeMemberEmptyGroup();
    this.resetAddGroupForm();
  };


  signIn = async ( groupID ) => {
    if ( !this.signInPasswordIsValid( groupID ) ) return;
    await this.myUserInfo.setRandomizerGroupID( groupID );
    await this.removeMemberEmptyGroup();
    this.resetSignInForm();
    this.openSnackBar('Successfully signed in!');
    this.sidenav.close();
  }

  signOut = async ( groupID ) => {
    if ( !this.signInPasswordIsValid( groupID ) ) return;
    await this.myUserInfo.setRandomizerGroupID('');
    await this.removeMemberEmptyGroup();
    this.resetSignInForm();
    this.openSnackBar('Successfully signed out!');
    this.sidenav.close();
  }

  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }


  // view

  // setSelectedGroupID( groupID: string ) {
  //   this.selectedGroupID = groupID;
  // }

  groupClicked( $event, groupID: string ) {
    this.resetSignInForm();
    this.selectedGroupID = groupID;
    $event.stopPropagation();
  }

  backgroundClicked() {
    this.resetSignInForm();
    this.selectedGroupID = '';
  }

  closeSideNav() {
    this.resetSignInForm();
    this.resetAddGroupForm();
    this.sidenav.close()
  }
}
