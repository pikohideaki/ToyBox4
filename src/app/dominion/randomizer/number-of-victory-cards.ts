export class NumberOfVictoryCards {
  VPtoken        : number;  // 

  Curse          : number;  // -1
  Estate         : number;  //  1
  Duchy          : number;  //  3
  Province       : number;  //  6
  Colony         : number;  // 10
  Great_Hall     : number;  //  1
  Nobles         : number;  //  2
  Harem          : number;  //  2
  Farmland       : number;  //  2
  Island         : number;  //  2
  Tunnel         : number;  //  2
  Dame_Josephine : number;  //  2

  Gardens        : number;
  Duke           : number;  // 公爵
  Vineyard       : number;
  Fairgrounds    : number;  // 品評会
  Silk_Road      : number;
  Feodum         : number;  // 封土
  Distant_Lands  : number;

  Humble_Castle    : number;
  Crumbling_Castle : number;
  Small_Castle     : number;
  Haunted_Castle   : number;
  Opulent_Castle   : number;
  Sprawling_Castle : number;
  Grand_Castle     : number;
  Kings_Castle     : number;

  DeckSize                      : number;  // for Gardens
  numberOfActionCards           : number;  // for Vineyard
  numberOfDifferentlyNamedCards : number;  // for Fairgrounds
  numberOfSilvers               : number;  // for Feodum
  Distant_Lands_on_TavernMat    : number;  // for Distant_Lands


  constructor() {
    this.VPtoken        = 0;
    this.Curse          = 0;
    this.Estate         = 0;
    this.Duchy          = 0;
    this.Province       = 0;
    this.Colony         = 0;
    this.Great_Hall     = 0;
    this.Nobles         = 0;
    this.Harem          = 0;
    this.Farmland       = 0;
    this.Island         = 0;
    this.Tunnel         = 0;
    this.Dame_Josephine = 0;
    this.Gardens        = 0;
    this.Duke           = 0;
    this.Vineyard       = 0;
    this.Fairgrounds    = 0;
    this.Silk_Road      = 0;
    this.Feodum         = 0;
    this.Distant_Lands  = 0;

    this.Humble_Castle    = 0;
    this.Crumbling_Castle = 0;
    this.Small_Castle     = 0;
    this.Haunted_Castle   = 0;
    this.Opulent_Castle   = 0;
    this.Sprawling_Castle = 0;
    this.Grand_Castle     = 0;
    this.Kings_Castle     = 0;

    this.DeckSize                      = 0;
    this.numberOfActionCards           = 0;
    this.numberOfDifferentlyNamedCards = 0;
    this.numberOfSilvers               = 0;
    this.Distant_Lands_on_TavernMat    = 0;
  }


  countVictoryCards(): number {
    return 0
      + this.Estate
      + this.Duchy
      + this.Province
      + this.Colony
      + this.Great_Hall
      + this.Nobles
      + this.Harem
      + this.Farmland
      + this.Island
      + this.Tunnel
      + this.Dame_Josephine
      + this.Gardens
      + this.Duke
      + this.Vineyard
      + this.Fairgrounds
      + this.Silk_Road
      + this.Feodum
      + this.Distant_Lands
      + this.countCastles();
  }


  countCastles(): number {
    return 0
      + this.Humble_Castle
      + this.Crumbling_Castle
      + this.Small_Castle
      + this.Haunted_Castle
      + this.Opulent_Castle
      + this.Sprawling_Castle
      + this.Grand_Castle
      + this.Kings_Castle
  }


}
