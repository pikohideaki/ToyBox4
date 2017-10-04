export class UserInfo {
  databaseKey:       string;

  name:              string = '';
  randomizerGroupID: string = '';

  onlineGame: {
    isSelectedExpansions: boolean[],
    numberOfPlayers:      number,
    roomID:               string,
    gameStateID:          string,
    chatOpened:           boolean,
  } = {
    isSelectedExpansions: [],
    numberOfPlayers:      2,
    roomID:               '',
    gameStateID:          '',
    chatOpened:           true,
  }

  constructor( databaseKey?: string, initObj?: {
      name:              string,
      randomizerGroupID: string,
      onlineGame: {
        isSelectedExpansions: boolean[],
        numberOfPlayers:      number,
        roomID:               string,
        gameStateID:          string,
        chatOpened:           boolean,
      }
  }) {
    this.databaseKey = ( databaseKey || '' );

    if ( !initObj ) return;
    this.name                            = ( initObj.name || '' );
    this.randomizerGroupID               = ( initObj.randomizerGroupID || '' );
    if ( !initObj.onlineGame ) return;
    this.onlineGame.isSelectedExpansions = ( initObj.onlineGame.isSelectedExpansions || [] );
    this.onlineGame.numberOfPlayers      = ( initObj.onlineGame.numberOfPlayers      || 2  );
    this.onlineGame.roomID               = ( initObj.onlineGame.roomID               || '' );
    this.onlineGame.gameStateID          = ( initObj.onlineGame.gameStateID          || '' );
    this.onlineGame.chatOpened           = !!initObj.onlineGame.chatOpened;
  }
}
