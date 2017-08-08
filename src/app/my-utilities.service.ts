import { Injectable } from '@angular/core';

@Injectable()
export class MyUtilitiesService {

  constructor() { }

  localStorage_set( key: string, value: any ) {
    localStorage.setItem( key, JSON.stringify( value ) );
  }

  localStorage_get( key: string ) {
    return JSON.parse( localStorage.getItem( key ) );
  }

  localStorage_has( key: string ): boolean {
    return ( localStorage.getItem( key ) != null );
  }

  submatch( target: string, key: string, ignoreCase: boolean = false ): boolean {
    if ( ignoreCase ) {
      return this.submatch( target.toUpperCase(), key.toUpperCase() );
    }
    return target.indexOf( key ) !== -1;
  }

  objectForEach( object: any, f: (element: any, key?: any, object?: any) => any ) {
    Object.keys( object ).forEach( key => f( object[key], key, object ) );
  }


  toYMD( date: Date ): string {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

  toHMS( date: Date ): string {
    const padzero = ( str => ('00' + str).slice(-2) );
    return `${padzero(date.getHours())}:${padzero(date.getMinutes() + 1)}:${padzero(date.getSeconds())}`;
  }

  toYMDHMS( date: Date ): string {
    return `${this.toYMD( date )} ${this.toHMS( date )}`;
  }

  getYestereday( date: Date ): Date {
    const yestereday = new Date( date );
    yestereday.setDate( yestereday.getDate() - 1 );  // yesterday
    return yestereday;
  }

  getTommorow( date: Date ): Date {
    const tommorow = new Date( date );
    tommorow.setDate( tommorow.getDate() - 1 );  // yesterday
    return tommorow;
  }

  getMidnightOfDate( date: Date ): Date {
    const midnight = new Date( date );
    midnight.setHours(0);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);
    return midnight;
  }

  roundAt( val: number, precision: number ) {
    const digit = Math.pow(10, precision);
    val *= digit;
    val = Math.round( val );
    return val / digit;
  }

  RandomNumber( Min: number, Max: number ): number {
    return Min + Math.floor( Math.random() * ( Max - Min + 1 ) );
  }

  isEmpty( ar: any[] ): boolean {
    return ar.length === 0;
  }

  back<T>( ar: Array<T> ): T {
    return ar[ ar.length - 1 ];
  };

  front<T>( ar: Array<T> ): T {
    return ar[0];
  };

  removeIf<T>( ar: Array<T>, f: (T) => boolean ): T {
    return this.removeAt( ar, ar.findIndex(f) );
  }


  /**
   * @description alias of `ar.splice( index, 1 )[0]`;  Delete the element at address `index`
   * @return the deleted element
   */
  removeAt<T>( ar: Array<T>, index: number ): T {
    return ar.splice( index, 1 )[0];
  };

  removeValue<T>( ar: Array<T>, target: T ): Array<T> {
    return ar.filter( e => e !== target );
  };

  append( ar1: any[], ar2: any[] ): any[] {
    return [].concat( ar1, ar2 );
  }


  // let a = [ 1,2,3,[1,2,3],5 ];
  // let b = this.utils.makeShallowCopy(a);
  // a[2] = 999;
  // a[3][1] = 9999;
  copy<T>( ar: Array<T> ): Array<T> {
    return [].concat( ar );
  }


  shallowCopy( obj, asArray?: boolean ) {
    if ( asArray ) return Object.assign([], obj);
    return Object.assign({}, obj);
  }

  filterRemove<T>( array: Array<T>, f: (T) => boolean ): [ Array<T>, Array<T> ] {
    const others = array.filter( (e) => !f(e) );
    return [ array.filter(f), others ];
  };

  // copy and return unique array
  // 要素の値を定義する関数（この値の同値性でuniqをかける
  uniq<T>( ar: Array<T>, f: (T) => any = ( (e) => e ) ) {
    return ar.map( (e) => [ e, f(e) ] )
        .filter( (val, index, array ) => (array.map( a => a[1] ).indexOf( val[1] ) === index) )
        .map( a => a[0] );
  };

  sortNumeric( array: any[] ): any[] {
    return array.sort( (a, b) => ( parseFloat(a) - parseFloat(b) ) );
  };


  swap( array: any[], index1: number, index2: number ): void {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  }

  shuffle( array: any[] ): any[] {
    return array
        .map( (e) => [e, Math.random()] )
        .sort( (x, y) => x[1] - y[1] )
        .map( (pair) => pair[0] );
  }

  permutation( n: number ): number[] {
    const ar = new Array<number>(n);
    for ( let i = 0; i < n; ++i ) { ar[i] = i; }
    return this.shuffle( ar );
  }

  setDifference( sortedArray1: number[], sortedArray2: number[] ): number[] {
    const result: number[] = [];
    let it1 = 0;  // iterator for sortedArray1
    let it2 = 0;  // iterator for sortedArray2
    let val1 = sortedArray1[it1];
    let val2 = sortedArray2[it2];
    while ( it1 < sortedArray1.length && it2 < sortedArray2.length ) {
      if ( val1 === val2 ) {
        val1 = sortedArray1[++it1];
        val2 = sortedArray2[++it2];
      } else if ( val1 < val2 ) {
        result.push(val1);
        val1 = sortedArray1[++it1];
      } else {
        val2 = sortedArray2[++it2];
      }
    }
    for ( ; it1 < sortedArray1.length; ++it1 ) {
      result.push( sortedArray1[it1] );
    }
    return result;
  }

  getRandomValue<T>( array: Array<T> ): T {
    return array[ this.RandomNumber( 0, array.length - 1 ) ];
  }

  sleep( sec: number ): Promise<any> {
    return new Promise( resolve => setTimeout( resolve, sec * 1000 ) );
  }

  /**
   * @description return minimum element of given Array<number>
   */
  minOfArray( arr: Array<number> ): number {
    let min = Infinity;
    const QUANTUM = 32768;

    for (let i = 0, len = arr.length; i < len; i += QUANTUM) {
      const submin = Math.min.apply(null, arr.slice(i, Math.min(i + QUANTUM, len)));
      min = Math.min(submin, min);
    }
    return min;
  }

  /**
   * @description return maximum element of given Array<number>
   */
  maxOfArray( arr: Array<number> ): number {
    let max = -Infinity;
    const QUANTUM = 32768;

    for ( let i = 0, len = arr.length; i < len; i += QUANTUM ) {
      const submax = Math.max.apply(null, arr.slice(i, Math.max(i + QUANTUM, len)));
      max = Math.max(submax, max);
    }
    return max;
  }

  integerDivision( a: number, b: number ): number {
    return Math.floor( a / b );
  }

  /**
   * @description (0, 5) => [0,1,2,3,4], (2,12,3) => [2,5,8,11]
   * @param start start number
   * @param length array length
   * @param step step number (default = 1)
   * @return the number sequence array
   */
  numberSequence( start: number, length: number, step: number = 1 ): number[] {
    return Array.from( new Array(length) ).map( (_, i) => i * step + start );
  }
}

