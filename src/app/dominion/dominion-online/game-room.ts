export class GameRoom {
  id:        number;
  name:      string = '';
  members:   string[] = [];
  timeStamp: Date;
  selected:  boolean = false;
  numberOfPlayers: number = 2;

  constructor( init_members? ) {
    this.id = Date.now();
    this.timeStamp = new Date( Date.now() );
    this.members = ( init_members || ['Alice', 'Bob', 'Charlie', 'Dave'] );
  }
}
