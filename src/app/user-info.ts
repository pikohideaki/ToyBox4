export class UserInfo {
  databaseKey: string;
  id: string;
  name: string;

  DominionGroupID: string;
  settings: any = {};

  // randomizerGroupID
    // reset at mypage

  constructor( userInfoObj? ) {
    if ( userInfoObj === undefined ) return;
    this.databaseKey     = userInfoObj.databaseKey;
    this.id              = userInfoObj.id;
    this.name            = userInfoObj.name;
    this.DominionGroupID = userInfoObj.DominionGroupID;
    if ( userInfoObj.settings ) {
      this.settings = userInfoObj.settings;
    }
  }
}
