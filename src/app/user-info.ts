export class UserInfo {
  databaseKey: string;
  id: string = '';
  name: string = '';

  randomizerGroupID: string = '';

  DominionSetToggleValuesForOnlineGame: boolean[] = [];
  numberOfPlayersForOnlineGame: number = 2;
  onlineGameRoomID: string = '';
  onlineGameStateID: string = '';


  constructor( userInfoObj? ) {
    if ( !userInfoObj ) return;
    this.databaseKey                          = (userInfoObj.databaseKey || '');
    this.id                                   = (userInfoObj.id || '');
    this.name                                 = (userInfoObj.name || '');
    this.randomizerGroupID                    = (userInfoObj.randomizerGroupID || '');
    this.DominionSetToggleValuesForOnlineGame = (userInfoObj.DominionSetToggleValuesForOnlineGame || []);
    this.numberOfPlayersForOnlineGame         = (userInfoObj.numberOfPlayersForOnlineGame || 2);
    this.onlineGameRoomID                     = (userInfoObj.onlineGameRoomID || '');
    this.onlineGameStateID                    = (userInfoObj.onlineGameStateID || '');
  }
}
