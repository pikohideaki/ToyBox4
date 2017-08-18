import { Inject } from '@angular/core';

import { permutation, shuffle, filterRemove } from '../../utilities';
import { SelectedCards } from '../selected-cards';
import { CardProperty, numberToPrepare, toListIndex } from '../card-property';



export class GameCardData {
  cardPropertyListIndex: number = 0;
  visible: boolean = true;
  visibleToMe: boolean = true;

  constructor(
    cardPropertyListIndexInit: number,
    visibleInit: boolean,
    visibleToMeInit: boolean,
    // placePathInit: (string|number)[]
  ) {
    this.cardPropertyListIndex = cardPropertyListIndexInit;
    this.visible               = visibleInit;
    this.visibleToMe           = visibleToMeInit;
  }
}


export type GameCardID = number;

export class GamePlayer {
  name: string = '';
  itsMyTurn: boolean = false;

  Deck:        GameCardID[] = [];
  DiscardPile: GameCardID[] = [];
  HandCards:   GameCardID[] = [];
  PlayArea:    GameCardID[] = [];
  Aside:       GameCardID[] = [];
  Open:        GameCardID[] = [];

  VPtoken:    number = 0;
  VPtotal:    number = 0;
  TurnCount:  number = 0;
  Connection: boolean = true;



  constructor( dataObj? ) {
    if ( !dataObj ) return;
    this.name        = ( dataObj.name        || '' );
    this.itsMyTurn   = ( dataObj.itsMyTurn   || false );
    this.Deck        = ( dataObj.Deck        || [] );
    this.DiscardPile = ( dataObj.DiscardPile || [] );
    this.HandCards   = ( dataObj.HandCards   || [] );
    this.PlayArea    = ( dataObj.PlayArea    || [] );
    this.Aside       = ( dataObj.Aside       || [] );
    this.Open        = ( dataObj.Open        || [] );
    this.VPtoken     = ( dataObj.VPtoken     || 0 );
    this.VPtotal     = ( dataObj.VPtotal     || 0 );
    this.TurnCount   = ( dataObj.TurnCount   || 0 );
    this.Connection  = ( dataObj.Connection  || false );
  }

}

export class GameState {
  id: string;

  cardPropertyList: CardProperty[] = [];

  turnInfo: {
    action: number,
    buy:    number,
    coin:   number,
  } = {
    action: 0,
    buy:    0,
    coin:   0,
  };

  private whoseTurn: number; // permute[0] -> permute[1] -> permute[2] -> ...
  numberOfPlayers: number = 0;
  private permute: number[];  // shuffle players

  gameCardData: GameCardData[] = [];

  players: GamePlayer[] = [];

  // gameCards
  BasicCards: {
    Curse:    GameCardID[],
    Copper:   GameCardID[],
    Silver:   GameCardID[],
    Gold:     GameCardID[],
    Estate:   GameCardID[],
    Duchy:    GameCardID[],
    Province: GameCardID[],
    Platinum: GameCardID[],
    Colony:   GameCardID[],
    Potion:   GameCardID[],
  } = {
    Curse:    [],
    Copper:   [],
    Silver:   [],
    Gold:     [],
    Estate:   [],
    Duchy:    [],
    Province: [],
    Platinum: [],
    Colony:   [],
    Potion:   [],
  };

  KingdomCards: GameCardID[][] = Array.from( new Array(10), () => new Array() );
  TrashPile: GameCardID[] = [];

  chatList: string[] = [];


  constructor( dataObj?, id? ) {
    this.id = ( id || '' );
    if ( dataObj ) {
      this.cardPropertyList = ( dataObj.cardPropertyList || [] );
      this.turnInfo         =   dataObj.turnInfo;
      this.whoseTurn        = ( dataObj.whoseTurn        || 0 );
      this.numberOfPlayers  = ( dataObj.numberOfPlayers  || 0 );
      this.permute          = ( dataObj.permute          || [] );
      this.gameCardData     = ( dataObj.gameCardData     || [] );
      this.players          = ( dataObj.players.map( e => new GamePlayer(e) ) || [] );
      this.BasicCards       =   dataObj.BasicCards;
      this.KingdomCards     = ( dataObj.KingdomCards     || [] );
      this.TrashPile        = ( dataObj.TrashPile        || [] );
      this.chatList         = ( dataObj.chatList         || [] );
    }
  }


  incrementWhoseTurnIndex() { this.whoseTurn = (this.whoseTurn + 1) % this.numberOfPlayers; }
  turnPlayerIndex()     { return this.permute[ this.whoseTurn ]; }
  turnPlayer()          { return this.players[ this.turnPlayerIndex() ]; }
  nextTurnPlayerIndex() { return this.permute[ (this.whoseTurn + 1) % this.numberOfPlayers ]; }

  setNumberOfPlayers( numberOfPlayers: number ) {
    this.numberOfPlayers = numberOfPlayers;
    this.players = Array.from( new Array(numberOfPlayers), () => new GamePlayer() );
    this.permute = permutation( numberOfPlayers );
  }


