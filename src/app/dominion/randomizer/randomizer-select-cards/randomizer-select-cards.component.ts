import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { MdDialog } from '@angular/material';

import { MyUtilitiesService } from '../../../my-utilities.service';
import { MyFirebaseSubscribeService } from "../../my-firebase-subscribe.service";
import { AlertDialogComponent } from "../../../alert-dialog/alert-dialog.component";


import { MyDataTableComponent } from '../../../my-data-table/my-data-table.component';
import { CardProperty } from "../../card-property";
import { SelectedCards } from "../../selected-cards";
import { SelectedCardsCheckboxValues } from "../../selected-cards-checkbox-values";
import { SyncGroup } from "../sync-group";
import { UserInfo } from "../../../user-info";
import { CardPropertyDialogComponent } from '../../card-property-dialog/card-property-dialog.component';


@Component({
  providers: [MyUtilitiesService],
  selector: 'app-randomizer-select-cards',
  templateUrl: './randomizer-select-cards.component.html',
  styleUrls: [
    '../../../my-data-table/my-data-table.component.css',
    './randomizer-select-cards.component.css'
  ]
})
export class RandomizerSelectCardsComponent implements OnInit, OnChanges, OnDestroy {

  httpGetDone: boolean = false;

  @Input() CardPropertyList: CardProperty[] = [];

  DominionSetList: { name: string, selected: boolean }[] = [];

  @Output() DominionSetListToggleChange = new EventEmitter<{ index: number, selected: boolean }>();

  @Input()  SelectedCards: SelectedCards = new SelectedCards();
  @Output() SelectedCardsChange = new EventEmitter<SelectedCards>();

  SelectedCardsCheckboxValues = new SelectedCardsCheckboxValues();


  users: UserInfo[] = [];
  syncGroups: { id: string, selected: boolean, data: SyncGroup }[];

  signedIn: boolean = false;
  mySyncGroup$;
  mySyncGroupID: string;

  randomizerButtonDisabled: boolean = false;
  AllSetsSelected: boolean = true;

  subscriptions = [];

  constructor(
    private utils: MyUtilitiesService,
    public dialog: MdDialog,
    private afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService,
    public afAuth: AngularFireAuth
  ) {
  }

  ngOnInit() {
    const me$ = this.afAuth.authState;


    this.subscriptions.push(
      this.afDatabase.list( '/data/DominionSetNameList' ).subscribe( val => {
        this.DominionSetList = this.afDatabaseService.convertAs( val, "DominionSetNameList" )
                                    .map( e => { return { name: e, selected: false } } );

        this.subscriptions.push(
          me$.subscribe( me => {
            this.signedIn = !!me;
            if ( !this.signedIn ) return;

            const myID = me.uid;
            this.subscriptions.push(
              this.afDatabase.object(`/userInfo/${myID}/dominionGroupID`).subscribe( val => {
                this.mySyncGroupID = val.$value;
                if ( !this.mySyncGroupID ) return;
                this.setSubscribers();
              })
            );
          } )
        );

      })
    );

  }


  ngOnChanges( changes: SimpleChanges ) {
    if ( changes.DominionSetList != undefined ) {  // at http-get done
      // this.setSubscribers();
      // console.log(changes)
    }
  }


  ngOnDestroy() {
    this.subscriptions.forEach( e => e.unsubscribe() );
  }


