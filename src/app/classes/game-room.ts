import { SelectedCards } from './selected-cards';
import { BlackMarketPileCard } from './black-market-pile-card';

export class GameRoom {
  databaseKey:             string;
  timeStamp:               Date = new Date( Date.now() );
  name:                    string = '';
  memo:                    string = '';
  waitingForPlayers:       boolean = true;
  players:                 string[] = [];
  numberOfPlayers:         number = 2;
  isSelectedExpansions:    boolean[] = [];
  selectedCards:           SelectedCards = new SelectedCards();
  BlackMarketPileShuffled: BlackMarketPileCard[] = [];
  gameStateID:             string;


  constructor( databaseKey?: string, dataObj?: {
      timeStamp:               string,
      name:                    string,
      memo:                    string,
      waitingForPlayers:       boolean,
      players:                 string[],
      numberOfPlayers:         number,
      isSelectedExpansions:    boolean[],
      selectedCards:           SelectedCards,
      BlackMarketPileShuffled: BlackMarketPileCard[],
      gameStateID:             string,
    }
  ) {
    if ( !databaseKey || !dataObj ) return;
    this.databaseKey             = ( databaseKey || '' );
    this.timeStamp               = new Date( dataObj.timeStamp || Date.now().toString() );
    this.name                    = ( dataObj.name || '' );
    this.memo                    = ( dataObj.memo || '' );
    this.waitingForPlayers       = !!dataObj.waitingForPlayers;
    this.players                 = Object.keys( dataObj.players || {} ).map( key => dataObj.players[key] );
    this.numberOfPlayers         = ( dataObj.numberOfPlayers || 0 );
    this.isSelectedExpansions    = ( dataObj.isSelectedExpansions || [] );
    this.selectedCards           = new SelectedCards( dataObj.selectedCards );
    this.BlackMarketPileShuffled = ( dataObj.BlackMarketPileShuffled || [] );
    this.gameStateID             = ( dataObj.gameStateID || '' );
  }
}
