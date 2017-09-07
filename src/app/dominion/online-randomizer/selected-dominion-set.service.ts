import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { UtilitiesService } from '../../my-library/utilities.service';
import { FireDatabaseMediatorService } from '../../fire-database-mediator.service';
import { MyRandomizerGroupService } from './my-randomizer-group.service';


@Injectable()
export class SelectedDominionSetService {
  DominionSetList$: Observable<{ name: string, checked: boolean }[]>;


  private selectedDominionSetMergedSources
    = new ReplaySubject<{ index: number, checked: boolean }>();
  public selectedDominionSetMerged$ = this.selectedDominionSetMergedSources.asObservable();
  public selectedDominionSet$;

  constructor(
    private utils: UtilitiesService,
    private database: FireDatabaseMediatorService,
    private myRandomizerGroup: MyRandomizerGroupService
  ) {
    this.selectedDominionSet$
      = this.myRandomizerGroup.myRandomizerGroup$.map( e => e.selectedDominionSet );
    this.database.DominionSetNameList$
      .first()
      .subscribe( list =>
        this.utils.numberSequence( 0, list.length ).forEach( idx => {
          this.selectedDominionSetMergedSources.next({ index: idx, checked: true });
          this.myRandomizerGroup.myRandomizerGroup$.map( e => e.selectedDominionSet[idx] )
            .subscribe( val => {
              if ( val === undefined || val === null ) return;
              this.selectedDominionSetMergedSources.next({ index: idx, checked: val });
            });
        })
      );
  }


  changeSelectedDominionSet( value: boolean, index: number ) {
    this.selectedDominionSetMergedSources.next({ index: index, checked: value });
    this.myRandomizerGroup.setDominionSetSelected( index, value );
  }

}
