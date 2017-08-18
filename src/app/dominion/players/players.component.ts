import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { UtilitiesService } from '../../utilities.service';
import { DataTableComponent } from '../../data-table/data-table.component';
import { PlayerName } from '../player-name';
import { DominionDatabaseService } from '../dominion-database.service';


@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: [
        '../../data-table/data-table.component.css',
        './players.component.css'
    ]
})
export class PlayersComponent implements OnInit, OnDestroy {

  private alive = true;

  receiveDataDone = false;

  playersNameList$: Observable<{ name: string, name_yomi: string }[]>;

  columnSettings = [
    { name: 'name'     , align: 'l', manip: 'none', button: false, headerTitle: '名前' },
    { name: 'name_yomi', align: 'l', manip: 'none', button: false, headerTitle: '読み' },
  ];



  constructor(
    private utils: UtilitiesService,
    private database: DominionDatabaseService
  ) {
      this.playersNameList$ = this.database.playersNameList$;

      this.playersNameList$
        .first()
        .subscribe( () => this.receiveDataDone = true );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
