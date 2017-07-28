import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { UserInfo } from '../user-info';


@Injectable()
export class UserInfoService {

  myID$: Observable<string>;
  myID: string = '';

  mySyncGroupID$;


  constructor(
    private afDatabase: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {
    this.myID$ = this.afAuth.authState.map( user => (!user ? '' : user.uid) );

    this.mySyncGroupID$ = Observable.combineLatest(
        this.afDatabase.object('/userInfo'),
        this.myID$,
        (userInfo: UserInfo, myID) => userInfo[myID].DominionGroupID );

    this.myID$.subscribe( val => this.myID = val );
  }



  private getObservable( pathSuffix: string, asList: boolean = false ): Observable<any> {
    if ( asList ) {
      return this.myID$
          .map( myID => this.afDatabase.list(`/userInfo/${myID}/${pathSuffix}`) )
          .switch();
    } else {
      return this.myID$
          .map( myID => this.afDatabase.object(`/userInfo/${myID}/${pathSuffix}`) )
          .switch();
    }
  }

  private setValue( pathSuffix: string, value ) {
    if ( this.myID === '' ) return Promise.resolve();
    return this.afDatabase.object( `/userInfo/${this.myID}/${pathSuffix}` ).set( value );
  }


  getMyPlayerName$() {
    return this.getObservable( 'playerName' ).map( v => v.$value );
  }

  registerMyPlayerName( playerName: string ) {
    return this.setValue( 'playerName', playerName );
  }
}
