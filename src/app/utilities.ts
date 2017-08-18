
export function submatch( target: string, key: string, ignoreCase: boolean = false ): boolean {
  if ( ignoreCase ) {
    return submatch( target.toUpperCase(), key.toUpperCase() );
  }
  return target.indexOf( key ) !== -1;
}

export function shuffle( array: any[] ): void {
  const shuffled = getShuffled( array );
  shuffled.forEach( (v, i) => array[i] = v );
}


export function getShuffled( array: any[] ): any[] {
  return array
      .map( e => [e, Math.random()] )
      .sort( (x, y) => x[1] - y[1] )
      .map( pair => pair[0] );
}


export function permutation( n: number ): number[] {
  const ar = new Array<number>(n);
  for ( let i = 0; i < n; ++i ) { ar[i] = i; }
  return getShuffled( ar );
}

export function filterRemove<T>( array: Array<T>, f: (T) => boolean ): [ Array<T>, Array<T> ] {
  const rest = array.filter( e => !f(e) );
  return [ array.filter(f), rest ];
};
