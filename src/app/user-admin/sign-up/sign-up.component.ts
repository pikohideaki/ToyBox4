import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

import { DominionDatabaseService } from '../../dominion/dominion-database.service';

import { UserInfo } from '../../user-info';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  waitingForResponse = false;

  email: string;
  password: string;
  displayName: string;

  errorMessageForEmail: string;
  errorMessageForPassword: string;


  constructor(
    public snackBar: MdSnackBar,
    public afAuth: AngularFireAuth,
    private router: Router,
    private location: Location,
    private database: DominionDatabaseService
  ) {
  }

  ngOnInit() {
  }

  signUp() {
    this.errorMessageForEmail = '';
    this.errorMessageForPassword = '';

    this.waitingForResponse = true;
    this.afAuth.auth.createUserWithEmailAndPassword( this.email, this.password )
    .then( afUser => {
      this.waitingForResponse = false;
      this.setDisplayName();

      this.database.updateUserInfo( afUser.uid, new UserInfo({
          databaseKey     : afUser.uid,
          id              : afUser.uid,
          name            : this.displayName,
          DominionGroupID : '',
        }) );

      this.location.back();
      this.openSnackBar('Successfully logged in!');
    } )
    .catch( (error: any ) => {
      this.waitingForResponse = false;

      switch ( error.code ) {
        case 'auth/email-already-in-use' :
          this.errorMessageForEmail = error.message;
          break;
        case 'auth/invalid-email' :
          this.errorMessageForEmail = error.message;
          break;
        case 'auth/operation-not-allowed' :
          this.errorMessageForEmail = error.message;
          break;
        case 'auth/weak-password' :
          this.errorMessageForPassword = error.message;
          break;
        default :
          this.errorMessageForEmail = error.message;
          break;
      }
    } );
  }

  private setDisplayName() {
    this.afAuth.auth.currentUser.updateProfile( { displayName: this.displayName, photoURL: '' } );
  }


  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }
}
