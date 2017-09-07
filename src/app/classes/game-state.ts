import { Inject } from '@angular/core';

import { permutation, shuffle, filterRemove } from '../my-library/utilities';

import { SelectedCards } from './selected-cards';
import { CardProperty, numberToPrepare, toListIndex } from './card-property';



export class GameCardData {
  cardPropertyListIndex: number = 0;
  visible: boolean = true;
  visibleToMe: boolean = true;

  constructor( initObj?: {
      cardPropertyListIndex: number,
      visible: boolean,
      visibleToMe: boolean,
  }) {
    if ( !initObj ) return;
    this.cardPropertyListIndex = initObj.cardPropertyListIndex;
    this.visible               = initObj.visible;
    this.visibleToMe           = initObj.visibleToMe;
  }
}


export type GameCardID = number;


class BasicCards {
  Curse:    GameCardID[] = [];
  Copper:   GameCardID[] = [];
  Silver:   GameCardID[] = [];
  Gold:     GameCardID[] = [];
  Estate:   GameCardID[] = [];
  Duchy:    GameCardID[] = [];
  Province: GameCardID[] = [];
  Platinum: GameCardID[] = [];
  Colony:   GameCardID[] = [];
  Potion:   GameCardID[] = [];

  constructor( initObj?: {
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
  }) {
    if ( !initObj ) return;
    this.Curse    = ( initObj.Curse    || [] );
    this.Copper   = ( initObj.Copper   || [] );
    this.Silver   = ( initObj.Silver   || [] );
    this.Gold     = ( initObj.Gold     || [] );
    this.Estate   = ( initObj.Estate   || [] );
    this.Duchy    = ( initObj.Duchy    || [] );
    this.Province = ( initObj.Province || [] );
    this.Platinum = ( initObj.Platinum || [] );
    this.Colony   = ( initObj.Colony   || [] );
    this.Potion   = ( initObj.Potion   || [] );
  }
}

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


  constructor( initObj?: {
    name:        string,
    itsMyTurn:   boolean,
    Deck:        GameCardID[],
    DiscardPile: GameCardID[],
    HandCards:   GameCardID[],
    PlayArea:    GameCardID[],
    Aside:       GameCardID[],
    Open:        GameCardID[],
    VPtoken:     number,
    VPtotal:     number,
    TurnCount:   number,
    Connection:  boolean,
  } ) {
    if ( !initObj ) return;
    this.name        = ( initObj.name        || '' );
    this.itsMyTurn   = ( initObj.itsMyTurn   || false );
    this.Deck        = ( initObj.Deck        || [] );
    this.DiscardPile = ( initObj.DiscardPile || [] );
    this.HandCards   = ( initObj.HandCards   || [] );
    this.PlayArea    = ( initObj.PlayArea    || [] );
    this.Aside       = ( initObj.Aside       || [] );
    this.Open        = ( initObj.Open        || [] );
    this.VPtoken     = ( initObj.VPtoken     || 0 );
    this.VPtotal     = ( initObj.VPtotal     || 0 );
    this.TurnCount   = ( initObj.TurnCount   || 0 );
    this.Connection  = ( initObj.Connection  || false );
  }
}


export class TurnInfo {
  action: number = 0;
  buy:    number = 0;
  coin:   number = 0;

  constructor( initObj?: {
    action: number,
    buy:    number,
    coin:   number,
  } ) {
    if ( !initObj ) return;
    this.action = initObj.action;
    this.buy    = initObj.buy;
    this.coin   = initObj.coin;
  }
}


export class GameState {
  databaseKey: string;
  cardPropertyList: CardProperty[] = [];
  chatList: string[] = [];
  turnInfo: TurnInfo = new TurnInfo();
  private whoseTurn: number; // permute[0] -> permute[1] -> permute[2] -> ...
  numberOfPlayers: number = 0;
  private permute: number[];  // shuffle players
  players: GamePlayer[] = [];
  gameCardData: GameCardData[] = [];
  BasicCards: BasicCards = new BasicCards();
  KingdomCards: GameCardID[][] = Array.from( new Array(10), () => new Array() );
  TrashPile: GameCardID[] = [];


  constructor( databaseKey?, initObj?: {
    id:                string,
    cardPropertyList:  CardProperty[],
    chatList:          string[],
    turnInfo:          TurnInfo,
    whoseTurn:         number,
    numberOfPlayers:   number,
    permute:           number[],
    players:           GamePlayer[],
    gameCardData:      GameCardData[],
    BasicCards:        BasicCards,
    KingdomCards:      GameCardID[][],
    TrashPile:         GameCardID[],
  } ) {
    if ( !databaseKey || !initObj ) return;
    this.databaseKey      = ( databaseKey || '' );
    this.cardPropertyList = ( initObj.cardPropertyList || [] );
    this.chatList         = ( initObj.chatList         || [] );
    this.turnInfo         = new TurnInfo( initObj.turnInfo );
    this.whoseTurn        = ( initObj.whoseTurn        || 0 );
    this.numberOfPlayers  = ( initObj.numberOfPlayers  || 0 );
    this.permute          = ( initObj.permute          || [] );
    this.players          = ( initObj.players          || [] ).map( e => new GamePlayer(e) );
    this.gameCardData     = ( initObj.gameCardData     || [] );
    this.BasicCards       = new BasicCards( initObj.BasicCards );
    this.KingdomCards     = ( initObj.KingdomCards     || [] );
    this.TrashPile        = ( initObj.TrashPile        || [] );
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
      const card = new GameCardData( { cardPropertyListIndex: cardListIndex, visible: true, visibleToMe: true } );
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
