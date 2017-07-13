
import { SelectedCards } from "../selected-cards";
import { SelectedCardsCheckboxValues } from "../selected-cards-checkbox-values";

export class SyncGroup {
  name                        : string;
  password                    : string;
  timeStamp                   : number;
  SelectedCards               : SelectedCards;
  SelectedCardsCheckboxValues : SelectedCardsCheckboxValues;
  DominionSetsSelected        : boolean[];
  randomizerButtonDisabled    : boolean;
  BlackMarketPileShuffled     : { cardIndex: number, revealed: boolean }[];
  BlackMarketOperationPhase   : number;
  gameResultOfPlayers         : {
          name      : string,
          selected  : boolean,
          VP        : number,
          lessTurns : boolean,
        }[];

  constructor( sgObj? ) {
    this.name                        = "";
    this.password                    = "";
    this.timeStamp                   = Date.now();
    this.SelectedCards               = new SelectedCards();
    this.SelectedCardsCheckboxValues = new SelectedCardsCheckboxValues();
    this.DominionSetsSelected        = [];
    this.randomizerButtonDisabled    = false;
    this.BlackMarketPileShuffled     = [];
    this.BlackMarketOperationPhase   = 1;
    this.gameResultOfPlayers         = [];
    if ( sgObj ) {
      Object.keys( sgObj ).forEach( key => this[key] = sgObj[key] );
    }
  }

  getDate() {
    return ( this.timeStamp === 0 ? new Date( Date.now() ) : new Date( this.timeStamp ) );
  }
}
