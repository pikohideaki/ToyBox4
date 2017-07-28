
import { SelectedCards } from '../selected-cards';
import { GameResult } from '../game-result';
import { SelectedCardsCheckboxValues } from '../selected-cards-checkbox-values';

export class SyncGroup {
  name:                        string;  // written only when newly created
  password:                    string;  // written only when newly created
  timeStamp:                   number;  // written only when newly created

  randomizerButtonLocked:      boolean;
  selectedDominionSet:        boolean[];
  selectedCards:               SelectedCards;
  selectedCardsCheckboxValues: SelectedCardsCheckboxValues;
  BlackMarketPileShuffled:     { cardIndex: number, revealed: boolean }[];
  BlackMarketOperationPhase:   number;

  newGameResultPlayers:        { name: string, selected: boolean, VP: number, lessTurns: boolean }[];
  newGameResultPlace:          string;
  newGameResultMemo:           string;
  newGameResultSubmitted:      boolean;


  constructor( sgObj? ) {
    this.name                        = '';
    this.password                    = '';
    this.timeStamp                   = Date.now();
    this.randomizerButtonLocked      = false;
    this.selectedCards               = new SelectedCards();
    this.selectedCardsCheckboxValues = new SelectedCardsCheckboxValues();
    this.selectedDominionSet         = [];
    this.BlackMarketPileShuffled     = [];
    this.BlackMarketOperationPhase   = 1;
    this.newGameResultPlayers        = [];
    this.newGameResultPlace          = '';
    this.newGameResultMemo           = '';
    this.newGameResultSubmitted      = false;
    if ( sgObj ) {
      Object.keys( sgObj ).forEach( key => this[key] = sgObj[key] );
    }
  }

  getDate() {
    return ( this.timeStamp === 0 ? new Date( Date.now() ) : new Date( this.timeStamp ) );
  }
}
