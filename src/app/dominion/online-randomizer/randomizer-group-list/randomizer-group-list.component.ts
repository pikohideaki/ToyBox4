import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { UtilitiesService } from '../../../my-library/utilities.service';
import { FireDatabaseMediatorService } from '../../../fire-database-mediator.service';
import { MyUserInfoService } from '../../../my-user-info.service';

import { MyRandomizerGroupService } from '../my-randomizer-group.service';
import { SelectedDominionSetService } from '../selected-dominion-set.service';

import { SelectedCards   } from '../../../classes/selected-cards';
import { RandomizerGroup } from '../../../classes/randomizer-group';
import { UserInfo        } from '../../../classes/user-info';


@Component({
  providers: [MyUserInfoService],
  selector: 'app-randomizer-group-list',
  templateUrl: './randomizer-group-list.component.html',
  styleUrls: ['./randomizer-group-list.component.css']
})
export class RandomizerGroupListComponent implements OnInit, OnDestroy {
  private alive = true;

  @Input() private sidenav;
  private DominionSetToggleValues: boolean[] = [];
  private selectedCards: SelectedCards = new SelectedCards();
  randomizerGroupList: RandomizerGroup[] = [];
  private userInfoList: UserInfo[] = [];
  private myID: string;
  newGroupName: string;
  newGroupPassword: string;
  signInPassword: string;
  showWrongPasswordAlert = false;
  selectedGroupID = '';


  constructor(
    public snackBar: MdSnackBar,
    public utils: UtilitiesService,
    private myUserInfo: MyUserInfoService,
    private database: FireDatabaseMediatorService,
    private myRandomizerGroup: MyRandomizerGroupService,
    private selectedDominionSetService: SelectedDominionSetService
  ) {
    this.myUserInfo.myID$
      .takeWhile( () => this.alive )
      .subscribe( val => this.myID = val );

    this.database.randomizerGroupList$
      .takeWhile( () => this.alive )
      .subscribe( val => this.randomizerGroupList = val )

    this.database.userInfoList$
      .takeWhile( () => this.alive )
      .subscribe( val => this.userInfoList = val );

    this.myRandomizerGroup.myRandomizerGroup$.map( e => e.selectedCards )
      .takeWhile( () => this.alive )
      .subscribe( val => this.selectedCards = val );

    this.selectedDominionSetService.selectedDominionSetMerged$
      .takeWhile( () => this.alive )
      .subscribe( val => this.DominionSetToggleValues[ val.index ] = val.checked );

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

  private removeMemberEmptyGroup() {
    console.log( this.userInfoList, this.myID )
    const promises
      = this.randomizerGroupList
            .filter( g => this.getUserNamesInGroup( g.databaseKey ).length === 0 )  // empty
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
    const newRandomizerGroup = new RandomizerGroup();
    {
      newRandomizerGroup.name                = this.newGroupName;
      newRandomizerGroup.password            = this.newGroupPassword;
      newRandomizerGroup.timeStamp           = Date.now();
      newRandomizerGroup.selectedCards       = this.selectedCards;
      newRandomizerGroup.selectedDominionSet = this.DominionSetToggleValues;
    }

    const ref = await this.database.randomizerGroup.addGroup( newRandomizerGroup );
    const groupID = ref.key;
    await this.database.userInfo.setGroupID( this.myID, groupID );
    await this.removeMemberEmptyGroup();
    this.resetAddGroupForm();
  };


  signIn = async ( groupID ) => {
    if ( !this.signInPasswordIsValid( groupID ) ) return;
    await this.database.userInfo.setGroupID( this.myID, groupID );
    await this.removeMemberEmptyGroup();
    this.resetSignInForm();
    this.openSnackBar('Successfully signed in!');
    this.sidenav.close();
  }

  signOut = async ( groupID ) => {
    if ( !this.signInPasswordIsValid( groupID ) ) return;
    await this.database.userInfo.setGroupID( this.myID, '' );
    await this.removeMemberEmptyGroup();
    this.resetSignInForm();
    this.openSnackBar('Successfully signed out!');
    this.sidenav.close();
  }

  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }


  // view
  getUserNamesInGroup( groupID ) {
    return this.userInfoList.filter( user => user.randomizerGroupID === groupID )
                            .map( user => user.name );
  }

  groupClicked( $event, index: number ) {
    this.resetSignInForm();
    this.selectedGroupID = this.randomizerGroupList[index].databaseKey;
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
