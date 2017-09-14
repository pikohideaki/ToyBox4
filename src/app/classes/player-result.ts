export class PlayerResult {
  id:        string  = '';  // databaseKey of playerNameList
  name:      string  = '';
  selected:  boolean = false;
  VP:        number  = 0;
  winByTurn: boolean = false;

  constructor( id?: string, initObj?: {
    name:      string,
    selected:  boolean,
    VP:        number,
    winByTurn: boolean,
  } ) {
    this.id = id || '';
    if ( !initObj ) return;
    this.name      = ( initObj.name      || ''    );
    this.selected  = ( initObj.selected  || false );
    this.VP        = ( initObj.VP        || 0     );
    this.winByTurn = ( initObj.winByTurn || false );
  }
}
