import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PlayerName } from '../player-name';
import { DominionDatabaseService } from '../dominion-database.service';
import { MyUserInfoService } from '../../my-user-info.service';


@Component({
  selector: 'app-my-name-selector',
  templateUrl: './my-name-selector.component.html',
  styleUrls: ['./my-name-selector.component.css']
})
export class MyNameSelectorComponent implements OnInit, OnDestroy {
  private alive: boolean = true;
  receiveDataDone: boolean = false;

  playersNameList$: Observable<PlayerName[]>;

  @Input() myName: string;
  @Output() myNameChange = new EventEmitter<string>();

  constructor(
    private database: DominionDatabaseService,
    private myUserInfo: MyUserInfoService
  ) {
    this.playersNameList$ = this.database.playersNameList$;

    this.myUserInfo.myPlayerName$
      .takeWhile( () => this.alive )
      .subscribe( val => {
        this.myName = val;
        this.myNameChange.emit( val );
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }

  changeMyName( myName: string ) {
    this.myUserInfo.setMyPlayerName( myName );
    this.myNameChange.emit( myName );
  }

}
