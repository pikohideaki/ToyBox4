import { Component } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { MyUserInfoService } from './my-user-info.service';
import { AutoBackupOnFirebaseService } from './auto-backup-on-firebase.service';


@Component({
  providers: [AutoBackupOnFirebaseService],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  signedIn$: Observable<boolean>;
  myDisplayName$: Observable<string>;

  constructor(
    private snackBar: MdSnackBar,
    private afAuth: AngularFireAuth,
    private myUserInfo: MyUserInfoService,
    private autoBackup: AutoBackupOnFirebaseService,
  ) {
    this.myDisplayName$ = myUserInfo.myDisplayName$;
    this.signedIn$ = this.myUserInfo.signedIn$;

    this.autoBackup.checkAndExecuteBackup();
  }

  logout() {
    if ( !this.afAuth.auth.currentUser ) return;
    this.afAuth.auth.signOut()
    .then( () => this.openSnackBar('Successfully signed out!') );
  }

  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }

}
