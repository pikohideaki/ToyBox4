import { SelectedCards } from './selected-cards';

export class GameRoom {
  databaseKey:             string;
  timeStamp:               Date = new Date( Date.now() );
  name:                    string = '';
  memo:                    string = '';
  waitingForPlayers:       boolean = true;
  players:                 string[] = [];
  numberOfPlayers:         number = 2;
  DominionSetToggleValues: boolean[] = [];
  selectedCards:           SelectedCards = new SelectedCards();
  BlackMarketPileShuffled: { cardIndex: number, faceUp: boolean }[] = [];
  gameStateID:             string;


  constructor( databaseKey?, dataObj?: {
      timeStamp:               string,
      name:                    string,
      memo:                    string,
      waitingForPlayers:       boolean,
      players:                 string[],
      numberOfPlayers:         number,
      DominionSetToggleValues: boolean[],
      selectedCards:           SelectedCards,
      BlackMarketPileShuffled: { cardIndex: number, faceUp: boolean }[],
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
    this.DominionSetToggleValues = ( dataObj.DominionSetToggleValues || [] );
    this.selectedCards           = new SelectedCards( dataObj.selectedCards );
    this.BlackMarketPileShuffled = ( dataObj.BlackMarketPileShuffled || [] );
    this.gameStateID             = ( dataObj.gameStateID || '' );
  }
}
