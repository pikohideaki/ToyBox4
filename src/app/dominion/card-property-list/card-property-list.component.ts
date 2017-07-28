import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeWhile';

import { MdDialog } from '@angular/material';


import { MyUtilitiesService } from '../../my-utilities.service';
import { MyDataTableComponent } from '../../my-data-table/my-data-table.component';

import { DominionDatabaseService } from '../dominion-database.service';

import { CardProperty } from '../card-property';
import { CardPropertyDialogComponent } from '../card-property-dialog/card-property-dialog.component';



@Component({
  selector: 'app-card-property-list',
  templateUrl: './card-property-list.component.html',
  styleUrls: [ './card-property-list.component.css' ]
})
export class CardPropertyListComponent implements OnInit, OnDestroy {

  getDataDone = false;
  private alive: boolean = true;

  private cardPropertyListForView: any[] = [];
  public cardPropertyListForView$: Observable< any >;

  public columnSettings = [
    { name: 'no'                  , align: 'c', manip: 'none'             , button: false, headerTitle: 'No.' },
    { name: 'name_jp'             , align: 'c', manip: 'incrementalSearch', button: true , headerTitle: '名前' },
    { name: 'name_eng'            , align: 'c', manip: 'incrementalSearch', button: false, headerTitle: 'Name' },
    { name: 'DominionSetName'     , align: 'c', manip: 'filterBySelecter' , button: false, headerTitle: 'セット名' },
    { name: 'category'            , align: 'c', manip: 'filterBySelecter' , button: false, headerTitle: '分類' },
    { name: 'cardType'            , align: 'c', manip: 'filterBySelecter' , button: false, headerTitle: '種別' },
    { name: 'costStr'             , align: 'c', manip: 'none'             , button: false, headerTitle: 'コスト' },
    { name: 'VP'                  , align: 'c', manip: 'none'             , button: false, headerTitle: 'VP' },
    { name: 'drawCard'            , align: 'c', manip: 'none'             , button: false, headerTitle: '+card' },
    { name: 'action'              , align: 'c', manip: 'none'             , button: false, headerTitle: '+action' },
    { name: 'buy'                 , align: 'c', manip: 'none'             , button: false, headerTitle: '+buy' },
    { name: 'coin'                , align: 'c', manip: 'none'             , button: false, headerTitle: '+coin' },
    { name: 'VPtoken'             , align: 'c', manip: 'none'             , button: false, headerTitle: '+VPtoken' },
    { name: 'implemented'         , align: 'c', manip: 'filterBySelecter' , button: false, headerTitle: 'ゲーム実装状況' },
    { name: 'randomizerCandidate' , align: 'c', manip: 'filterBySelecter' , button: false, headerTitle: 'ランダマイザー対象' },
  ];




  constructor(
    private utils: MyUtilitiesService,
    public dialog: MdDialog,
    private database: DominionDatabaseService,
  ) {
    this.cardPropertyListForView$
      = this.database.cardPropertyList$
          .map( list => list.map( cardProperty => cardProperty.transform() ) );

    this.cardPropertyListForView$
      .takeWhile( () => this.alive )
      .subscribe( val => {
        this.getDataDone = true;
        this.cardPropertyListForView = val;
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }

  showDetail( dataIndex: number ) {
    const dialogRef = this.dialog.open( CardPropertyDialogComponent );
    dialogRef.componentInstance.card = this.cardPropertyListForView[dataIndex];
  }
}

