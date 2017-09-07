import { Component, OnInit } from '@angular/core';

import { AppListComponent } from './my-library/app-list/app-list.component';

@Component({
  selector: 'app-home',
  template: `
    <div class="bodyWithPadding">
      <app-list [Apps]="Apps" > </app-list>
    </div>
  `,
  styles: [],
})
export class HomeComponent implements OnInit {

  Apps = [
    {
      routerLink : '/dominion',
      inService  : true,
      title      : 'Dominion Apps',
      subtitle   : 'サプライ生成＆ゲーム結果追加，成績表，プレイヤー一覧，カード一覧表，ルールブック',
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
