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
  `,
/*     <div class="bodyWithPadding" id="export-link"></div>
    <span *ngIf="done">Done.</span> */
/*     <button md-raised-button (click)="addElement()">add</button>
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
    </ul> */
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
    // this.backup();
    // this.setNewData();
    this.convert();
    // this.promiseTest();
    // this.listtest();
  }

  ngOnInit() {
  }


  setNewData = async () => {
    console.log('start');
    // let data;
    // data = await this.afDatabase.object('/newData/data/expansionsNameList').first().toPromise();
    // await this.afDatabase.object('/data/expansionsNameList').set( data );
    console.log('done')
  }

  backup = async () => {
    console.log('start')
    // let data;
    // data = await this.afDatabase.object('/data').first().toPromise();
    // await this.afDatabase.object('/backup/20170913/data').set( data );
    // data = await this.afDatabase.object('/syncGroups').first().toPromise();
    // await this.afDatabase.object('/backup/20170913/syncGroups').set( data );
    // data = await this.afDatabase.object('/userInfo').first().toPromise();
    // await this.afDatabase.object('/backup/20170913/userInfo').set( data );
    console.log('done')
  }

  convert = async () => {
    console.log('start');
    const expansionsNameList
      = await this.afDatabase.object('/data/expansionsNameList').first().toPromise()
    const today = '20170914';
    const gameResultList
      = await this.afDatabase.object(`/autoBackup/index/${today}/data/gameResultList`).first().toPromise();

    Object.keys( gameResultList ).forEach( key => {
      const selectedExpansions = expansionsNameList.filter( (_, i) => gameResultList[key].selectedExpansions[i] );
      this.afDatabase.object(`/data/gameResultList/${key}/selectedExpansions`).set( selectedExpansions );
    });

/*
    for ( let i = 0; i < 192; ++i ) {
      this.afDatabase.object(`/data/cardPropertyList/${i}/linkId`).set( i + 1 );
    }
    for ( let i = 193; i < 216; ++i ) {
      this.afDatabase.object(`/data/cardPropertyList/${i}/linkId`).set( i );
    }
    for ( let i = 217; i < 305; ++i ) {
      this.afDatabase.object(`/data/cardPropertyList/${i}/linkId`).set( i - 1 );
    }
    for ( let i = 306; i < 389; ++i ) {
      this.afDatabase.object(`/data/cardPropertyList/${i}/linkId`).set( i - 2 );
    }
 */
    // const gameResultList = await this.afDatabase.object('/data/gameResultList').first().toPromise();

/*
    const gameResultList = await this.afDatabase.object('/data/gameResultList').first().toPromise();
    console.log(gameResultList)
    Object.keys( gameResultList ).forEach( key => {
      this.afDatabase.object(`/data/gameResultList/${key}/dateString`).set( gameResultList[key].date )
      .then( () => this.afDatabase.object(`/data/gameResultList/${key}/date`).remove() );
    });
 */
    /*
    this.afDatabase.object('/data/cardPropertyList').first().subscribe( obj => {
      this.afDatabase.object('/data/cardPropertyList_bk20170911').set(obj);
    });
    this.afDatabase.object('/data/gameResultList').first().subscribe( obj => {
      this.afDatabase.object('/data/gameResultList_bk20170911').set(obj);
    });
    this.afDatabase.object('/data/DominionSetNameList').first().subscribe( obj => {
      this.afDatabase.object('/data/DominionSetNameList_bk20170911').set(obj);
      this.afDatabase.object('/data/expansionsNameList').set(obj);
    });
 */
/*
    this.afDatabase.list('/data/cardPropertyList_bk20170911').first().subscribe( list => {
      this.afDatabase.object('/data/cardPropertyList').set(
        list.map( cardProperty => {
          const obj = Object(cardProperty);
          obj.expansionName = obj.DominionSetName;
          delete obj.DominionSetName;
          return obj;
        }) );
    });
 */

/*
    this.afDatabase.object('/backup/20170911/data/gameResultList').first().subscribe( object => {
      Object.keys(object).forEach( key => {
        const newObj = Object( object[key] );
        newObj.selectedExpansions = newObj.DominionSetSelected;
        delete newObj.DominionSetSelected;
        this.afDatabase.object(`/data/gameResultList/${key}`).set(newObj);
      })
    });
 */


    // this.afDatabase.object('/userInfoList').first().subscribe( obj => {
    //   this.afDatabase.object('/userInfoList_bk').set(obj);
    // });
    // this.afDatabase.object('/userInfoList_bk').first().subscribe( obj => {
    //   Object.keys(obj).forEach( key => {
        // this.afDatabase.object(`/userInfoList/${key}/databaseKey`).remove() )
        // this.afDatabase.object(`/userInfoList/${key}/DominionSetSelected_OnlineGame`).remove();
        // this.afDatabase.object(`/userInfoList/${key}/onlineGame/DominionSetSelected`)
        //     .set(obj[key].DominionSetSelectedForOnlineGame);
        // this.afDatabase.object(`/userInfoList/${key}/numberOfPlayersForOnlineGame`).remove();
        // this.afDatabase.object(`/userInfoList/${key}/onlineGame/numberOfPlayers`)
        //     .set(obj[key].numberOfPlayersForOnlineGame);
        // this.afDatabase.object(`/userInfoList/${key}/onlineGameRoomID`).remove();
        // this.afDatabase.object(`/userInfoList/${key}/onlineGame/roomID`)
        //     .set(obj[key].onlineGameRoomID);
        // this.afDatabase.object(`/userInfoList/${key}/onlineGameStateID`).remove();
        // this.afDatabase.object(`/userInfoList/${key}/onlineGame/gameStateID`)
        //     .set(obj[key].onlineGameStateID);
        // })
        // onlineGame : {} の中にまとめる
    // });
    // this.afDatabase.object('/onlineGameState').first().subscribe( obj => {
    //   this.afDatabase.object('/onlineGameStateList').set( obj )
    //   .then( () => this.afDatabase.object('/onlineGameState').remove() );
    // });
    // this.afDatabase.object('/onlineGameRooms').first().subscribe( obj => {
    //   this.afDatabase.object('/onlineGameRoomsList').set( obj )
    //   .then( () => this.afDatabase.object('/onlineGameRooms').remove() );
    // });
    // this.afDatabase.object('/data/gameResultList_bk').first().subscribe( obj =>
    //   Object.keys(obj).forEach( key => {
        // ( async () => {
        //   await this.afDatabase.object(`/data/gameResultList/${key}/DominionSetSelected`).remove()
        // })();
      // }
        // this.afDatabase.object(`/data/gameResultList/${key}/DominionSetSelected`).remove()
        // .then( () =>
        //   this.afDatabase.object(`/data/gameResultList/${key}/DominionSetSelected`)
        //     .set( obj[key].DominionSetSelected ) )
        // this.afDatabase.object(`/data/gameResultList/${key}/players`).set(
        //   obj[key].players.map( e => ({
        //     name: e.name,
        //     VP: e.VP,
        //     winByTurn: e.lessTurns,
        //   }) ) ) ) );
    // ))
    console.log('done')
  };

  // onCheck( key: string, value: boolean ) {
  //   this.afDatabase.object(`${this.checkboxValueDir}/${key}`).set( value );
  // }

  // addElement() {
  //   console.log('added 100 elements');
  //   for ( let i = 0; i < 100; ++i ) {
  //     this.afDatabase.list( 'test' ).push( 'element' + i );
  //   }
  // }

  promiseTest = async () => {
    console.log('start')
    // const array = new Array(100000).fill(0);
    // await this.afDatabase.list('/testData').push( array );

    // await this.afDatabase.list('/testData').remove();

    // const promise = this.afDatabase.object('/testData').first().toPromise();
    // let data;
    // for ( let i = 0; i < 5; ++i ) {
    //   data = await promise;
    //   console.log(i)
    // }

    console.log('done')
  }

  listtest() {
    // this.list$
    //   = this.afDatabase.list( 'test', { preserveSnapshot: true } )
    //       .map( snapshots => snapshots.map( e => ({ id: e.key, name: e.val() }) ) );

    // this.afDatabase.object( this.checkboxValueDir )
    //   .takeWhile( () => this.alive )
    //   .subscribe( val => this.chbxVal = val );
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
