import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'header-conversations-list-unassigned',
  templateUrl: './header-conversations-list-unassigned.component.html',
  styleUrls: ['./header-conversations-list-unassigned.component.scss'],
})
export class HeaderConversationsListUnassigned implements OnInit {

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
