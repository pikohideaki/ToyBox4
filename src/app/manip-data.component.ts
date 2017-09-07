import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

// import * as data from './dominionappstest-export.json';

import { UtilitiesService } from './my-library/utilities.service';
import { FireDatabaseMediatorService } from './fire-database-mediator.service';
import { CardProperty, CardTypes } from './classes/card-property';


@Component({
  providers: [UtilitiesService, FireDatabaseMediatorService],
  selector: 'app-manip-data',
  template: `
    <!-- <div class="bodyWithPadding" id="export-link"></div>
    <span *ngIf="done">Done.</span> -->
    <button md-raised-button (click)="addElement()">add</button>
    <ul>
      <li>
        <md-checkbox>checkbox test</md-checkbox>
      </li>
      <li *ngFor="let element of list$ | async">
        <md-checkbox
            [checked]="chbxVal[ element.id ]"
            (change)="onCheck(element.id, $event.checked)" >
          {{element.name}}
        </md-checkbox>
      </li>
    </ul>
  `,
  styles: [],
})
export class ManipDataComponent implements OnInit {
  alive: boolean = true;

  checkboxValueDir = 'testCheckboxValue';
  list$: Observable< { id: string, name: string }[] >;
  chbxVal = {};

  done = false;
  printValue: string;
  hrefValue;
  downloadName: string = 'data.json';


  constructor(
    private utils: UtilitiesService,
    private database: FireDatabaseMediatorService,
    private afDatabase: AngularFireDatabase
  ) {
    this.list$
      = this.afDatabase.list( 'test', { preserveSnapshot: true } )
          .map( snapshots => snapshots.map( e => ({ id: e.key, name: e.val() }) ) );

    this.afDatabase.object( this.checkboxValueDir )
      .takeWhile( () => this.alive )
      .subscribe( val => this.chbxVal = val );
  }

  ngOnInit() {
  }

  onCheck( key: string, value: boolean ) {
    this.afDatabase.object(`${this.checkboxValueDir}/${key}`).set( value );
  }

  addElement() {
    console.log('added 100 elements');
    for ( let i = 0; i < 100; ++i ) {
      this.afDatabase.list( 'test' ).push( 'element' + i );
    }
  }

  createDOMelement( content ) {
    const blob = new Blob([ JSON.stringify( content, null, 2 ) ], { type: 'text/plain' });
    // const blob = new Blob([ JSON.stringify( content, null, '  ' ) ], { type: 'text/plain' });

    const a = document.createElement('a');
    a.textContent = 'export'
    a.href = window.URL.createObjectURL( blob );
    a.download = 'data.json';
    a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');

    const exportLink = document.getElementById('export-link');
    exportLink.appendChild(a);
  }

}
