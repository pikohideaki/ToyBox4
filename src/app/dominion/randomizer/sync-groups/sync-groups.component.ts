import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


import { MyUtilitiesService } from '../../../my-utilities.service';
import { DominionDatabaseService } from '../../dominion-database.service';

import { MySyncGroupService } from '../my-sync-group.service';
import { SelectedDominionSetService } from '../selected-dominion-set.service';

import { SelectedCards } from '../../selected-cards';
import { SyncGroup } from '../sync-group';
import { UserInfo } from '../../../user-info';


@Component({
  selector: 'app-sync-groups',
  templateUrl: './sync-groups.component.html',
  styleUrls: ['./sync-groups.component.css']
})
export class SyncGroupsComponent implements OnInit, OnDestroy {

  private alive = true;

  @Input() private sidenav;

  private DominionSetToggleValues: boolean[] = [];

  private selectedCards: SelectedCards = new SelectedCards();

  syncGroups: { id: string, selected: boolean, data: SyncGroup }[] = [];

  private users: UserInfo[] = [];

  private myID: string;

  newGroupName: string;
  newGroupPassword: string;
  signInPassword: string;
  showWrongPasswordAlert = false;


  constructor(
    public snackBar: MdSnackBar,
    public afAuth: AngularFireAuth,
    public utils: MyUtilitiesService,
    private database: DominionDatabaseService,
    private mySyncGroup: MySyncGroupService,
    private selectedDominionSetService: SelectedDominionSetService
  ) {
    afAuth.authState
      .takeWhile( () => this.alive )
      .subscribe( val => this.myID = ( val ? val.uid : '' ) );

    this.database.syncGroups$
      .takeWhile( () => this.alive )
      .subscribe( val => this.syncGroups = val )

    this.database.userInfo$
      .takeWhile( () => this.alive )
      .subscribe( val => this.users = val );

    this.mySyncGroup.selectedCards$()
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
    const isValid = ( this.signInPassword === this.syncGroups.find( g => g.id === groupID ).data.password );
    this.showWrongPasswordAlert = !isValid;
    return isValid;
  }

  private updateMyGroupID( groupID ) {
    return this.database.updateUserGroupID( groupID, this.myID );
  }

  private removeMemberEmptyGroup() {
    const promises = this.syncGroups
            .filter( g => this.users.findIndex( user => user.DominionGroupID === g.id ) === -1 )
            .map( g => this.database.removeSyncGroup( g.id ) )
    return Promise.all( promises );
  }

  private resetAddGroupForm() {
    this.newGroupName = undefined;
    this.newGroupPassword = undefined;
  }

  private resetSignInForm() {
    this.signInPassword = undefined;
  }

  addSyncGroup = async () => {
    const ref = await this.database.addSyncGroup( new SyncGroup({
        name                : this.newGroupName,
        password            : this.newGroupPassword,
        timeStamp           : Date.now(),
        selectedCards       : this.selectedCards,
        selectedDominionSet : this.DominionSetToggleValues,
      }) );
    const groupID = ref.key;
    await this.updateMyGroupID( groupID );
    await this.removeMemberEmptyGroup();
    this.resetAddGroupForm();
  };


  signIn = async ( groupID ) => {
    if ( !this.signInPasswordIsValid( groupID ) ) return;
    await this.updateMyGroupID( groupID );
    await this.removeMemberEmptyGroup();
    this.resetSignInForm();
    this.openSnackBar('Successfully signed in!');
    this.sidenav.close();
  }

  signOut = async ( groupID ) => {
    if ( !this.signInPasswordIsValid( groupID ) ) return;
    await this.updateMyGroupID('');
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
    return this.users.filter( user => user.DominionGroupID === groupID ).map( user => user.name );
  }

  groupClicked( $event, index: number ) {
    this.resetSignInForm();
    this.syncGroups.forEach( g => g.selected = false );
    this.syncGroups[index].selected = true;
    $event.stopPropagation();
  }

  backgroundClicked() {
    this.resetSignInForm();
    this.syncGroups.forEach( g => g.selected = false );
  }

  closeSideNav() {
    this.resetSignInForm();
    this.resetAddGroupForm();
    this.sidenav.close()
  }
}