  private setSubscribers() {
    this.subscriptions.push(
      this.afDatabase.object(`/syncGroups/${this.mySyncGroupID}/randomizerButtonDisabled`)
        .subscribe( val => this.randomizerButtonDisabled = val.$value )
    );

    this.subscriptions.push(
      this.afDatabase.object(`/syncGroups/${this.mySyncGroupID}/SelectedCards`).subscribe( val => {
        this.SelectedCards = new SelectedCards(val);
        this.SelectedCardsChange.emit( this.SelectedCards );
      })
    );

    for ( let i = 0; i < this.DominionSetList.length; ++i ) {
      this.subscriptions.push(
        this.afDatabase.object(`/syncGroups/${this.mySyncGroupID}/DominionSetsSelected/${i}`).subscribe( val => {
          // console.log( `DominionSetsSelected ${i} -> ${val.$value}` );
          this.DominionSetList[i].selected = val.$value;
          this.DominionSetListToggleChange.emit( {
            index    : i,
            selected : this.DominionSetList[i].selected,
          } );
        } )
      );
    }

    Object.keys( this.SelectedCardsCheckboxValues ).forEach( key => {
      for ( let i = 0; i < this.SelectedCardsCheckboxValues[key].length; ++i ) {
        this.subscriptions.push(
          this.afDatabase.object(`/syncGroups/${this.mySyncGroupID}/SelectedCardsCheckboxValues/${key}/${i}`)
          .subscribe( val => {
            this.SelectedCardsCheckboxValues[key][i] = val.$value;
          } )
        );
      }
    });
  }



  cardInfoButtonClicked( cardIndex ) {
    const selectedCardForView = this.CardPropertyList[cardIndex].transform();
    const dialogRef = this.dialog.open( CardPropertyDialogComponent );
    dialogRef.componentInstance.card = selectedCardForView;
  }


  toggleDominionSetList( event, index ) {
    // console.log(event.checked,index)

    this.DominionSetListToggleChange.emit( {
      index    : index,
      selected : this.DominionSetList[index].selected,
    } );

    if ( this.signedIn && this.mySyncGroupID !== "" ) {
      this.afDatabase.object( `/syncGroups/${this.mySyncGroupID}/DominionSetsSelected/${index}`)
        .set( event.checked );
    }
  }

  SelectedCardsCheckboxOnChange( category, index ) {
    if ( this.signedIn && this.mySyncGroupID !== "" ) {
      this.afDatabase.object( `/syncGroups/${this.mySyncGroupID}/SelectedCardsCheckboxValues/${category}/${index}`)
        .set( this.SelectedCardsCheckboxValues[category][index] );
    }
  }



  toggleRandomizerButton( flag: boolean ) {
    this.randomizerButtonDisabled = !flag;
    if ( this.signedIn && this.mySyncGroupID !== "" ) {
      this.afDatabase.object( `/syncGroups/${this.mySyncGroupID}/randomizerButtonDisabled`)
        .set( this.randomizerButtonDisabled );
    }
  }

  randomizerClicked() {
    if ( this.DominionSetList.every( DominionSet => !DominionSet.selected ) ) return;

    // this.toggleRandomizerButton(false);

    if ( !this.randomizer() ) {
      // alert
      console.log("alert")
      const dialogRef = this.dialog.open( AlertDialogComponent );
      dialogRef.componentInstance.message
        = `サプライが足りません．セットの選択数を増やしてください．`;
      return;
    }

    this.SelectedCardsChange.emit( this.SelectedCards );
    this.SelectedCardsCheckboxValues.reset();

    if ( this.signedIn && this.mySyncGroupID !== "" ) {
      this.afDatabase.object( `/syncGroups/${this.mySyncGroupID}/SelectedCards`)
        .set( this.SelectedCards );
      this.afDatabase.object( `/syncGroups/${this.mySyncGroupID}/SelectedCardsCheckboxValues`)
        .set( this.SelectedCardsCheckboxValues );
    }
  }



