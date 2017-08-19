import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-dominion',
  templateUrl: './dominion.component.html',
  styleUrls: ['./dominion.component.css']
})
export class DominionComponent implements OnInit {

  dominionApps: {routerLink: string, inService: boolean, title: string, subtitle: string}[] = [
    { routerLink: '/dominion/online-game'      , inService: true, title: 'Online Game'     , subtitle: 'Dominion オンライン対戦', },
    { routerLink: '/dominion/online-randomizer', inService: true, title: 'Online Randomizer'      , subtitle: 'サプライ生成＆ゲーム結果追加，グループ内同期機能付き', },
    { routerLink: '/dominion/gameresult', inService: true, title: 'Game Result List', subtitle: '成績表', },
    { routerLink: '/dominion/cardlist'  , inService: true, title: 'Card List'       , subtitle: 'カード一覧表', },
    { routerLink: '/dominion/rulebooks' , inService: true, title: 'RuleBooks'       , subtitle: 'Dominionのルールブック(PDF)', },
    { routerLink: '/dominion/players'   , inService: true, title: 'Players'         , subtitle: 'プレイヤー一覧', },
    { routerLink: '/dominion/scoring'   , inService: true, title: 'Scoring'         , subtitle: '成績表でのスコアのつけ方', },
  ];

  constructor( ) { }

  ngOnInit() {
  }

}
