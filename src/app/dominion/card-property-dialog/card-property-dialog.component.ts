import { Component, OnInit } from '@angular/core';

import { MdDialogRef } from '@angular/material';


@Component({
  selector: 'app-card-property-dialog',
  templateUrl: './card-property-dialog.component.html',
  styleUrls: ['./card-property-dialog.component.css']
})
export class CardPropertyDialogComponent implements OnInit {

  public card: any;
  faceUp: boolean = true;
  width: number;

  public items = [
    { memberName: 'no'                      , name: 'Card No.' },
    { memberName: 'name_jp'                 , name: '和名' },
    { memberName: 'name_jp_yomi'            , name: '読み' },
    { memberName: 'name_eng'                , name: '英名' },
    { memberName: 'DominionSetName'         , name: 'セット' },
    { memberName: 'cost_coin'               , name: 'コスト（コイン）' },
    { memberName: 'cost_potion'             , name: 'コスト（ポーション）' },
    { memberName: 'cost_debt'               , name: 'コスト（借金）' },
    { memberName: 'category'                , name: '種類' },
    { memberName: 'cardType'                , name: '属性' },
    { memberName: 'VP'                      , name: 'VP' },
    { memberName: 'drawCard'                , name: '+Draw Cards' },
    { memberName: 'action'                  , name: '+Action' },
    { memberName: 'buy'                     , name: '+Buy' },
    { memberName: 'coin'                    , name: '+Coin' },
    { memberName: 'VPtoken'                 , name: '+VP-token' },
    { memberName: 'effect'                  , name: '効果' },
    { memberName: 'description'             , name: '説明' },
    { memberName: 'recommendedCombination'  , name: '推奨の組み合わせ' },
    { memberName: 'memo'                    , name: 'メモ' },
    { memberName: 'implemented'             , name: 'オンラインゲーム実装状況' },
  ];



  constructor(
    public dialogRef: MdDialogRef<CardPropertyDialogComponent>,
  ) {}

  ngOnInit() {
    this.width = this.setImageWidth();
  }

  /**
   * innerHeight, innerWidth : app window size
   * outerHeight, outerWidth : browser window size
   */
  setImageWidth() {

    const padding = 24;

    const modalWidth = 0.8 * innerWidth;
    const correction1 = 30;  // 補正
    const w1 = 0.4 * (modalWidth - padding * 2) - correction1;

    const modalHeight = 0.8 * innerHeight;
    const correction2 = 150;  // 補正
    const w2 = 75 / 115 * ((modalHeight - padding * 2) - correction2);

    return Math.min( w1, w2 );
  }


}

