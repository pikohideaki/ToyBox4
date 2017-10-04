import { Injectable } from '@angular/core';

import { UtilitiesService } from '../../../my-library/utilities.service';
import { MyUserInfoService } from '../../../my-user-info.service';
import { FireDatabaseMediatorService } from '../../../fire-database-mediator.service';

import { CardProperty, numberToPrepare, toListIndex } from '../../../classes/card-property';
import { SelectedCards } from '../../../classes/selected-cards';
import { GameRoom } from '../../../classes/game-room';
import { GameState, PlayerData, PlayersCards, CardDataForPlayer } from '../../../classes/game-state';
import { BlackMarketPileCard } from '../../../classes/black-market-pile-card';



@Injectable()
export class AddGameGroupService {

  private cardPropertyList: CardProperty[] = [];


  constructor(
    private database: FireDatabaseMediatorService,
    private myUserInfo: MyUserInfoService,
    private utils: UtilitiesService,
  ) {
    this.database.cardPropertyList$
      .subscribe( val => this.cardPropertyList = val );
  }

  init(
    numberOfPlayers: number,
    selectedCards: SelectedCards,
    BlackMarketPileShuffled: BlackMarketPileCard[],
    isSelectedExpansions: boolean[],
    myName: string
  ) {
    const newRoom = new GameRoom();
    {
      newRoom.numberOfPlayers         = numberOfPlayers;
      newRoom.selectedCards           = selectedCards;
      newRoom.BlackMarketPileShuffled = BlackMarketPileShuffled;
      newRoom.isSelectedExpansions    = isSelectedExpansions;
    }

    // make new GameState object
    const newGameState = new GameState();
    {
      this.setNumberOfPlayers( newGameState, newRoom.numberOfPlayers );
      this.initCards( newGameState, newRoom.numberOfPlayers, newRoom.selectedCards );
      this.initDecks( newGameState );
    }
    newRoom.gameStateID = this.database.onlineGameState.add( newGameState ).key;

    // make new GameRoom object
    const newRoomID = this.database.onlineGameRoom.add( newRoom ).key;
    newRoom.databaseKey = newRoomID;

    // add me to GameRoom object
    this.database.onlineGameRoom.addMember( newRoomID, myName );

    return newRoom;
  }


  setNumberOfPlayers( newGameState: GameState, numberOfPlayers: number ) {
    newGameState.playersData = Array.from( new Array(numberOfPlayers), () => new PlayerData() );
    newGameState.cards.playersCards = Array.from( new Array(numberOfPlayers), () => new PlayersCards() );
    newGameState.cardDataForPlayer  = Array.from( new Array(numberOfPlayers), () => new CardDataForPlayer() );
    newGameState.permute = this.utils.permutation( numberOfPlayers );
  }


  initCards(
      newGameState: GameState,
      numberOfPlayers: number,
      selectedCards: SelectedCards
  ) {
    // local functions
    const toIndex = ( cardID: string ) => toListIndex( this.cardPropertyList, cardID );

    const addMultipleCards = ( placePath: (string|number)[], cardListIndex: number ) => {
      const N = numberToPrepare(
                  this.cardPropertyList,
                  cardListIndex,
                  newGameState.playersData.length,
                  selectedCards.DarkAges );
      for ( let i = 0; i < N; ++i ) {
        addCard( cardListIndex, placePath );
      }
    };

    const addCard = ( cardListIndex: number, placePath: (string|number)[] ) => {
      newGameState.commonCardData.cardListIndex.push( cardListIndex );
      for ( let i = 0; i < numberOfPlayers; ++i ) {
        newGameState.cardDataForPlayer[i].faceUp.push( false );
        newGameState.cardDataForPlayer[i].isButton.push( false );
      }

      const gameCardID = newGameState.commonCardData.cardListIndex.length - 1;

      let ref: any = newGameState.cards;
      for ( let i = 0; i < placePath.length; ++i ) {
        ref = ref[placePath[i]];
      }
      ref.push( gameCardID );
    };

    const usePotion = () => false;


    // dummy data
    newGameState.commonCardData.cardListIndex[0] = 0;
    for ( let i = 0; i < numberOfPlayers; ++i ) {
      newGameState.cardDataForPlayer[i].faceUp[0] = false;
      newGameState.cardDataForPlayer[i].isButton[0] = false;
    }

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


  initDecks( newGameState: GameState ) {
    newGameState.cards.playersCards.forEach( (playersCards, index) => {
      /* get 7 Coppers from supply */
      for ( let i = 0; i < 7; ++i ) {
        playersCards.Deck.push( newGameState.cards.BasicCards.Copper.pop() );
      }
      /* get 3 Estates from supply */
      for ( let i = 0; i < 3; ++i ) {
        playersCards.Deck.push( newGameState.cards.BasicCards.Estate.pop() );
      }

      this.utils.shuffle( playersCards.Deck );

      for ( let i = 0; i < 5; ++i ) {
        playersCards.HandCards.push( playersCards.Deck.pop() );
      }

      // this.sortHandCards( index, cardpropertyList );
    });
  }

}
