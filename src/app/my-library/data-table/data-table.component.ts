import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';


import { UtilitiesService } from '../utilities.service';

import { ResetButtonComponent } from './reset-button.component';
import { ItemsPerPageComponent } from './items-per-page/items-per-page.component';
import { PagenationComponent, getDataAtPage } from './pagenation/pagenation.component';


@Component({
  providers: [ResetButtonComponent],
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, OnChanges  {

  @Input() data: any[] = [];
  filteredData: any[] = [];

  @Input()
  columnSettings: {
        name:         string,
        align:        string,
        manip:        string,
        manipState:   any,
        options:      string[],
        asyncOptions: any,
        button:       boolean,
        headerTitle:  string,
    }[] = [];

  // pagenation
  @Input() itemsPerPageOptions: number[];
  @Input() itemsPerPageDefault: number = Number.MAX_VALUE;
  itemsPerPage: number = 100;
  selectedPageIndex: number = 0;

  @Output() onClick = new EventEmitter<{ rowIndex: number, columnName: string }>();

  stateCtrl: FormControl;


  constructor(
    private utils: UtilitiesService,
    private resetButton: ResetButtonComponent
  ) {
    this.stateCtrl = new FormControl();
  }

  ngOnChanges( changes: SimpleChanges ) {
    if ( changes.data !== undefined ) {  // at http-get done
      this.columnSettings.forEach( e => {
        e.asyncOptions = this.stateCtrl.valueChanges
                    .startWith(null)
                    .map( inputString => this.filterAsyncOptions( e.name, inputString) );
      });
      this.updateView();
    }
  }

  ngOnInit() {
    this.itemsPerPage = this.itemsPerPageDefault;
  }


  filterAsyncOptions( columnName: string, inputString: string ): string[] {
    const uniqValues = this.utils.uniq( this.filteredData.map( e => e[columnName] ) );
    return inputString ? uniqValues.filter( s => this.utils.submatch( s, inputString, true ) )
                       : uniqValues;
  }


  updateView() {
    this.filteredData = ( !this.data ? [] : this.data.filter( x => this.filterFunction(x) ) );
    this.setSelectorOptions( this.filteredData );
    this.selectedPageIndex = 0;
  }

  reset( name?: string ): void {
    this.resetButton.resetSelector( this.columnSettings, name );
    this.updateView();
  }


  filterFunction( lineOfData: any ): boolean {
    const validSettings = this.columnSettings.filter( column => column.manipState !== undefined );

    for ( const column of validSettings ) {
      switch ( column.manip ) {
        case 'filterBySelecter' :
          if ( lineOfData[ column.name ] !== column.manipState ) return false;
          break;

        case 'incrementalSearch' :
          if ( !this.utils.submatch( lineOfData[ column.name ], column.manipState, true ) ) return false;
          break;

        default :
          break;
      }
    }
    return true;
  }


  /* データから指定列を取り出す */
  getColumn( data: any[], columnName: string ): any[] {
    return data.map( e => e[ columnName ] );
  }

  setSelectorOptions( data: any[] ): any {
    const selectorOptions = {};
    for ( const e of this.columnSettings ) {
        if ( e.manip !== 'filterBySelecter' ) continue;
        e.options = this.utils.uniq( this.getColumn( data, e.name ) );
    }
    return selectorOptions;
  }



/* フィルタ済みの表示直前データから指定ページ範囲分のみ取り出す */
  getDataAtPage( selectedPageIndex: number ): any[] {
    return getDataAtPage(
        this.filteredData,
        this.itemsPerPage,
        selectedPageIndex );
  }


  clicked( rowIndex: number, columnName: string ) {
    this.onClick.emit( {
      rowIndex: this.indexOnDataBeforeFilter( this.itemsPerPage * this.selectedPageIndex + rowIndex ),
      columnName: columnName } );
  }

  indexOnDataBeforeFilter( indexOnFilteredData: number ): number {
    let filteredDataNum = 0;
    for ( let i = 0; i < this.data.length; ++i ) {
      if ( this.filterFunction(this.data[i]) ) filteredDataNum++;
      if ( filteredDataNum > indexOnFilteredData ) return i;
    }
    return this.data.length - 1;
  }

  // sort( columnName: string ) {
  //   console.log('sort', columnName );
  // }
}
