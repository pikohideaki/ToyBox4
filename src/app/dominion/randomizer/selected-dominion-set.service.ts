import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { MyUtilitiesService } from '../../my-utilities.service';
import { DominionDatabaseService } from '../dominion-database.service';
import { MySyncGroupService } from './my-sync-group.service';

@Injectable()
export class SelectedDominionSetService {

  private selectedDominionSetMergedSources
    = new ReplaySubject<{ index: number, checked: boolean }>();
  public selectedDominionSetMerged$ = this.selectedDominionSetMergedSources.asObservable();
  public selectedDominionSet$;

  constructor(
    private utils: MyUtilitiesService,
    private database: DominionDatabaseService,
    private mySyncGroup: MySyncGroupService
  ) {
    this.selectedDominionSet$ = this.mySyncGroup.selectedDominionSet$();
    this.database.DominionSetNameList$
      .first()
      .subscribe( list =>
        this.utils.numberSequence( 0, list.length ).forEach( idx => {
          this.selectedDominionSetMergedSources.next({ index: idx, checked: true });
          this.mySyncGroup.selectedDominionSet$( idx ).subscribe( val => {
            if ( val === undefined || val === null ) return;
            this.selectedDominionSetMergedSources.next({ index: idx, checked: val });
          });
        })
      );
  }


  changeSelectedDominionSet( value: boolean, index: number ) {
    this.selectedDominionSetMergedSources.next({ index: index, checked: value });
    this.mySyncGroup.setSelectedDominionSet( value, index );
  }

}
