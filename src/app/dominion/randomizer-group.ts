import { SelectedCards } from './selected-cards';
import { GameResult } from './game-result';
import { SelectedCardsCheckboxValues } from './selected-cards-checkbox-values';

export class RadomizerGroup {
  name:           string  = '';          // written only when newly created
  password:       string  = '';          // written only when newly created
  timeStamp:      number  = Date.now();  // written only when newly created
  onlineGameRoom: boolean = false;      // written only when newly created

  randomizerButtonLocked:     boolean = false;
  selectedDominionSet:        boolean[] = [];
  selectedCards               = new SelectedCards();
  selectedCardsCheckboxValues = new SelectedCardsCheckboxValues();
  BlackMarketPileShuffled:    { cardIndex: number, revealed: boolean }[] = [];
  BlackMarketOperationPhase:  number = 1;

  newGameResultPlayers: {
    name:      string,
    selected:  boolean,
    VP:        number,
    lessTurns: boolean
  }[] = [];
  newGameResultPlace:     string = '';
  newGameResultMemo:      string = '';
  newGameResultDialogOpened: boolean = false;

  resetVictoryPointsCalculatorOfPlayer: boolean[] = [];


  constructor( sgObj? ) {
    if ( sgObj ) {
      Object.keys( sgObj ).forEach( key => this[key] = sgObj[key] );
    }
  }

  getDate() {
    return new Date( this.timeStamp === 0 ? Date.now() : this.timeStamp );
  }
}
