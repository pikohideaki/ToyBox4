import { submatch } from '../utilities';

export class CardProperty {
    no:                     number;
    cardID:                 string;
    name_jp:                string;
    name_jp_yomi:           string;
    name_eng:               string;
    DominionSetName:        string;
    cost:                   CardCost;
    category:               string;
    cardType:               string;
    cardTypes:              CardTypes;
    VP:                     number;
    drawCard:               number;
    action:                 number;
    buy:                    number;
    coin:                   number;
    VPtoken:                number;
    effect:                 string;
    description:            string;
    recommendedCombination: string;
    memo:                   string;
    implemented:            boolean;
    randomizerCandidate:    boolean;

  constructor( cpObj? ) {
    if ( !cpObj ) {
      this.cost = new CardCost( 0, 0, 0 );
      this.cardTypes = new CardTypes();
    } else {

      Object.keys( cpObj )
      .filter( key => key !== 'cost' && key !== 'cardTypes' )
      .forEach( key => this[key] = cpObj[key] );

      this.cost = new CardCost( cpObj.cost.coin, cpObj.cost.potion, cpObj.cost.debt );
      this.cardTypes = new CardTypes( cpObj.cardTypes );
    }
  }


  isWideType(): boolean {
    return (this.cardTypes.EventCards || this.cardTypes.LandmarkCards);
  }

  costStr(): string {
    let costStr = '';
    if ( this.cost.coin > 0 || ( this.cost.potion === 0 && this.cost.debt === 0 ) ) {
        costStr += this.cost.coin.toString();
    }
    if ( this.cost.potion > 0 ) {
        for ( let i = 0; i < this.cost.potion; ++i ) { costStr += 'P'; }
    }
    if ( this.cost.debt   > 0 ) {
        costStr += `<${this.cost.debt.toString()}>`;
    }
    return costStr;
  }


  transform(): any {
    return {
      no                     : this.no                     ,
      cardID                 : this.cardID                 ,
      name_jp                : this.name_jp                ,
      name_jp_yomi           : this.name_jp_yomi           ,
      name_eng               : this.name_eng               ,
      DominionSetName        : this.DominionSetName        ,
      cost_coin              : this.cost.coin              ,
      cost_potion            : this.cost.potion            ,
      cost_debt              : this.cost.debt              ,
      costStr                : this.costStr()              ,
      category               : this.category               ,
      cardTypesStr           : this.cardTypes.toStr()      ,
      cardTypes              : this.cardTypes              ,
      VP                     : this.VP                     ,
      drawCard               : this.drawCard               ,
      action                 : this.action                 ,
      buy                    : this.buy                    ,
      coin                   : this.coin                   ,
      VPtoken                : this.VPtoken                ,
      effect                 : this.effect                 ,
      description            : this.description            ,
      recommendedCombination : this.recommendedCombination ,
      memo                   : this.memo                   ,
      implemented            : ( this.implemented ?  '実装済み' : '未実装' ),
      randomizerCandidate    : ( this.randomizerCandidate ?  '〇' : '×' ),
    };
  }

}


export class CardTypes {
  Curse:         boolean = false;  // 呪い
  Action:        boolean = false;  // アクション
  Treasure:      boolean = false;  // 財宝
  Victory:       boolean = false;  // 勝利点
  Attack:        boolean = false;  // アタック
  Reaction:      boolean = false;  // リアクション
  Duration:      boolean = false;  // 持続
  Ruins:         boolean = false;  // 廃墟
  Prize:         boolean = false;  // 褒賞
  Looter:        boolean = false;  // 略奪者
  Shelter:       boolean = false;  // 避難所
  Knights:       boolean = false;  // 騎士
  Reserve:       boolean = false;  // リザーブ
  Traveller:     boolean = false;  // トラベラー
  Castle:        boolean = false;  // 城
  Gather:        boolean = false;  // 集合
  EventCards:    boolean = false;  // イベント
  LandmarkCards: boolean = false;  // ランドマーク

  constructor( obj? ) {
    if ( !obj ) return;
    Object.keys( obj ).forEach( key => this[key] = obj[key] );
  }


  toStr() {
    const resultArray = [];
    if ( this.Curse         ) resultArray.push( '呪い' );
    if ( this.Action        ) resultArray.push( 'アクション' );
    if ( this.Treasure      ) resultArray.push( '財宝' );
    if ( this.Victory       ) resultArray.push( '勝利点' );
    if ( this.Attack        ) resultArray.push( 'アタック' );
    if ( this.Reaction      ) resultArray.push( 'リアクション' );
    if ( this.Duration      ) resultArray.push( '持続' );
    if ( this.Ruins         ) resultArray.push( '廃墟' );
    if ( this.Prize         ) resultArray.push( '褒賞' );
    if ( this.Looter        ) resultArray.push( '略奪者' );
    if ( this.Shelter       ) resultArray.push( '避難所' );
    if ( this.Knights       ) resultArray.push( '騎士' );
    if ( this.Reserve       ) resultArray.push( 'リザーブ' );
    if ( this.Traveller     ) resultArray.push( 'トラベラー' );
    if ( this.Castle        ) resultArray.push( '城' );
    if ( this.Gather        ) resultArray.push( '集合' );
    if ( this.EventCards    ) resultArray.push( 'イベント' );
    if ( this.LandmarkCards ) resultArray.push( 'ランドマーク' );
    return resultArray.join('－');
  }
};



export class CardCost {
  coin   = 0;
  potion = 0;
  debt   = 0;

  constructor( coin: number, potion: number, debt: number ) {
    this.coin   = coin;
    this.potion = potion;
    this.debt   = debt;
  }
}

export function toListIndex( cardPropertyList: CardProperty[], cardID: string ) {
  return cardPropertyList.findIndex( e => e.cardID === cardID );
}


export function numberToPrepare(
    cardPropertyList: CardProperty[],
    cardIndex,
    numberOfPlayer: number,
    DarkAges: boolean
  ): number {
  switch ( cardPropertyList[cardIndex].cardID ) {
    case 'Copper'  : return 60;
    case 'Silver'  : return 40;
    case 'Gold'    : return 30;
    case 'Platinum': return 12;
    case 'Potion'  : return 16;
    case 'Curse'   : return ( numberOfPlayer - 1 ) * 10;
    default : break;
  }
  if ( cardPropertyList[cardIndex].cardID === 'Estate' ) {
    if ( DarkAges ) return ( numberOfPlayer > 2 ? 12 : 8 );
    return numberOfPlayer * 3 + ( numberOfPlayer > 2 ? 12 : 8 );
  }
  if ( cardPropertyList[cardIndex].cardTypes.Victory ) {
    return ( numberOfPlayer > 2 ? 12 : 8 );
  }
  if ( cardPropertyList[cardIndex].cardTypes.Prize ) return 1;
  return 10; /* KingdomCard default */
}
