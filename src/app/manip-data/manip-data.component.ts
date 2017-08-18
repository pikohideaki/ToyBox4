import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

// import * as data from './dominionappstest-export.json';

import { UtilitiesService } from '../utilities.service';
import { DominionDatabaseService } from '../dominion/dominion-database.service';
import { CardProperty, CardTypes } from '../dominion/card-property';


@Component({
  providers: [UtilitiesService, DominionDatabaseService],
  selector: 'app-manip-data',
  templateUrl: './manip-data.component.html',
  styleUrls: ['./manip-data.component.css']
})
export class ManipDataComponent implements OnInit {
  printValue: string;
  hrefValue;
  downloadName: string = 'data.json';

  done = false;

  constructor(
    private utils: UtilitiesService,
    private database: DominionDatabaseService,
    private afDatabase: AngularFireDatabase
  ) {
    // console.log( data );
    // this.database.cardPropertyList$
    //   .first()
    //   .subscribe( val => {
    //     // this.afDatabase.object( 'data/cardPropertyListBackup20170814' ).set( val );
    //     const convertedData = this.convertData( val );
    //     // this.createDOMelement( convertedData );
    //     // this.afDatabase.object( 'data/cardPropertyList' ).set( convertedData );
    //     this.done = true;
    //   })
    // this.afDatabase.object( 'syncGroups' )
    //   .first()
    //   .subscribe( val => {
    //     this.afDatabase.object( 'randomizerGroupList' ).set( val );
    //     this.done = true;
    //   })


  }

  ngOnInit() {
  }


  convertData( cardPropertyList: CardProperty[] ) {
    // console.log( this.utils.uniq( cardPropertyList.map( e => e.cardType ) ) );
    const convertedData = cardPropertyList.map( e => Object(e) );
    convertedData.forEach( e => e.implemented = false );

    // const categories = [
    //   { category : 'Curse'        , name: '呪い' },
    //   { category : 'Action'       , name: 'アクション' },
    //   { category : 'Treasure'     , name: '財宝' },
    //   { category : 'Victory'      , name: '勝利点' },
    //   { category : 'Attack'       , name: 'アタック' },
    //   { category : 'Reaction'     , name: 'リアクション' },
    //   { category : 'Duration'     , name: '持続' },
    //   { category : 'Ruins'        , name: '廃墟' },
    //   { category : 'Prize'        , name: '褒賞' },
    //   { category : 'Looter'       , name: '略奪者' },
    //   { category : 'Shelter'      , name: '避難所' },
    //   { category : 'Knights'      , name: '騎士' },
    //   { category : 'Reserve'      , name: 'リザーブ' },
    //   { category : 'Traveller'    , name: 'トラベラー' },
    //   { category : 'Castle'       , name: '城' },
    //   { category : 'Gather'       , name: '集合' },
    //   { category : 'EventCards'   , name: 'イベント' },
    //   { category : 'LandmarkCards', name: 'ランドマーク' },
    // ];

    // convertedData.forEach( e => {
    //   e.cardTypes = new CardTypes();
    //   categories.forEach( val =>
    //     e.cardTypes[ val.category ] = this.utils.submatch( e.cardType, val.name ) );
    // });

    return convertedData;
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
