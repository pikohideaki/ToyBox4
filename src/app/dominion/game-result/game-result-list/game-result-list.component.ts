import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';


import { DataTableComponent } from '../../../data-table/data-table.component';
import { ItemsPerPageComponent, initializeItemsPerPageOption } from '../../../data-table/items-per-page/items-per-page.component';
import { PagenationComponent, getPagenatedData } from '../../../data-table/pagenation/pagenation.component';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { DominionDatabaseService } from '../../dominion-database.service';
import { GameResult } from '../../game-result';
import { GameResultDetailDialogComponent } from './game-result-detail-dialog/game-result-detail-dialog.component';


@Component({
  selector: 'app-game-result-list',
  templateUrl: './game-result-list.component.html',
  styleUrls: [
    '../../../data-table/data-table.component.css',
    './game-result-list.component.css'
  ]
})
export class GameResultListComponent implements OnInit {
  receiveDataDone = false;

  @Input() gameResultListFiltered$: Observable<GameResult[]>;
  private gameResultListFiltered: GameResult[] = [];

  // pagenation
  private selectedPageIndexSource = new BehaviorSubject<number>(0);
  private itemsPerPageSource = new BehaviorSubject<number>(200);
  selectedPageIndex$ = this.selectedPageIndexSource.asObservable();
  itemsPerPage$ = this.itemsPerPageSource.asObservable();

  currentPageData$: Observable<GameResult[]>;


  constructor(
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private database: DominionDatabaseService
  ) {}

  ngOnInit() {
    this.gameResultListFiltered$.subscribe( gameResultListFiltered => {
      this.receiveDataDone = true;
      this.changeSelectedPageIndex(0);
      this.gameResultListFiltered = gameResultListFiltered;
    });

    this.currentPageData$
      = this.gameResultListFiltered$.combineLatest(
          this.itemsPerPage$,
          this.selectedPageIndex$,
          ( gameResultListFiltered, itemsPerPage, selectedPageIndex ) =>
              getPagenatedData(
                  Array.from( gameResultListFiltered ).reverse(),
                  itemsPerPage,
                  selectedPageIndex ) );
  }


  changeSelectedPageIndex( selectedPageIndex: number ) {
    this.selectedPageIndexSource.next(selectedPageIndex);
  }
  changeItemsPerPage( itemsPerPage: number ) {
    this.itemsPerPageSource.next(itemsPerPage);
    this.changeSelectedPageIndex(0);
  }


  getDetail( no: number ) {
    const grIndex: number = this.gameResultListFiltered.findIndex( e => e.no === no );
    const gameResult = this.gameResultListFiltered[grIndex];
    const databaseKey = gameResult.databaseKey;

    const dialogRef = this.dialog.open( GameResultDetailDialogComponent );
    dialogRef.componentInstance.gameResult = gameResult;
  }

  deleteGameResult( no: number ) {
    const grIndex: number = this.gameResultListFiltered.findIndex( e => e.no === no );
    const databaseKey = this.gameResultListFiltered[grIndex].databaseKey;

    const dialogRef = this.dialog.open( ConfirmDialogComponent );
    dialogRef.componentInstance.message = `No.${no} を削除してもよろしいですか？`;
    dialogRef.afterClosed().subscribe( answer => {
      if ( answer === 'yes' ) {
        this.database.removeGameResult( databaseKey );
        this.openSnackBar();
      }
    });
  }

  private openSnackBar() {
    this.snackBar.open( 'Deleted.', undefined, { duration: 3000 } );
  }

}
