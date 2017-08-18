import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input() private sidenav;

  chatList: string[] = Array(10).fill( '( ˘ω˘ )ｸｩｩｩｩｩｩｩｿｫｫｫｫｩｩｩｩｩﾈｪｪｪｪﾐｨｨｨｨｨｲｵｫｫｫｩｩｳｳｳwwwww( ˘ω˘ )ｸｩｩｩｩｩｩｩｿｫｫｫｫｩｩｩｩｩﾈｪｪｪｪﾐｨｨｨｨｨｲｵｫｫｫｩｩｳｳｳwwwww' );
  newMessage: string = '';

  constructor() { }

  ngOnInit() {
  }

  submitMessage() {
    this.chatList.push( this.newMessage );
  }
}
