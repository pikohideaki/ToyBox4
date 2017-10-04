export class ChatMessage {
  playerName: string = '';
  content: string = '';
  date: Date = new Date();

  constructor( initObj?: { playerName: string, content: string, dateString: string } ) {
    if ( !initObj ) return;
    this.playerName = initObj.playerName;
    this.content    = initObj.content;
    this.date       = new Date( initObj.dateString || (new Date()).toString() );
  }
}
