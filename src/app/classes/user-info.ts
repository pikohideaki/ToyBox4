export class UserInfo {
  databaseKey: string;
  id: string = '';
  name: string = '';
  randomizerGroupID: string = '';
  DominionSetsSelectedForOnlineGame: boolean[] = [];
  numberOfPlayersForOnlineGame: number = 2;
  onlineGameRoomID: string = '';
  onlineGameStateID: string = '';


  constructor( initObj?: {
      databaseKey:                       string,
      id:                                string,
      name:                              string,
      randomizerGroupID:                 string,
      DominionSetsSelectedForOnlineGame: boolean[],
      numberOfPlayersForOnlineGame:      number,
      onlineGameRoomID:                  string,
      onlineGameStateID:                 string,
  }) {
    this.databaseKey                       = ( initObj.databaseKey || '' );
    this.id                                = ( initObj.id || '' );
    this.name                              = ( initObj.name || '' );
    this.randomizerGroupID                 = ( initObj.randomizerGroupID || '' );
    this.DominionSetsSelectedForOnlineGame = ( initObj.DominionSetsSelectedForOnlineGame || [] );
    this.numberOfPlayersForOnlineGame      = ( initObj.numberOfPlayersForOnlineGame || 2 );
    this.onlineGameRoomID                  = ( initObj.onlineGameRoomID || '' );
    this.onlineGameStateID                 = ( initObj.onlineGameStateID || '' );
  }
}
