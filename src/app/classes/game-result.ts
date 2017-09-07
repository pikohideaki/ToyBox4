class PlayerResultRanked {
  name:      string  = '';
  VP:        number  = 0;
  winByTurn: boolean = false;
  rank:      number  = 0;   // <- calculate locally
  score:     number  = 0;   // <- calculate locally

  constructor( initObj?: {
    name:      string,
    VP:        number,
    winByTurn: boolean,
    rank:      number,
    score:     number,
  }) {
    if ( !initObj ) return;
    this.name      = ( initObj.name      || '' );
    this.VP        = ( initObj.VP        || 0 );
    this.winByTurn = !!initObj.winByTurn;
    this.rank      = ( initObj.rank      || 0 );
    this.score     = ( initObj.score     || 0 );
  }
}

class SelectedCardsID {
  Prosperity:       boolean  = false;
  DarkAges:         boolean  = false;
  KingdomCards10:   string[] = [];
  BaneCard:         string[] = [];
  EventCards:       string[] = [];
  Obelisk:          string[] = [];
  LandmarkCards:    string[] = [];
  BlackMarketPile:  string[] = [];

  constructor( initObj?: {
    Prosperity:       boolean,
    DarkAges:         boolean,
    KingdomCards10:   string[],
    BaneCard:         string[],
    EventCards:       string[],
    Obelisk:          string[],
    LandmarkCards:    string[],
    BlackMarketPile:  string[],
  }) {
    if ( !initObj ) return;
    this.Prosperity       = !!initObj.Prosperity;
    this.DarkAges         = !!initObj.DarkAges;
    this.KingdomCards10   = ( initObj.KingdomCards10  || [] );
    this.BaneCard         = ( initObj.BaneCard        || [] );
    this.EventCards       = ( initObj.EventCards      || [] );
    this.Obelisk          = ( initObj.Obelisk         || [] );
    this.LandmarkCards    = ( initObj.LandmarkCards   || [] );
    this.BlackMarketPile  = ( initObj.BlackMarketPile || [] );
  }
}


export class GameResult {
  databaseKey:         string = '';  // key of this game-result in fire-database
  no:                  number = 0;   // <- calculate locally
  date:                Date = new Date();
  place:               string = '';
  players:             PlayerResultRanked[] = [];
  memo:                string = '';
  selectedDominionSet: boolean[] = [];
  selectedCardsID:     SelectedCardsID = new SelectedCardsID();


  constructor( databaseKey?, initObj?: {
    no:                  number,
    date:                string,
    place:               string,
    players:             PlayerResultRanked[],
    memo:                string,
    selectedDominionSet: boolean[],
    selectedCardsID:     SelectedCardsID,
  }) {
    if ( !databaseKey || !initObj ) return;
    this.databaseKey         = databaseKey;
    this.no                  = ( initObj.no                  || 0 );
    this.date                = new Date( initObj.date || Date.now().toString() );
    this.place               = ( initObj.place               || '' );
    this.players             = ( initObj.players || [] ).map( e => new PlayerResultRanked(e) );
    this.memo                = ( initObj.memo                || '' );
    this.selectedDominionSet = ( initObj.selectedDominionSet || [] );
    this.selectedCardsID     = new SelectedCardsID( initObj.selectedCardsID );

    this.rankPlayers();
  }

  rankPlayers() {
    this.players.forEach( e => e.rank = 1 );  // initialize ranks

    for ( let j = 1; j < this.players.length; j++ ) {
      for ( let i = 0; i < j; i++ ) {
        // 自分よりもVPが大きい要素があるごとにrank++. 等しいときは何もしない.
        if ( this.players[j].VP > this.players[i].VP ) { this.players[i].rank++; }
        if ( this.players[j].VP < this.players[i].VP ) { this.players[j].rank++; }
        if ( this.players[j].VP === this.players[i].VP ) {
            if ( this.players[j].winByTurn ) { this.players[i].rank++; }
            if ( this.players[i].winByTurn ) { this.players[j].rank++; }
        }
      }
    }

    this.players.sort( (a, b) => (a.rank - b.rank) );
  }


  setScores( scoreTable: number[][] ) {
    // 同着に対応
    const scoringTemp: number[] = Array.from( scoreTable[this.players.length] );
    const pl = this.players;  // alias; players is sorted by rank
    let count = 0;
    let sum = 0.0;
    let rank = 1;
    for ( let i = 0; i < pl.length; ++i ) {
      count++;
      sum += scoreTable[pl.length][rank++];
      if ( i === pl.length - 1 || pl[i].rank !== pl[i + 1].rank ) {
        scoringTemp[ pl[i].rank ] = Math.round( sum * 1000 / count ) / 1000;
        count = 0;  // reset
        sum = 0.0;  // reset
      }
    }

    // write back
    this.players.forEach( e => { e.score = scoringTemp[ e.rank ]; } );
  }

}
