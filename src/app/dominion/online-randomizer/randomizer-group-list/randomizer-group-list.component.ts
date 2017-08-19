import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { UtilitiesService } from '../../../utilities.service';
import { DominionDatabaseService } from '../../dominion-database.service';
import { MyRandomizerGroupService } from '../my-randomizer-group.service';
import { SelectedDominionSetService } from '../selected-dominion-set.service';
import { MyUserInfoService } from '../../../my-user-info.service';
import { SelectedCards } from '../../selected-cards';
import { RandomizerGroup } from '../../randomizer-group';
import { UserInfo } from '../../../user-info';


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
  randomizerGroupList: { id: string, selected: boolean, data: RandomizerGroup }[] = [];
  private userInfoList: UserInfo[] = [];
  private myID: string;
  newGroupName: string;
  newGroupPassword: string;
  signInPassword: string;
  showWrongPasswordAlert = false;


  constructor(
    public snackBar: MdSnackBar,
    public utils: UtilitiesService,
    private myUserInfo: MyUserInfoService,
    private database: DominionDatabaseService,
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

    this.myRandomizerGroup.selectedCards$()
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
    const isValid = ( this.signInPassword === this.randomizerGroupList.find( g => g.id === groupID ).data.password );
    this.showWrongPasswordAlert = !isValid;
    return isValid;
  }

  private removeMemberEmptyGroup() {
    console.log( this.userInfoList, this.myID )
    const promises
      = this.randomizerGroupList
            .filter( g => this.getUserNamesInGroup( g.id ).length === 0 )  // empty
            .map( g => this.database.removeRandomizerGroup( g.id ) )
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

    const ref = await this.database.addRandomizerGroup( newRandomizerGroup );
    const groupID = ref.key;
    await this.database.updateUserGroupID( groupID, this.myID );
    await this.removeMemberEmptyGroup();
    this.resetAddGroupForm();
  };


  signIn = async ( groupID ) => {
    if ( !this.signInPasswordIsValid( groupID ) ) return;
    await this.database.updateUserGroupID( groupID, this.myID );
    await this.removeMemberEmptyGroup();
    this.resetSignInForm();
    this.openSnackBar('Successfully signed in!');
    this.sidenav.close();
  }

  signOut = async ( groupID ) => {
    if ( !this.signInPasswordIsValid( groupID ) ) return;
    await this.database.updateUserGroupID( '', this.myID );
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
    this.randomizerGroupList.forEach( g => g.selected = false );
    this.randomizerGroupList[index].selected = true;
    $event.stopPropagation();
  }

  backgroundClicked() {
    this.resetSignInForm();
    this.randomizerGroupList.forEach( g => g.selected = false );
  }

  closeSideNav() {
    this.resetSignInForm();
    this.resetAddGroupForm();
    this.sidenav.close()
  }
}