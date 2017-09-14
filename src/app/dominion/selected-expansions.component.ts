import { Component, OnInit, Input } from '@angular/core';
import { FireDatabaseMediatorService } from '../fire-database-mediator.service';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-selected-expansions',
  template: `
    <md-chip-list>
      <md-chip color="accent"
          *ngFor="let name of (expansionsNameList$ | async); let idx = index"
          [selected]="(isSelectedExpansions$ | async)[idx]" >
        {{name}}
      </md-chip>
    </md-chip-list>
  `,
  styles: []
})
export class SelectedExpansionsComponent implements OnInit {
  expansionsNameList$: Observable<string[]>;
  @Input() selectedExpansions: string[];
  isSelectedExpansions$: Observable<boolean[]>;


  constructor(
   private database: FireDatabaseMediatorService
  ) {
    this.expansionsNameList$ = this.database.expansionsNameList$
  }

  ngOnInit() {
    this.isSelectedExpansions$
      = this.expansionsNameList$.map( namelist =>
            namelist.map( name => this.selectedExpansions.includes(name) ) );
  }

}
