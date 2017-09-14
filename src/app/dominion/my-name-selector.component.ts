import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FireDatabaseMediatorService } from '../fire-database-mediator.service';
import { MyUserInfoService } from '../my-user-info.service';

import { PlayerName } from '../classes/player-name';


@Component({
  selector: 'app-my-name-selector',
  template: `
    <div class="margin20">
      <md-select placeholder="自分の名前を選択" [(ngModel)]="myName" (change)="changeMyName( $event.value )" required>
        <md-option *ngFor="let player of playersNameList$ | async" [value]="player.name">
          {{ player.name }}
        </md-option>
      </md-select>
    </div>
  `,
  styles: [],
})
export class MyNameSelectorComponent implements OnInit, OnDestroy {
  private alive: boolean = true;

  playersNameList$: Observable<PlayerName[]>;

  @Input() myName: string;
  @Output() myNameChange = new EventEmitter<string>();

  constructor(
    private database: FireDatabaseMediatorService,
    private myUserInfo: MyUserInfoService
  ) {
    this.playersNameList$ = this.database.playersNameList$;

    this.myUserInfo.name$
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
    this.myUserInfo.setMyName( myName );
    this.myNameChange.emit( myName );
  }

}
