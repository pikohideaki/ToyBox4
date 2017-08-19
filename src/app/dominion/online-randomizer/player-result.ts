export class PlayerResult {
  name:      string  = '';
  selected:  boolean = false;
  VP:        number  = 0;
  lessTurns: boolean = false;

  constructor( name: string = '' ) {
    this.name = name;
  }
}
