import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message-dialog',
  template: `
    <div md-dialog-content>
      {{message}}
    </div>
  `,
  styles: []
})
export class MessageDialogComponent implements OnInit {

  @Input() message: string;

  constructor() { }

  ngOnInit() {
  }

}
