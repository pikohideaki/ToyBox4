/**
 * Automatically create a backup on firebase once a day at maximum when logging in.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';


import { toYMD, isToday } from './my-library/utilities';


@Injectable()
export class AutoBackupOnFirebaseService {

  private autoBackupDir = '/autoBackup';
  private latestBackupDatePath = this.autoBackupDir + '/latestBackupDate';

  private fdPath = {
    userInfoList        : '/userInfoList',
    playersNameList     : '/data/playersNameList',
    scoringList         : '/data/scoringList',
    gameResultList      : '/data/gameResultList',
    randomizerGroupList : '/randomizerGroupList',
    onlineGameStateList : '/onlineGameStateList',
    onlineGameRoomsList : '/onlineGameRoomsList',
  };


  constructor(
    private afdb: AngularFireDatabase
  ) {
  }


  async checkAndExecuteBackup() {
    const latestBackupDate = await this.getLatestBackupDate();
    if ( !isToday( latestBackupDate ) ) {
      this.createBackup();
    }
  }

  private async getLatestBackupDate() {
    const date = await this.afdb.object( this.latestBackupDatePath ).first().toPromise();
    return new Date( date.$value );
  }


  private updateLatestBackupDate() {
    return this.afdb.object( this.latestBackupDatePath ).set( (new Date()).toString() );
  }


  private createBackup() {
    console.log('created backup');
    this.updateLatestBackupDate();

    const dateString = toYMD( new Date(), '' );

    Object.keys( this.fdPath ).forEach( key => {
      const sourcePath = this.fdPath[key];
      const distPathPrefix = `${this.autoBackupDir}/index/${dateString}`;
      this.afdb.object( sourcePath ).first().toPromise()
        .then( val => {
          if ( !val.$exists() ) return;
          this.afdb.object(`${distPathPrefix}${sourcePath}`).set( val );
        });
    })
  }

}
