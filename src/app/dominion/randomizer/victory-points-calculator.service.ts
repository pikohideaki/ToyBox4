import { Injectable } from '@angular/core';

import { NumberOfVictoryCards } from './number-of-victory-cards'

@Injectable()
export class VictoryPointsCalculatorService {

  constructor() { }

  

  total( NumberOfVictoryCards: NumberOfVictoryCards ): number {
    let VPtotal = 0;
    Object.keys( NumberOfVictoryCards ).forEach( key => VPtotal += this.calc( key, NumberOfVictoryCards ) );
    return VPtotal;
  }


  calc( name: string, numberOfVictoryCards: NumberOfVictoryCards ): number {
    switch (name) {
      case 'VPtoken'        : return numberOfVictoryCards.VPtoken        * 1;
      case 'Curse'          : return numberOfVictoryCards.Curse          * (-1);
      case 'Estate'         : return numberOfVictoryCards.Estate         *  1;
      case 'Duchy'          : return numberOfVictoryCards.Duchy          *  3;
      case 'Province'       : return numberOfVictoryCards.Province       *  6;
      case 'Colony'         : return numberOfVictoryCards.Colony         * 10;
      case 'Great_Hall'     : return numberOfVictoryCards.Great_Hall     *  1;
      case 'Nobles'         : return numberOfVictoryCards.Nobles         *  2;
      case 'Harem'          : return numberOfVictoryCards.Harem          *  2;
      case 'Farmland'       : return numberOfVictoryCards.Farmland       *  2;
      case 'Island'         : return numberOfVictoryCards.Island         *  2;
      case 'Tunnel'         : return numberOfVictoryCards.Tunnel         *  2;
      case 'Dame_Josephine' : return numberOfVictoryCards.Dame_Josephine *  2;

      // 庭園 : デッキ枚数 ÷ 10 点
      case 'Gardens' :
        return numberOfVictoryCards.Gardens * Math.floor( numberOfVictoryCards.DeckSize / 10 );

      // 公爵 : 公領1枚につき1点
      case 'Duke' :
        return numberOfVictoryCards.Duke * numberOfVictoryCards.Duchy;

      // ブドウ園 : アクションカード3枚につき1点
      case 'Vineyard' :
        return numberOfVictoryCards.Vineyard * Math.floor( numberOfVictoryCards.numberOfActionCards / 3 );

      // 品評会 : 異なる名前のカード5枚につき2勝利点
      case 'Fairgrounds' :
        return numberOfVictoryCards.Fairgrounds * 2 * Math.floor( numberOfVictoryCards.numberOfDifferentlyNamedCards / 5 );

      // シルクロード : 勝利点カード4枚につき1点
      case 'Silk_Road' :
        return numberOfVictoryCards.Silk_Road * Math.floor( numberOfVictoryCards.countVictoryCards() / 4 );

      // // 封土 : 銀貨3枚につき1点
      case 'Feodum' :
        return numberOfVictoryCards.Feodum * Math.floor( numberOfVictoryCards.numberOfSilvers / 3 );

      // 遠隔地 : 酒場マットの上にあれば4点，そうでなければ0点
      case 'Distant_Lands_on_TavernMat' :
        return numberOfVictoryCards.Distant_Lands_on_TavernMat * 4;

      // Castles
      case 'Humble_Castle'    : return numberOfVictoryCards.Humble_Castle    * numberOfVictoryCards.countCastles();
      case 'Crumbling_Castle' : return numberOfVictoryCards.Crumbling_Castle * 1;
      case 'Small_Castle'     : return numberOfVictoryCards.Small_Castle     * 2;
      case 'Haunted_Castle'   : return numberOfVictoryCards.Haunted_Castle   * 2;
      case 'Opulent_Castle'   : return numberOfVictoryCards.Opulent_Castle   * 3;
      case 'Sprawling_Castle' : return numberOfVictoryCards.Sprawling_Castle * 4;
      case 'Grand_Castle'     : return numberOfVictoryCards.Grand_Castle     * 5;
      case 'Kings_Castle'     : return numberOfVictoryCards.Kings_Castle     * 2 * numberOfVictoryCards.countCastles();

      default : return 0;
    }
  }

}

