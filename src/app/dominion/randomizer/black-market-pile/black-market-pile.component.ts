import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { MdDialog, MdDialogRef } from '@angular/material';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

import { MyUtilitiesService } from '../../../my-utilities.service';
import { DominionDatabaseService } from '../../dominion-database.service';

import { MySyncGroupService } from '../my-sync-group.service';
import { SelectedCardsService } from '../selected-cards.service';
import { BlackMarketPileShuffledService } from '../black-market-pile-shuffled.service';

import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

import { DominionCardImageComponent } from '../../dominion-card-image/dominion-card-image.component';
import { CardPropertyDialogComponent } from '../../card-property-dialog/card-property-dialog.component';

import { CardProperty } from '../../card-property';
import { SelectedCards } from '../../selected-cards';


@Component({
  selector: 'app-black-market-pile',
  templateUrl: './black-market-pile.component.html',
  styleUrls: ['./black-market-pile.component.css']
})
export class BlackMarketPileComponent implements OnInit, OnDestroy {

  private alive = true;
  getDataDone = false;

  faceUp = false;
  @Input() longSideLength = 180;

  cardPropertyList: CardProperty[];

  BlackMarketPileShuffled: { cardIndex: number, faceUp: boolean }[] = [];
  BlackMarketOperationPhase = 1;

  promiseResolver = {};



  constructor(
    public dialog: MdDialog,
    private utils: MyUtilitiesService,
    private database: DominionDatabaseService,
    private selectedCardsService: SelectedCardsService,
    private mySyncGroup: MySyncGroupService,
    private BlackMarketService: BlackMarketPileShuffledService
  ) {
    this.mySyncGroup.BlackMarketOperationPhase$()
      .takeWhile( () => this.alive )
      .subscribe( val => this.BlackMarketOperationPhase = val );

    Observable.combineLatest(
        this.database.cardPropertyList$,
        this.BlackMarketService.BlackMarketPileShuffled$,
        ( cardPropertyList, BlackMarketPileShuffled ) => ({
          cardPropertyList        : cardPropertyList,
          BlackMarketPileShuffled : BlackMarketPileShuffled
        }) )
      .takeWhile( () => this.alive )
      .subscribe( value => {
        this.cardPropertyList = value.cardPropertyList;
        this.BlackMarketPileShuffled = value.BlackMarketPileShuffled;
        this.getDataDone = true;
      } );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }



  /* 闇市場のデッキの上から3枚のカードを公開する。あなたは公開したカードのうち1枚を即座に購入してもよい。購入しなかったカードは、好きな順番で闇市場のデッキの下に置く。
   * 「騎士」を使用する場合は、ランダマイザーカードではなく、「騎士」10枚のうちどれか1枚を入れる。
   * ※「闇市場」の効果による購入でカード1枚を獲得したときに、リアクションとして「交易人」を手札から公開した場合、そのカード1枚は獲得されず、闇市場デッキの一番上に戻す。
   */

  onClick( operation: string, value: number ) {
    this.promiseResolver[operation]( value );
  }

  putOnTheBottomDone(): boolean {
    const numberOfFaceDownCards = this.BlackMarketPileShuffled.filter( e => !e.faceUp ).length;
    const firstIndexOfFaceUpCard = this.BlackMarketPileShuffled.findIndex( e => e.faceUp );
    return numberOfFaceDownCards === firstIndexOfFaceUpCard;
  }

  revealTop3Cards = async () => {
    // 上から3枚をめくる
    this.mySyncGroup.setBlackMarketOperationPhase(1);

    this.BlackMarketPileShuffled.forEach( (e, i) => e.faceUp = (i < 3) );
    this.mySyncGroup.setBlackMarketPileShuffled( this.BlackMarketPileShuffled );


    // 3枚のうち1枚を購入するか，1枚も購入しない
    this.mySyncGroup.setBlackMarketOperationPhase(2);

    while (true) {
      const clickedElementValue
        = await new Promise<number>( resolve => this.promiseResolver['buy'] = resolve );

      if ( clickedElementValue === -1 ) break;  // don't buy

      if ( 0 <= clickedElementValue && clickedElementValue < 3 ) {  // buy a card
        const cardIndex = this.BlackMarketPileShuffled[ clickedElementValue ].cardIndex;
        const dialogRef = this.dialog.open( ConfirmDialogComponent );
        dialogRef.componentInstance.message = `「${this.cardPropertyList[cardIndex].name_jp}」を購入しますか？`;
        const yn = await dialogRef.afterClosed().toPromise();
        if ( yn === 'yes' ) {
          this.utils.removeAt( this.BlackMarketPileShuffled, clickedElementValue );
          this.mySyncGroup.setBlackMarketPileShuffled( this.BlackMarketPileShuffled );
          break;
        }
      }
    }

    // 残りは好きな順に闇市場デッキの下に置く
    this.mySyncGroup.setBlackMarketOperationPhase(3);

    while (true) {
      const clickedElementValue2
        = await new Promise<number>( resolve => this.promiseResolver['putOnTheBottom'] = resolve );
      if ( clickedElementValue2 === -1 ) break;

      const selectedElement = this.utils.removeAt( this.BlackMarketPileShuffled, clickedElementValue2 );
      this.BlackMarketPileShuffled.push(selectedElement);
      this.mySyncGroup.setBlackMarketPileShuffled( this.BlackMarketPileShuffled );
    }

    // 確認
    this.BlackMarketPileShuffled.forEach( e => e.faceUp = false );  // reset
    this.mySyncGroup.setBlackMarketPileShuffled( this.BlackMarketPileShuffled );

    this.mySyncGroup.setBlackMarketOperationPhase(1);
  }

}
