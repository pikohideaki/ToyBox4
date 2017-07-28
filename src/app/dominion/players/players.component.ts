import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MyUtilitiesService } from '../../my-utilities.service';
import { MyDataTableComponent } from '../../my-data-table/my-data-table.component';
import { PlayerName } from '../player-name';
import { DominionDatabaseService } from '../dominion-database.service';


@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: [
        '../../my-data-table/my-data-table.component.css',
        './players.component.css'
    ]
})
export class PlayersComponent implements OnInit, OnDestroy {

  private alive = true;

  getDataDone = false;

  playersNameList$: Observable<{ name: string, name_yomi: string }[]>;

  columnSettings = [
    { name: 'name'     , align: 'l', manip: 'none', button: false, headerTitle: '名前' },
    { name: 'name_yomi', align: 'l', manip: 'none', button: false, headerTitle: '読み' },
  ];



  constructor(
    private utils: MyUtilitiesService,
    private database: DominionDatabaseService
  ) {
      this.playersNameList$ = this.database.playersNameList$;

      this.playersNameList$
        .first()
        .subscribe( () => this.getDataDone = true );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