  private randomizer(): boolean {
    this.SelectedCards.reset();  // reset

    // 選択されている拡張セットに含まれているカードすべてをシャッフルし，indexとペアにしたリスト
    let CardsInSelectedSets_Shuffled: { index: number, data: CardProperty }[]
     = this.utils.shuffle(
      this.CardPropertyList
      .map( (val,index) => { return { index: index, data: val }; } )
      .filter ( e => e.data.randomizer_candidate )
      .filter( e => this.DominionSetList
                     .filter( s => s.selected )
                     .map( s => s.name )
                     .findIndex( val => val == e.data.set_name ) >= 0 )
      );

    // 10 Supply KingdomCards10 and Event, LandmarkCards
    while ( this.SelectedCards.KingdomCards10.length < 10 ) {
      let card = CardsInSelectedSets_Shuffled.pop();
      if ( !card ) return false;
      if ( card.data.category == '王国' ) {
        this.SelectedCards.KingdomCards10.push( card.index );
      }
      if ( (this.SelectedCards.EventCards.length + this.SelectedCards.LandmarkCards.length ) < 2 ) {
        if ( card.data.card_type == 'イベント' ) {
          this.SelectedCards.EventCards.push( card.index );
        }
        if ( card.data.card_type == 'ランドマーク' ) {
          this.SelectedCards.LandmarkCards.push( card.index );
        }
      }
    }


    // 繁栄場・避難所場の決定
    this.SelectedCards.Prosperity = ( this.CardPropertyList[ this.SelectedCards.KingdomCards10[0] ].set_name === '繁栄' );
    this.SelectedCards.DarkAges   = ( this.CardPropertyList[ this.SelectedCards.KingdomCards10[9] ].set_name === '暗黒時代' );


    // 災いカード（収穫祭：魔女娘）
    if ( this.SelectedCards.KingdomCards10
        .findIndex( e => this.CardPropertyList[e].name_jp == '魔女娘' ) >= 0 )
    {
      if ( CardsInSelectedSets_Shuffled.length <= 0 ) return false;
      const cardIndex = this.utils.removeIf( CardsInSelectedSets_Shuffled, e => (
               e.data.cost.debt   == 0
            && e.data.cost.potion == 0
            && e.data.cost.coin   >= 2
            && e.data.cost.coin   <= 3 ) ).index;
      this.SelectedCards.BaneCard = [cardIndex];
    }

    // Black Market (one copy of each Kingdom card not in the supply. 15種類選択を推奨)
    if ( [].concat( this.SelectedCards.KingdomCards10, this.SelectedCards.BaneCard )
           .findIndex( e => this.CardPropertyList[e].name_jp == '闇市場' ) >= 0 )
    {
      while ( this.SelectedCards.BlackMarketPile.length < 15 ) {
        let card = CardsInSelectedSets_Shuffled.pop();
        if ( !card ) return false;
        if ( card.data.category == '王国' ) {
          this.SelectedCards.BlackMarketPile.push( card.index );
        }
      }
    }

    // Obelisk (Choose 1 Action Supply Pile)
    if ( this.SelectedCards.LandmarkCards
        .findIndex( e => this.CardPropertyList[e].name_eng == 'Obelisk' ) >= 0 )
    {
      const cardIndex: number = ( () => {
        let supplyUsed: number[] = [].concat( this.SelectedCards.KingdomCards10, this.SelectedCards.BaneCard );
        let ObeliskCandidatesActionCards: number[] = this.utils.copy( supplyUsed );
        if ( supplyUsed.findIndex( e => this.CardPropertyList[e].card_type.includes('略奪者') ) >= 0 ) {
          let ruinsIndex: number = this.CardPropertyList.findIndex( e => e.name_jp == '廃墟' );
          ObeliskCandidatesActionCards.unshift( ruinsIndex );
        }
        return this.utils.getRandomValue( supplyUsed );
      } )();
      this.SelectedCards.Obelisk = [cardIndex];
    }

    this.SelectedCards.KingdomCards10 .sort( (a,b) => a - b );   // 繁栄場・避難所場の決定後にソート
    this.SelectedCards.EventCards     .sort( (a,b) => a - b );
    this.SelectedCards.LandmarkCards  .sort( (a,b) => a - b );
    this.SelectedCards.BlackMarketPile.sort( (a,b) => a - b );

    return true;
  }

}
