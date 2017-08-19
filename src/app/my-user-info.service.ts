import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { UserInfo } from './user-info';
import { DominionDatabaseService } from './dominion/dominion-database.service';



@Injectable()
export class MyUserInfoService {
  private myID: string = '';
  myID$: Observable<string>;
  signedIn$: Observable<boolean>;
  myUserInfo$: Observable<UserInfo>;
  myName$: Observable<string>;
  myRandomizerGroupID$: Observable<string>;
  numberOfPlayersForOnlineGame$: Observable<number>;
  onlineGameRoomID$: Observable<string>;
  onlineGameStateID$: Observable<string>;
  DominionSetToggleValuesForOnlineGame$: Observable<boolean[]>;


  constructor(
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private database: DominionDatabaseService
  ) {
    this.myID$ = this.afAuth.authState.map( user => (!user ? '' : user.uid) );
    this.myID$.subscribe( val => this.myID = val );
    this.signedIn$ = this.afAuth.authState.map( e => !!e );

    this.myUserInfo$ = Observable.combineLatest(
        this.myID$,
        this.database.userInfoList$,
        ( myID: string, userInfoList: UserInfo[] ) =>
          ( (!myID || userInfoList.length === 0) ? new UserInfo()
                                                 : userInfoList.find( e => e.id === myID ) ) );

    this.myName$
      = this.myUserInfo$.map( e => e.name );

    this.myRandomizerGroupID$
      = this.myUserInfo$.map( e => e.randomizerGroupID );

    this.numberOfPlayersForOnlineGame$
      = this.myUserInfo$.map( e => e.numberOfPlayersForOnlineGame );

    this.onlineGameRoomID$
      = this.myUserInfo$.map( e => e.onlineGameRoomID );

    this.onlineGameStateID$
      = this.myUserInfo$.map( e => e.onlineGameStateID );

    // Dominion Online
    this.DominionSetToggleValuesForOnlineGame$ = Observable.combineLatest(
      this.myUserInfo$,
        this.database.DominionSetNameList$,
        (myUserInfo, setList) => {
          const falseArray = setList.map( () => false );
          const ar = myUserInfo.DominionSetsSelectedForOnlineGame;
          if ( !ar || ar.length < setList.length ) {
            this.setDominionSetsSelectedForOnlineGame( falseArray );  // initialize
            return falseArray;
          }
          return ar;
        });

  }



  private setValue( pathSuffix: string, value ) {
    if ( this.myID === '' ) return Promise.resolve();
    return this.afDatabase.object( `/userInfoList/${this.myID}/${pathSuffix}` ).set( value );
  }



  setMyName( name: string ) {
    return this.setValue( 'name', name );
  }

  setRandomizerGroupID( value: string ) {
    return this.setValue( 'randomizerGroupID', value );
  }

  setDominionSetsSelectedForOnlineGame( value: boolean[] ) {
    return this.setValue( 'DominionSetsSelectedForOnlineGame', value );
  }

  setNumberOfPlayersForOnlineGame( value: number ) {
    return this.setValue( 'numberOfPlayersForOnlineGame', value );
  }

  setOnlineGameRoomID( value: string ) {
    return this.setValue( 'onlineGameRoomID', value );
  }

  setOnlineGameStateID( value: string ) {
    return this.setValue( 'onlineGameStateID', value );
  }

}