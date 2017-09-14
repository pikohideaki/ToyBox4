export class UserInfo {
  databaseKey:       string;

  name:              string = '';
  randomizerGroupID: string = '';

  onlineGame: {
    isSelectedExpansions: boolean[],
    numberOfPlayers:      number,
    roomID:               string,
    gameStateID:          string,
  } = {
    isSelectedExpansions: [],
    numberOfPlayers:      2,
    roomID:               '',
    gameStateID:          '',
  }

  constructor( databaseKey?: string, initObj?: {
      name:              string,
      randomizerGroupID: string,
      onlineGame: {
        isSelectedExpansions: boolean[],
        numberOfPlayers:      number,
        roomID:               string,
        gameStateID:          string,
      }
  }) {
    this.databaseKey = ( databaseKey || '' );

    if ( !initObj ) return;
    this.name                            = ( initObj.name || '' );
    this.randomizerGroupID               = ( initObj.randomizerGroupID || '' );
    this.onlineGame.isSelectedExpansions = ( initObj.onlineGame.isSelectedExpansions || [] );
    this.onlineGame.numberOfPlayers      = ( initObj.onlineGame.numberOfPlayers      || 2  );
    this.onlineGame.roomID               = ( initObj.onlineGame.roomID               || '' );
    this.onlineGame.gameStateID          = ( initObj.onlineGame.gameStateID          || '' );
  }
}