  initCards( selectedCards: SelectedCards, cardPropertyList: CardProperty[] ) {
    this.cardPropertyList = cardPropertyList;
    const toIndex = ( cardID: string ) => toListIndex( cardPropertyList, cardID );

    const addMultipleCards = ( placePath: (string|number)[], cardListIndex: number ) => {
      const N = numberToPrepare(
                  cardPropertyList,
                  cardListIndex,
                  this.players.length,
                  selectedCards.DarkAges );
      for ( let i = 0; i < N; ++i ) {
        addCard( cardListIndex, placePath );
      }
    }

    const addCard = ( cardListIndex: number, placePath: (string|number)[] ) => {
      const card = new GameCardData( cardListIndex, true, true );
      const gameCardID = this.gameCardData.push( card ) - 1;  // get index
      let ref = this[placePath[0]];
      for ( let i = 1; i < placePath.length; ++i ) {
        ref = ref[placePath[i]];
      }
      ref.push( gameCardID );
    }

    const usePotion = () => false;

    // basic cards
    addMultipleCards( ['BasicCards', 'Curse'   ], toIndex('Curse'   ) );
    addMultipleCards( ['BasicCards', 'Copper'  ], toIndex('Copper'  ) );
    addMultipleCards( ['BasicCards', 'Silver'  ], toIndex('Silver'  ) );
    addMultipleCards( ['BasicCards', 'Gold'    ], toIndex('Gold'    ) );
    addMultipleCards( ['BasicCards', 'Estate'  ], toIndex('Estate'  ) );
    addMultipleCards( ['BasicCards', 'Duchy'   ], toIndex('Duchy'   ) );
    addMultipleCards( ['BasicCards', 'Province'], toIndex('Province') );
    if ( selectedCards.Prosperity ) {
      addMultipleCards( ['BasicCards', 'Platinum'], toIndex('Platinum') );
      addMultipleCards( ['BasicCards', 'Colony'  ], toIndex('Colony'  ) );
    }
    if ( usePotion() ) {
      addMultipleCards( ['BasicCards', 'Potion'  ], toIndex('Potion'  ) );
    }

    // KingdomCards
    selectedCards.KingdomCards10.forEach( (cardListIndex, index) => {
      addMultipleCards( ['KingdomCards', index], cardListIndex );
    });
  }


  initDecks() {
    this.players.forEach( (player, index) => {
      /* get 7 Coppers from supply */
      for ( let i = 0; i < 7; ++i ) {
        player.Deck.push( this.BasicCards.Copper.pop() );
      }
      /* get 3 Estates from supply */
      for ( let i = 0; i < 3; ++i ) {
        player.Deck.push( this.BasicCards.Estate.pop() );
      }

      shuffle( player.Deck );

      for ( let i = 0; i < 5; ++i ) {
        player.HandCards.push( player.Deck.pop() );
      }

      this.sortHandCards( index );
    });
  }

  getPlacePath( gameCardID: GameCardID ): (string|number)[] {
    let result: (string|number)[] = [];
    const found = (array, value) => ( array.findIndex( e => e === value ) !== -1 );

    // found in BasicCards
    Object.keys( this.BasicCards ).forEach( key => {
      if ( found( this.BasicCards[key], gameCardID ) ) { result = ['BasicCards', key]; return; }
    });

    // found in KingdomCards
    this.KingdomCards.forEach( (pile, index) => {
      if ( found( pile, gameCardID ) ) { result = ['KingdomCards', index]; return; }
    });

    // found in TrashPile
    if ( found( this.TrashPile, gameCardID ) ) result = ['TrashPile'];

    // found in players
    this.players.forEach( (player, index) => {
      if ( found( player.Deck       , gameCardID ) ) { result = ['players', index, 'Deck'       ]; return }
      if ( found( player.DiscardPile, gameCardID ) ) { result = ['players', index, 'DiscardPile']; return }
      if ( found( player.HandCards  , gameCardID ) ) { result = ['players', index, 'HandCards'  ]; return }
      if ( found( player.PlayArea   , gameCardID ) ) { result = ['players', index, 'PlayArea'   ]; return }
      if ( found( player.Aside      , gameCardID ) ) { result = ['players', index, 'Aside'      ]; return }
      if ( found( player.Open       , gameCardID ) ) { result = ['players', index, 'Open'       ]; return }
    });

    return result;
  }

  cardPropertyListIndex( gameCardID: GameCardID ): number {
    return this.gameCardData[ gameCardID ].cardPropertyListIndex;
  }

  cardProperty( gameCardID: GameCardID ): CardProperty {
    return this.cardPropertyList[ this.cardPropertyListIndex( gameCardID ) ];
  }

  sortHandCards( playerIndex: number ): void {
    let sorted = this.players[playerIndex].HandCards
        .sort( (a, b) => this.cardPropertyListIndex(a) - this.cardPropertyListIndex(b) );
    let actionCards, treasureCards, victoryCards;
    [actionCards  , sorted] = filterRemove( sorted, id => this.cardProperty(id).cardTypes.Action );
    [treasureCards, sorted] = filterRemove( sorted, id => this.cardProperty(id).cardTypes.Treasure );
    [victoryCards , sorted] = filterRemove( sorted, id => this.cardProperty(id).cardTypes.Victory );
    this.players[playerIndex].HandCards = [].concat( actionCards, treasureCards, victoryCards, sorted );
  }

}
