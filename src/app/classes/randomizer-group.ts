import { SelectedCards } from './selected-cards';
import { selectedCardsCheckbox } from './selected-cards-checkbox-values';
import { PlayerResult } from './player-result';

export class RandomizerGroup {
  databaseKey:               string;
  name:                      string = '';
  password:                  string = '';
  timeStamp:                 number = 0;
  randomizerButtonLocked:    boolean = false;
  selectedDominionSet:       boolean[] = [];
  selectedCards:             SelectedCards = new SelectedCards();
  selectedCardsCheckbox:     selectedCardsCheckbox = new selectedCardsCheckbox();
  BlackMarketPileShuffled:   { cardIndex: number, faceUp: boolean }[] = [];
  BlackMarketPhase:          number = 1;
  newGameResultPlayers:      PlayerResult[] = [];
  newGameResultPlace:        string = '';
  newGameResultMemo:         string = '';
  newGameResultDialogOpened: boolean = false;
  resetVPCalculatorOfPlayer: boolean[] = [];
  startPlayerName:           string;


  constructor( databaseKey?, initObj?: {
    name:                      string,
    password:                  string,
    timeStamp:                 number,
    randomizerButtonLocked:    boolean,
    selectedDominionSet:       boolean[],
    selectedCards:             SelectedCards,
    selectedCardsCheckbox:     selectedCardsCheckbox,
    BlackMarketPileShuffled:   { cardIndex: number, faceUp: boolean }[],
    BlackMarketPhase:          number,
    newGameResultPlayers:      PlayerResult[],
    newGameResultPlace:        string,
    newGameResultMemo:         string,
    newGameResultDialogOpened: boolean,
    resetVPCalculatorOfPlayer: boolean[],
    startPlayerName:           string,
  }) {
    if ( !databaseKey || !initObj ) return;
    this.databaseKey               = ( databaseKey || '' );
    this.name                      = ( initObj.name || '' );
    this.password                  = ( initObj.password || '' );
    this.timeStamp                 = ( initObj.timeStamp || 0 );
    this.randomizerButtonLocked    = !!initObj.randomizerButtonLocked;
    this.selectedDominionSet       = ( initObj.selectedDominionSet || [] );
    this.selectedCards             = new SelectedCards( initObj.selectedCards );
    this.selectedCardsCheckbox     = new selectedCardsCheckbox( initObj.selectedCardsCheckbox );
    this.BlackMarketPileShuffled   = ( initObj.BlackMarketPileShuffled || [] );
    this.BlackMarketPhase          = ( initObj.BlackMarketPhase || 0 );
    this.newGameResultPlayers      = ( initObj.newGameResultPlayers || [] );
    this.newGameResultPlace        = ( initObj.newGameResultPlace || '' );
    this.newGameResultMemo         = ( initObj.newGameResultMemo || '' );
    this.newGameResultDialogOpened = !!initObj.newGameResultDialogOpened;
    this.resetVPCalculatorOfPlayer = ( initObj.resetVPCalculatorOfPlayer || [] );
    this.startPlayerName           = ( initObj.startPlayerName || '' );
  }

  getDate() {
    return new Date( this.timeStamp === 0 ? Date.now() : this.timeStamp );
  }
}
