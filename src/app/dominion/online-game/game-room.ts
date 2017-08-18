import { SelectedCards } from '../selected-cards';

export class GameRoom {
  // set automatically
  id:        string;
  timeStamp: Date = new Date( Date.now() );
  name:      string = '';

  // set manually
  memo:                    string = '';
  waitingForPlayers:       boolean = true;
  players:                 string[] = [];
  numberOfPlayers:         number = 2;
  DominionSetToggleValues: boolean[] = [];
  selectedCards:           SelectedCards = new SelectedCards();
  BlackMarketPileShuffled: { cardIndex: number, faceUp: boolean }[] = [];

  gameStateID: string;


  constructor( dataObj?, id? ) {
    if ( !dataObj || !id ) return;
    this.id                      = ( id || '' );
    this.timeStamp               = new Date( dataObj.timeStamp );
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
