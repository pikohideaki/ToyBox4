export class PlayerResult {
  name:      string;
  selected:  boolean;
  VP:        number;
  lessTurns: boolean;

  constructor( name: string = '' ) {
    this.name      = name;
    this.selected  = false;
    this.VP        = 0;
    this.lessTurns = false;
  }
}
