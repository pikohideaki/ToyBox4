

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

  constructor( cpObj ) {
    Object.keys( cpObj )
      .filter( key => key !== 'cost' )
      .forEach( key => this[key] = cpObj[key] );

    this.cost = new CardCost( cpObj.cost.coin, cpObj.cost.potion, cpObj.cost.debt );
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
      cardType               : this.cardType               ,
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


class CardCost {
  coin   = 0;
  potion = 0;
  debt   = 0;

  constructor( coin: number, potion: number, debt: number ) {
    this.coin   = coin;
    this.potion = potion;
    this.debt   = debt;
  }

}
