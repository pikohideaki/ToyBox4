export class PlayerName {
  name:      string = '';
  name_yomi: string = '';

  constructor( initObj?: { name: string, name_yomi: string } ) {
    this.name      = (initObj.name || '' );
    this.name_yomi = (initObj.name_yomi || '' );
  }
}
