import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-waiting-spinner',
  template: `<md-spinner *ngIf="!done" class="waitingSpinner" ></md-spinner>`,
  styles: [` .waitingSpinner { width:48px; } `],
})
export class WaitingSpinnerComponent implements OnInit {

  @Input() done: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
