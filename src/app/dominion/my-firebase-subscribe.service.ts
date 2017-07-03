import { Injectable } from '@angular/core';
// import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { CardProperty } from "./card-property";
import { GameResult } from "./game-result";
import { PlayerName } from "./player-name";
import { SyncGroup } from "./randomizer/sync-group";


@Injectable()
export class MyFirebaseSubscribeService {

  constructor( ) { }


  convertAs( val: any, targetname: string, ScoringList?: number[][] ) {
    let result = [];

    switch (targetname) {
      case "CardPropertyList":
        val.forEach( e => result.push( new CardProperty(e) ) );
        console.log( "convertAs CardPropertyList done. " );
        return result;

      case "DominionSetNameList":
        result = val.map( e => e.$value );
        console.log( "convertAs DominionSetNameList done. " );
        return result;

      case "GameResultList":
        val.forEach( e => result.push( new GameResult(e.val(), e.key) ) );
        let no = 1;
        result.forEach( gr => { gr.setScores( ScoringList ); gr.no = no++; } );
        console.log( "convertAs GameResultList done. " );
        return result;

      case "PlayersNameList":
        val.forEach( e => result.push( new PlayerName(e) ) );
        console.log( "convertAs PlayersNameList done. " );
        return result;

      case "ScoringList":
        val.forEach( e => result.push( Array.from(e) ) );
        console.log( "convertAs ScoringList done. " );
        return result;

      case "users" :
        // val.forEach( e => result.push( { name: e.name, groupID: e.groupID } ) );
        val.forEach( e => result.push(
          {
            id: e.key,
            data: { name: e.val().name,  groupID: e.val().groupID }
          } ) );
        console.log( "convertAs users done. " );
        return result;

      case "syncGroups":
        val.forEach( e => result.push( { id: e.key, selected: false, data: new SyncGroup( e.val() ) } ) );
        console.log( "convertAs syncGroups done. " );
        return result;

      default:
        break;
    }
  }

}
