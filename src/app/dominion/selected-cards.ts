export class SelectedCards {
  Prosperity:       boolean;
  DarkAges:         boolean;
  KingdomCards10:   number[];
  BaneCard:         number[];
  EventCards:       number[];
  LandmarkCards:    number[];
  Obelisk:          number[];
  BlackMarketPile:  number[];


  constructor( scObj? ) {
    if ( scObj === undefined ) {
      this.Prosperity      = false;
      this.DarkAges        = false;
      this.KingdomCards10  = [];
      this.BaneCard        = [];
      this.EventCards      = [];
      this.LandmarkCards   = [];
      this.Obelisk         = [];
      this.BlackMarketPile = [];
    } else {
      this.Prosperity      = ( scObj.Prosperity      || false );
      this.DarkAges        = ( scObj.DarkAges        || false );
      this.KingdomCards10  = ( scObj.KingdomCards10  || [] );
      this.BaneCard        = ( scObj.BaneCard        || [] );
      this.EventCards      = ( scObj.EventCards      || [] );
      this.LandmarkCards   = ( scObj.LandmarkCards   || [] );
      this.Obelisk         = ( scObj.Obelisk         || [] );
      this.BlackMarketPile = ( scObj.BlackMarketPile || [] );
    }
  }



  set( scObj ) {
    this.Prosperity      = ( scObj.Prosperity      || false );
    this.DarkAges        = ( scObj.DarkAges        || false );
    this.KingdomCards10  = ( scObj.KingdomCards10  || [] );
    this.BaneCard        = ( scObj.BaneCard        || [] );
    this.EventCards      = ( scObj.EventCards      || [] );
    this.LandmarkCards   = ( scObj.LandmarkCards   || [] );
    this.Obelisk         = ( scObj.Obelisk         || [] );
    this.BlackMarketPile = ( scObj.BlackMarketPile || [] );
  }


  reset() {
    this.Prosperity      = false;
    this.DarkAges        = false;
    this.KingdomCards10  = [];
    this.BaneCard        = [];
    this.EventCards      = [];
    this.LandmarkCards   = [];
    this.Obelisk         = [];
    this.BlackMarketPile = [];
  }

  concatAll(): number[] {
    return [].concat(
      this.KingdomCards10 ,
      this.BaneCard       ,
      this.EventCards     ,
      this.LandmarkCards  ,
      this.Obelisk        ,
      this.BlackMarketPile,
    );
  }

}
