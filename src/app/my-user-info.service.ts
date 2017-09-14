import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireAuth } from 'angularfire2/auth';

import { UserInfo } from './classes/user-info';
import { FireDatabaseMediatorService } from './fire-database-mediator.service';


@Injectable()
export class MyUserInfoService {
  private myID: string = '';
  myID$:          Observable<string>;
  signedIn$:      Observable<boolean>;
  myDisplayName$: Observable<string>;

  private myUserInfo$: Observable<UserInfo>;
  name$:               Observable<string>;
  randomizerGroupID$:  Observable<string>;
  onlineGame: {
    isSelectedExpansions$: Observable<boolean[]>,
    numberOfPlayers$:      Observable<number>,
    roomID$:               Observable<string>,
    gameStateID$:          Observable<string>,
  }

  signedInToRandomizerGroup$: Observable<boolean>;



  constructor(
    private afAuth: AngularFireAuth,
    private database: FireDatabaseMediatorService,
  ) {
    this.signedIn$      = this.afAuth.authState.map( user => !!user );
    this.myID$          = this.afAuth.authState.map( user => ( !user ? '' : user.uid) );
    this.myDisplayName$ = this.afAuth.authState.map( user => ( !user ? '' : user.displayName ) );

    this.myUserInfo$ = Observable.combineLatest(
        this.myID$,
        this.database.userInfoList$,
        ( myID: string, userInfoList: UserInfo[] ) =>
          (!myID || userInfoList.length === 0) ? new UserInfo()
                                               : userInfoList.find( e => e.databaseKey === myID ) );

    this.name$              = this.myUserInfo$.map( e => e.name              ).distinctUntilChanged();
    this.randomizerGroupID$ = this.myUserInfo$.map( e => e.randomizerGroupID ).distinctUntilChanged();
    this.onlineGame = {
      numberOfPlayers$    : this.myUserInfo$.map( e => e.onlineGame.numberOfPlayers    ).distinctUntilChanged(),
      roomID$             : this.myUserInfo$.map( e => e.onlineGame.roomID             ).distinctUntilChanged(),
      gameStateID$        : this.myUserInfo$.map( e => e.onlineGame.gameStateID        ).distinctUntilChanged(),
      isSelectedExpansions$ : this.myUserInfo$.map( e => e.onlineGame.isSelectedExpansions ).distinctUntilChanged(),
    }

    this.signedInToRandomizerGroup$ = this.randomizerGroupID$.map( groupID => !!groupID );

    this.myID$.subscribe( val => this.myID = val );
  }


  setMyName( value: string ) {
    if ( !this.myID ) return Promise.resolve();
    return this.database.userInfo.set.name( this.myID, value );
  }

  setRandomizerGroupID( value: string ) {
    if ( !this.myID ) return Promise.resolve();
    return this.database.userInfo.set.randomizerGroupID( this.myID, value );
  }

  setOnlineGameIsSelectedExpansions( value: boolean[] ) {
    if ( !this.myID ) return Promise.resolve();
    return this.database.userInfo.set.onlineGame.isSelectedExpansions( this.myID, value );
  }

  setOnlineGameNumberOfPlayers( value: number ) {
    if ( !this.myID ) return Promise.resolve();
    return this.database.userInfo.set.onlineGame.numberOfPlayers( this.myID, value );
  }

  setOnlineGameRoomID( value: string ) {
    if ( !this.myID ) return Promise.resolve();
    return this.database.userInfo.set.onlineGame.roomID( this.myID, value );
  }

  setOnlineGameStateID( value: string ) {
    if ( !this.myID ) return Promise.resolve();
    return this.database.userInfo.set.onlineGame.gameStateID( this.myID, value );
  }

}
