import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { MdDialog, MdDialogRef } from '@angular/material';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { MyUtilitiesService } from '../../../my-utilities.service';
import { ConfirmDialogComponent } from "../../../confirm-dialog/confirm-dialog.component";

import { CardProperty } from "../../card-property";
import { DominionCardImageComponent } from "../../dominion-card-image/dominion-card-image.component";
import { CardPropertyDialogComponent } from '../../card-property-dialog/card-property-dialog.component';


@Component({
  selector: 'app-black-market-pile',
  templateUrl: './black-market-pile.component.html',
  styleUrls: ['./black-market-pile.component.css']
})
export class BlackMarketPileComponent implements OnInit, OnChanges, OnDestroy {

  faceUp: boolean = false;

  @Input() longSideLength: number = 140;

  @Input() CardPropertyList: CardProperty[];

  @Input() BlackMarketPile: number[] = [];
  BlackMarketPileShuffled: { cardIndex: number, revealed: boolean }[] = [];

  BlackMarketOperationPhase: number = 1;

  promiseResolver = {};


  signedIn: boolean = false;
  mySyncGroup$;
  mySyncGroupID: string;
  subscriptions = [];


  constructor(
    public dialog: MdDialog,
    private utils: MyUtilitiesService,
    private afDatabase: AngularFireDatabase,
    public afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    const me$ = this.afAuth.authState;


    this.subscriptions.push(
      me$.subscribe( me => {
        this.signedIn = !!me;
        if ( !this.signedIn ) return;

        const myID = me.uid;
        this.subscriptions.push(
          this.afDatabase.object(`/userInfo/${myID}/dominionGroupID`).subscribe( val => {
            this.mySyncGroupID = val.$value;
            if ( !this.mySyncGroupID ) return;

            this.subscriptions.push(
              this.afDatabase.object(`/syncGroups/${this.mySyncGroupID}/BlackMarketOperationPhase`)
              .subscribe( val => {
                this.BlackMarketOperationPhase = val.$value;
              })
            );

            this.subscriptions.push(
              this.afDatabase.list(`/syncGroups/${this.mySyncGroupID}/BlackMarketPileShuffled`)
              .subscribe( val => {
                this.BlackMarketPileShuffled = val;
              })
            );

          })
        );
      } )
    );

  }


  ngOnChanges( changes: SimpleChanges ) {
    if ( changes.BlackMarketPile != undefined ) {
      this.BlackMarketOperationPhase = 1;
      this.BlackMarketPileShuffled
        = this.utils.shuffle( this.BlackMarketPile )
                    .map( e => Object({ cardIndex: e, revealed: false }) );
      this.updateServerValue();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach( e => e.unsubscribe() );
  }



  /* 闇市場のデッキの上から3枚のカードを公開する。あなたは公開したカードのうち1枚を即座に購入してもよい。購入しなかったカードは、好きな順番で闇市場のデッキの下に置く。
   * 「騎士」を使用する場合は、ランダマイザーカードではなく、「騎士」10枚のうちどれか1枚を入れる。
   * ※「闇市場」の効果による購入でカード1枚を獲得したときに、リアクションとして「交易人」を手札から公開した場合、そのカード1枚は獲得されず、闇市場デッキの一番上に戻す。
   */

  updateServerValue() {
    if ( this.signedIn && this.mySyncGroupID !== "" ) {
      this.afDatabase.object( `/syncGroups/${this.mySyncGroupID}/BlackMarketOperationPhase`)
        .set( this.BlackMarketOperationPhase );
      this.afDatabase.object( `/syncGroups/${this.mySyncGroupID}`)
        .update( { "BlackMarketPileShuffled": this.BlackMarketPileShuffled} );
    }
  }

  revealTop3Cards = async () => {
    // 上から3枚をめくる
    this.BlackMarketOperationPhase = 1;
    this.BlackMarketPileShuffled.forEach( (e, i) => e.revealed = ( i < 3) );
    this.updateServerValue();

    // 3枚のうち1枚を購入するか，1枚も購入しない
    this.BlackMarketOperationPhase++;
    this.updateServerValue();
    const clickedElementValue
      = await new Promise<number>( resolve => this.promiseResolver['buy'] = resolve );
    
    if ( 0 <= clickedElementValue && clickedElementValue < 3 ) {  // buy a card
      const cardIndex = this.BlackMarketPileShuffled[ clickedElementValue ].cardIndex;
      let dialogRef = this.dialog.open( ConfirmDialogComponent );
      dialogRef.componentInstance.message = `「${this.CardPropertyList[cardIndex].name_jp}」を購入しますか？`;
      const yn = await dialogRef.afterClosed().toPromise();
      if ( yn === "yes" ) {
        this.utils.removeAt( this.BlackMarketPileShuffled, clickedElementValue );
        this.updateServerValue();
      }
    }

    // 残りは好きな順に闇市場デッキの下に置く
    this.BlackMarketOperationPhase++;
    this.updateServerValue();
    while (true) {
      const clickedElementValue2
        = await new Promise<number>( resolve => this.promiseResolver['putOnTheBottom'] = resolve );
      if ( clickedElementValue2 == -1 ) break;

      const removedElement = this.utils.removeAt( this.BlackMarketPileShuffled, clickedElementValue2 );
      this.BlackMarketPileShuffled.push(removedElement);
      this.updateServerValue();
    }

    // 確認
    this.BlackMarketPileShuffled.forEach( e => e.revealed = false );  // reset
    this.BlackMarketOperationPhase = 1;
    this.updateServerValue();
  }

  onClick( operation: string, value: number ) {
    this.promiseResolver[operation]( value );
  }

}
