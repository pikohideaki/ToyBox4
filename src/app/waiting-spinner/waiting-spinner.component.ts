import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-waiting-spinner',
  templateUrl: './waiting-spinner.component.html',
  styleUrls: ['./waiting-spinner.component.css']
})
export class WaitingSpinnerComponent implements OnInit {

  @Input() done: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
