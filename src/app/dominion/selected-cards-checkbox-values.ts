export class SelectedCardsCheckboxValues {
  KingdomCards10:  boolean[];
  BaneCard:        boolean[];
  EventCards:      boolean[];
  LandmarkCards:   boolean[];
  Obelisk:         boolean[];
  BlackMarketPile: boolean[];


  constructor( scchkObj? ) {
    if ( scchkObj === undefined ) {
      this.KingdomCards10  = Array(10).fill(false);
      this.BaneCard        = Array( 1).fill(false);
      this.EventCards      = Array( 2).fill(false);
      this.LandmarkCards   = Array( 2).fill(false);
      this.Obelisk         = Array( 1).fill(false);
      this.BlackMarketPile = Array(15).fill(false);
    } else {
      this.KingdomCards10  = ( scchkObj.KingdomCards10  || Array(10).fill(false) );
      this.BaneCard        = ( scchkObj.BaneCard        || Array( 1).fill(false) );
      this.EventCards      = ( scchkObj.EventCards      || Array( 2).fill(false) );
      this.LandmarkCards   = ( scchkObj.LandmarkCards   || Array( 2).fill(false) );
      this.Obelisk         = ( scchkObj.Obelisk         || Array( 1).fill(false) );
      this.BlackMarketPile = ( scchkObj.BlackMarketPile || Array(15).fill(false) );
    }
  }


  set( scchkObj ) {
    this.KingdomCards10  = ( scchkObj.KingdomCards10  || Array(10).fill(false) );
    this.BaneCard        = ( scchkObj.BaneCard        || Array( 1).fill(false) );
    this.EventCards      = ( scchkObj.EventCards      || Array( 2).fill(false) );
    this.LandmarkCards   = ( scchkObj.LandmarkCards   || Array( 2).fill(false) );
    this.Obelisk         = ( scchkObj.Obelisk         || Array( 1).fill(false) );
    this.BlackMarketPile = ( scchkObj.BlackMarketPile || Array(15).fill(false) );
  }


  clear() {
    this.KingdomCards10  = Array(10).fill(false);
    this.BaneCard        = Array( 1).fill(false);
    this.EventCards      = Array( 2).fill(false);
    this.LandmarkCards   = Array( 2).fill(false);
    this.Obelisk         = Array( 1).fill(false);
    this.BlackMarketPile = Array(15).fill(false);
  }

}
