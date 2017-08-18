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

  myPlayerName$: Observable<string>;

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
        this.database.userInfoList$,
        this.myID$,
        (userInfoList: UserInfo[], myID) =>
          ( !myID || userInfoList.length === 0 ? new UserInfo() : userInfoList[myID] ) );

    this.myPlayerName$ = this.getObservable( 'playerName' ).map( v => v.$value );

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
          const ar = myUserInfo.DominionSetToggleValuesForOnlineGame;
          if ( !ar || ar.length < setList.length ) {
            this.setDominionSetToggleValuesForOnlineGame( falseArray );  // initialize
            return falseArray;
          }
          return ar;
        });

  }



  private getObservable( pathSuffix: string, asList: boolean = false ): Observable<any> {
    if ( asList ) {
      return this.myID$
          .map( myID => this.afDatabase.list(`/userInfoList/${myID}/${pathSuffix}`) )
          .switch();
    } else {
      return this.myID$
          .map( myID => this.afDatabase.object(`/userInfoList/${myID}/${pathSuffix}`) )
          .switch();
    }
  }

  private setValue( pathSuffix: string, value ) {
    if ( this.myID === '' ) return Promise.resolve();
    return this.afDatabase.object( `/userInfoList/${this.myID}/${pathSuffix}` ).set( value );
  }



  setMyPlayerName( playerName: string ) {
    return this.setValue( 'playerName', playerName );
  }

  setMyRandomizerGroupID( value: string ) {
    return this.setValue( 'myRandomizerGroupID', value );
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

  setDominionSetToggleValuesForOnlineGame( value: boolean[] ) {
    return this.setValue( 'DominionSetToggleValuesForOnlineGame', value );
  }

}
