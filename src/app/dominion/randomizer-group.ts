import { SelectedCards } from './selected-cards';
import { SelectedCardsCheckboxValues } from './selected-cards-checkbox-values';
import { PlayerResult } from './online-randomizer/player-result';

export class RandomizerGroup {
  name:                                 string = '';
  password:                             string = '';
  timeStamp:                            number = 0;
  randomizerButtonLocked:               boolean = false;
  selectedDominionSet:                  boolean[] = [];
  selectedCards:                        SelectedCards = new SelectedCards();
  selectedCardsCheckboxValues:          SelectedCardsCheckboxValues = new SelectedCardsCheckboxValues();
  BlackMarketPileShuffled:              { cardIndex: number, revealed: boolean }[] = [];
  BlackMarketOperationPhase:            number = 1;
  newGameResultPlayers:                 PlayerResult[] = [];
  newGameResultPlace:                   string = '';
  newGameResultMemo:                    string = '';
  newGameResultDialogOpened:            boolean = false;
  resetVictoryPointsCalculatorOfPlayer: boolean[] = [];


  constructor( initObj?: {
    name:                                 string,
    password:                             string,
    timeStamp:                            number,
    randomizerButtonLocked:               boolean,
    selectedDominionSet:                  boolean[],
    selectedCards:                        SelectedCards,
    selectedCardsCheckboxValues:          SelectedCardsCheckboxValues,
    BlackMarketPileShuffled:              { cardIndex: number, revealed: boolean }[],
    BlackMarketOperationPhase:            number,
    newGameResultPlayers:                 PlayerResult[],
    newGameResultPlace:                   string,
    newGameResultMemo:                    string,
    newGameResultDialogOpened:            boolean,
    resetVictoryPointsCalculatorOfPlayer: boolean[],
  }) {
    if ( !initObj ) return;
    this.name                                 = ( initObj.name || '');
    this.password                             = ( initObj.password || '');
    this.timeStamp                            = ( initObj.timeStamp || 0);
    this.randomizerButtonLocked               = !!initObj.randomizerButtonLocked;
    this.selectedDominionSet                  = ( initObj.selectedDominionSet || []);
    this.selectedCards               = new SelectedCards( initObj.selectedCards );
    this.selectedCardsCheckboxValues = new SelectedCardsCheckboxValues( initObj.selectedCardsCheckboxValues );
    this.BlackMarketPileShuffled              = ( initObj.BlackMarketPileShuffled || []);
    this.BlackMarketOperationPhase            = ( initObj.BlackMarketOperationPhase || 0);
    this.newGameResultPlayers                 = ( initObj.newGameResultPlayers || []);
    this.newGameResultPlace                   = ( initObj.newGameResultPlace || '');
    this.newGameResultMemo                    = ( initObj.newGameResultMemo || '');
    this.newGameResultDialogOpened            = !!initObj.newGameResultDialogOpened;
    this.resetVictoryPointsCalculatorOfPlayer = ( initObj.resetVictoryPointsCalculatorOfPlayer || []);
  }

  getDate() {
    return new Date( this.timeStamp === 0 ? Date.now() : this.timeStamp );
  }
}
