import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


import { MyUtilitiesService } from '../../../my-utilities.service';
import { MyFirebaseSubscribeService } from "../../my-firebase-subscribe.service";
// import { GameResult } from "../../game-result";
import { SelectedCards } from "../../selected-cards";
import { SyncGroup } from "../sync-group";
// import { PlayerName } from "../../player-name";
import { UserInfo } from "../../../user-info";


@Component({
  providers: [ MyUtilitiesService, MyFirebaseSubscribeService ],
  selector: 'app-sync-groups',
  templateUrl: './sync-groups.component.html',
  styleUrls: ['./sync-groups.component.css']
})
export class SyncGroupsComponent implements OnInit, OnDestroy {

  @Input() DominionSetList: { name: string, selected: boolean }[] = [];
  @Input() SelectedCards: SelectedCards = new SelectedCards(); 
  @Input() sidenav;

  syncGroups: { id: string, selected: boolean, data: SyncGroup }[] = [];
  users: UserInfo[] = [];

  me: Observable<firebase.User>;
  myID: string;
  signedIn: boolean = false;

  // bind to form element
  newGroupName: string;
  newGroupPassword: string;
  signInPassword: string;
  showWrongPasswordAlert: boolean = false;

  subscriptions = [];

  constructor(
    public snackBar: MdSnackBar,
    public utils: MyUtilitiesService,
    private afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService,
    public afAuth: AngularFireAuth
  ) {
    this.me = afAuth.authState;
    this.subscriptions.push(
      this.me.subscribe( val => {
        this.signedIn = !!val;
        this.myID = ( this.signedIn ? val.uid : "" );
      })
    );

    this.subscriptions.push(
      this.afDatabase.list("/userInfo").subscribe( val => {
        this.users = val.map( e => new UserInfo(e) );
      })
    );

    this.subscriptions.push(
      this.afDatabase.list("/syncGroups", { preserveSnapshot: true }).subscribe( snapshots => {
        this.syncGroups = this.afDatabaseService.convertAs( snapshots, "syncGroups" );
      })
    );
  }

  ngOnInit() {
  }


  ngOnDestroy() {
    this.subscriptions.forEach( e => e.unsubscribe() );
  }


  getUserNamesInGroup( groupID ) {
    return this.users.filter( user => user.dominionGroupID === groupID ).map( user => user.name );
  }

  updateMyGroupID( groupID ) {
    const me = this.users.find( user => user.id === this.myID );
    me.dominionGroupID = groupID;
    this.afDatabase.list("/userInfo").update( this.myID, me )
  }

  addSyncGroup() {
    const newGroup = new SyncGroup({
      name                 : this.newGroupName,
      password             : this.newGroupPassword,
      timeStamp            : Date.now(),
      SelectedCards        : this.SelectedCards,
      DominionSetsSelected : this.DominionSetList.map( e => e.selected ),
    });
    const groupID = this.afDatabase.list("/syncGroups").push( newGroup ).key;
    this.updateMyGroupID( groupID );
    this.removeMemberEmptyGroup();
  }

  groupClicked( $event, index: number ) {
    this.syncGroups.forEach( g => g.selected = false );
    this.syncGroups[index].selected = true;
    $event.stopPropagation();
  }

  backgroundClicked() {
    this.syncGroups.forEach( g => g.selected = false );
  }

  signInPasswordIsValid( groupID ): boolean {
    let isValid = ( this.signInPassword === this.syncGroups.find( g => g.id === groupID ).data.password );
    this.showWrongPasswordAlert = !isValid;
    return isValid;
  }

  signIn( groupID ) {
    if ( !this.signInPasswordIsValid( groupID ) ) return;
    this.updateMyGroupID( groupID );
    this.openSnackBar("Successfully signed in!");
    this.removeMemberEmptyGroup();
    this.signInPassword = undefined;
    this.sidenav.close();
  }

  signOut( groupID ) {
    if ( !this.signInPasswordIsValid( groupID ) ) return;
    this.updateMyGroupID( "" );
    this.openSnackBar("Successfully signed out!");
    this.removeMemberEmptyGroup();
    this.signInPassword = undefined;
    this.sidenav.close();
  }

  removeMemberEmptyGroup() {
    setTimeout(
      () => this.syncGroups
              .filter( g => this.users.findIndex( user => user.dominionGroupID === g.id ) === -1 )
              .forEach( g => this.afDatabase.list("/syncGroups").remove( g.id ) )
      , 3000 );
  }

  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }

}
