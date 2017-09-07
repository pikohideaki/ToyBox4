import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { UtilitiesService   } from '../my-library/utilities.service';
import { DataTableComponent } from '../my-library/data-table/data-table.component';

import { FireDatabaseMediatorService } from '../fire-database-mediator.service';

import { PlayerName } from '../classes/player-name';


@Component({
  selector: 'app-players',
  template: `
    <div class="bodyWithPadding">
      <app-data-table *ngIf="receiveDataDone"
          [data]='playersNameList$ | async'
          [columnSettings]='columnSettings' >
      </app-data-table>
      <app-waiting-spinner [done]="receiveDataDone"></app-waiting-spinner>
    </div>
  `,
  styles: [],
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
    private database: FireDatabaseMediatorService
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
