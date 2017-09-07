import { Component } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';

import { MyUserInfoService } from './my-user-info.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    public snackBar: MdSnackBar,
    public afAuth: AngularFireAuth,
    public myUserInfo: MyUserInfoService,
  ) {
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
