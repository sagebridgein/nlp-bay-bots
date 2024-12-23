import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'header-conversations-list-archived',
  templateUrl: './header-conversations-list-archived.component.html',
  styleUrls: ['./header-conversations-list-archived.component.scss'],
})
export class HeaderConversationsListArchived implements OnInit {

  @Input() headerTitle: string
  @Input() isMobile: boolean;
  @Output() onBackButton = new EventEmitter<boolean>();
  static UserPresenceComponent: any[] | any;

  constructor() { }

  ngOnInit() {
    // console.log('headertitleeee', this.headerTitle)
  }

  onBackButtonHandler(){
    this.onBackButton.emit(true)
  }

}
