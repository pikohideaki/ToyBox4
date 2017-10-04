import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MyUserInfoService } from '../../my-user-info.service';


@Component({
  providers: [],
  selector: 'app-online-game',
  templateUrl: './online-game.component.html',
  styleUrls: ['./online-game.component.css']
})
export class OnlineGameComponent implements OnInit {

  signedIn$: Observable<boolean>;
  myName: string;

  constructor(
    private myUserInfo: MyUserInfoService
  ) {
    this.signedIn$ = this.myUserInfo.signedIn$;
  }

  ngOnInit() {
  }

}
